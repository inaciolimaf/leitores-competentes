import hashlib
import json
import logging
import math
import os
import random
from datetime import datetime

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from tavily import TavilyClient

from app.core.config import settings
from app.core.prompts import GENERATION_PROMPT, SEARCH_PROMPT, SYSTEM_PROMPT
from app.models.descriptors import DESCRIPTORS
from app.models.schemas import GenerateResponse
from app.modules.media.service import download_image_locally, describe_image_vision
from app.modules.media.cache import get_tavily_cache, save_tavily_cache, get_image_cache, save_image_cache
from .state import AgentState

logger = logging.getLogger(__name__)

def _get_llm() -> ChatOpenAI:
    return ChatOpenAI(
        model=settings.OPENROUTER_MODEL,
        openai_api_base="https://openrouter.ai/api/v1",
        openai_api_key=settings.OPENROUTER_API_KEY,
        temperature=0.7,
        max_tokens=16000,
    )

def plan_questions(state: AgentState) -> dict:
    descriptors = state["descriptors"]
    quantity = state["quantity"]
    difficulty = state["difficulty"]

    details_parts = []
    for code in descriptors:
        desc = DESCRIPTORS.get(code)
        if desc:
            details_parts.append(
                f"- **{code}** — {desc['name']}: {desc['description']}\n"
                f"  Tipos de texto: {', '.join(desc['text_types'])}\n"
                f"  Notas: {desc['notes']}"
            )
    
    descriptors_detail = "\n".join(details_parts)
    num_texts = max(1, math.ceil(quantity / 5))
    needs_image = any(DESCRIPTORS.get(d, {}).get("needs_image", False) for d in descriptors)

    search_plan = f"Preciso de aproximadamente {num_texts} texto(s)-base diferentes."
    if needs_image:
        search_plan += "\nIncluindo busca por tirinhas/HQs com imagem para o descritor 2L6."

    return {
        "search_plan": search_plan,
        "descriptors_detail": descriptors_detail,
        "messages": [SystemMessage(content=SYSTEM_PROMPT.format(difficulty=difficulty))],
    }

async def search_content(state: AgentState) -> dict:
    descriptors = state["descriptors"]
    search_client = TavilyClient(api_key=settings.TAVILY_API_KEY)
    tavily_cache = get_tavily_cache()
    image_cache = get_image_cache()
    
    all_results = []
    searched_queries = set()

    for code in descriptors:
        desc = DESCRIPTORS.get(code)
        if not desc: continue
        
        # Otimização 1: Não buscar no Tavily para descritores apenas de texto! O LLM vai inventar.
        if not desc.get("needs_image"):
            all_results.append(f"### Mande o Gênio (LLM) inventar textos originais para o descritor {code}!")
            continue

        # Otimização 3: Sortear **uma** query em vez de buscar todas
        if desc["search_queries"]:
            query = random.choice(desc["search_queries"])
            if query in searched_queries: continue
            searched_queries.add(query)

            images_to_use = []
            query_hash = hashlib.md5(query.encode("utf-8")).hexdigest()
            
            # --- Tavily Search with Logic to Force Refresh ---
            results_dict = None
            for attempt in range(2):
                if settings.USE_TAVILY_CACHE and attempt == 0 and query_hash in tavily_cache:
                    results_dict = tavily_cache[query_hash]
                else:
                    try:
                        results_dict = search_client.search(query=query, include_images=True, max_results=5)
                        tavily_cache[query_hash] = results_dict
                        save_tavily_cache(tavily_cache)
                    except Exception as e:
                        logger.error(f"Tavily API Error: {e}")
                        if query_hash in tavily_cache: results_dict = tavily_cache[query_hash]
                
                if not results_dict: break

                # --- Image Validation (Downloads & Vision) ---
                unverified_images = results_dict.get("images", [])
                for img_url in unverified_images[:10]:
                    if img_url in image_cache:
                        cached = image_cache[img_url]
                        # Se já foi marcada como rejeitada no cache antereiormente, pula ela na hora!
                        if cached.get("description") == "REJECTED":
                            continue
                            
                        if os.path.exists(os.path.join(settings.BASE_DIR, cached["url"].lstrip("/api/"))):
                            images_to_use.append(cached)
                            if len(images_to_use) >= 3: break
                            continue

                    local_url = await download_image_locally(img_url)
                    if local_url:
                        desc_vis = await describe_image_vision(local_url)
                        if any(x in desc_vis for x in ["REJEITADA_ATIVIDADE", "REJEITADA_IDIOMA", "REJEITADA_QUALIDADE", "[ERRO_VISION]"]):
                            logger.info(f"Imagem ignorada por filtro ou falha no provedor: {img_url}")
                            # Salva a rejeicao no cache para não perder tempo com essa URL no futuro
                            image_cache[img_url] = {"url": local_url, "description": "REJECTED"}
                            save_image_cache(image_cache)
                            try:
                                os.remove(os.path.join(settings.BASE_DIR, local_url.lstrip("/api/")))
                            except Exception: pass
                            continue
                            
                        img_data = {"url": local_url, "description": desc_vis}
                        images_to_use.append(img_data)
                        image_cache[img_url] = img_data
                        save_image_cache(image_cache)
                    if len(images_to_use) >= 3: break
                
                # Check for stale cache
                needs_img = desc.get("needs_image", False)
                if (unverified_images and not images_to_use) or (needs_img and not unverified_images):
                    if attempt == 0: continue # Retry with fresh search
                break

            if results_dict:
                # Se o descritor exige imagem e não conseguimos NENHUMA imagem válida, abortamos essa query para evitar alucinação da IA.
                if desc.get("needs_image") and not images_to_use:
                    logger.warning(f"Abortando busca '{query}' porque nenhuma imagem válida foi processada.")
                    continue
            
                # Otimização 2: "Pool" no Cache. Embaralhar e sortear 2 imagens, e pegar alguns textos aleatórios.
                results = results_dict.get("results", [])
                if len(results) > 2: results = random.sample(results, 2)
                content_parts = [f"### Fonte: {r['url']}\n{r['content']}" for r in results]
                
                if images_to_use:
                    # random sort the images to use to add variety
                    if len(images_to_use) > 1: images_to_use = random.sample(images_to_use, min(2, len(images_to_use)))
                    content_parts.append("\n### Imagens Relacionadas:")
                    for img in images_to_use:
                        content_parts.append(f"- URL Local: {img['url']}\n  DESCRIÇÃO INTERNA (NÃO MOSTRAR AO ALUNO): {img['description']}")
                all_results.append(f"### Busca: {query}\n" + "\n".join(content_parts))

    search_msg = SEARCH_PROMPT.format(
        descriptors=", ".join(descriptors),
        quantity=state["quantity"],
        difficulty=state["difficulty"],
        search_plan=state["search_plan"],
    )

    return {
        "search_results": "\n\n---\n\n".join(all_results),
        "messages": [HumanMessage(content=search_msg)],
    }

async def generate_questions(state: AgentState) -> dict:
    llm = _get_llm()
    gen_msg = GENERATION_PROMPT.format(
        search_results=state["search_results"][:8000],
        quantity=state["quantity"],
        difficulty=state["difficulty"],
        descriptors_detail=state["descriptors_detail"],
    )
    
    try:
        response = await llm.ainvoke(state["messages"] + [HumanMessage(content=gen_msg)])
        return {"messages": [response]}
    except Exception as e:
        return {"error": f"Erro na geração: {e}"}

def validate_output(state: AgentState) -> dict:
    if state.get("error"): return {}
    last_msg = next((m for m in reversed(state["messages"]) if isinstance(m, AIMessage)), None)
    if not last_msg: return {"error": "Sem resposta."}
    
    content = last_msg.content
    try:
        # Simple extraction logic
        json_str = content
        if "```json" in content:
            json_str = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            json_str = content.split("```")[1].split("```")[0]
        
        data = json.loads(json_str)
        response = GenerateResponse(**data)
        return {"output": response.model_dump()}
    except Exception as e:
        return {"error": f"Erro na validação do JSON: {e}"}
