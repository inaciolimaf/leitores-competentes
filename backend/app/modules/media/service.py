import base64
import logging
import os
import uuid
from urllib.parse import urlparse

import httpx
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)

def _get_llm() -> ChatOpenAI:
    """Create the LLM instance configured for OpenRouter."""
    return ChatOpenAI(
        model=settings.OPENROUTER_MODEL,
        openai_api_base="https://openrouter.ai/api/v1",
        openai_api_key=settings.OPENROUTER_API_KEY,
        temperature=0.1, # Menor temperatura para maior rigor e consistência
        max_tokens=2000,
    )

async def download_image_locally(url: str) -> str | None:
    """Download an image from the web and save it to the static folder."""
    if not url:
        return None
        
    try:
        os.makedirs(settings.IMAGES_DIR, exist_ok=True)
        
        parsed_url = urlparse(url)
        base_domain = f"{parsed_url.scheme}://{parsed_url.netloc}/"
        
        logger.info(f"Iniciando download da imagem: {url}")
        async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as client:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "Referer": base_domain,
            }
            res = await client.get(url, headers=headers)
            res.raise_for_status()
            
            content_type = res.headers.get("content-type", "")
            ext = ".jpg"
            if "png" in content_type: ext = ".png"
            elif "gif" in content_type: ext = ".gif"
            elif "webp" in content_type: ext = ".webp"
                
            filename = f"{uuid.uuid4().hex}{ext}"
            filepath = os.path.join(settings.IMAGES_DIR, filename)
            
            with open(filepath, "wb") as f:
                f.write(res.content)
                
            logger.info(f"Imagem baixada: {url} -> {filename}")
            return f"/api/static/images/{filename}"
            
    except Exception as e:
        logger.warning(f"Falha ao baixar imagem {url}: {e}")
        return None

async def describe_image_vision(local_path: str) -> str:
    """Use AI Vision to describe the content of a downloaded image."""
    try:
        full_path = os.path.join(settings.BASE_DIR, local_path.lstrip("/api/"))
        
        if not os.path.exists(full_path):
            return "Erro: Arquivo local de imagem não encontrado."

        with open(full_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode("utf-8")

        llm = _get_llm()
        
        mime_type = "image/jpeg"
        if full_path.endswith(".png"): mime_type = "image/png"
        elif full_path.endswith(".gif"): mime_type = "image/gif"
        elif full_path.endswith(".webp"): mime_type = "image/webp"

        message = HumanMessage(
            content=[
                {
                    "type": "text", 
                    "text": (
                        "VOCÊ É UM CENSOR RIGOROSO DE CONTEÚDO PARA PROFESSORES. SUA MISSÃO É BANIR ATIVIDADES PRONTAS.\n\n"
                        "ANALISE A IMAGEM EM BUSCA DE SINAIS DE 'FOLHA DE EXERCÍCIOS':\n"
                        "1. EXISTEM QUESTÕES NUMERADAS? (Ex: 1-, 2., a), b)...) -> REJEITE IMEDIATAMENTE.\n"
                        "2. EXISTEM LINHAS DE RESPOSTA? (Traços horizontais para escrever embaixo) -> REJEITE IMEDIATAMENTE.\n"
                        "3. EXISTE UM CABEÇALHO? (Nome, Data, Escola, Professora, 'Leia o texto') -> REJEITE IMEDIATAMENTE.\n"
                        "4. É UM SCAN OU XEROX DE LIVRO DIDÁTICO? (Fundo amarelado, bordas de página) -> REJEITE IMEDIATAMENTE.\n"
                        "5. A TIRINHA É PEQUENA EM COMPARAÇÃO À PÁGINA CHEIA DE TEXTO? -> REJEITE IMEDIATAMENTE.\n"
                        "6. TEXTO INSUFICIENTE? Rejeite se a tirinha for 'muda' ou se o texto for irrelevante (Apenas saudações como 'Oi', 'Olá' ou apenas 'Fim'). É OBRIGATÓRIO que os balões contenham frases ou diálogos que permitam uma interpretação textual real.\n\n"
                        "CRITÉRIO DE ACEITAÇÃO:\n"
                        "- APENAS a tirinha pura, charge ou imagem limpa.\n"
                        "- O texto deve ser RICO o suficiente para gerar uma questão de interpretação (mínimo de uma frase com sentido completo ou diálogo informativo).\n\n"
                        "RESPOSTAS PERMITIDAS:\n"
                        "- Se for atividade/exercício: 'REJEITADA_ATIVIDADE'\n"
                        "- Se não houver texto suficiente/relevante: 'REJEITADA_SEM_TEXTO'\n"
                        "- Se a imagem for ruim: 'REJEITADA_QUALIDADE'\n"
                        "- Se for OK: Descreva a cena, personagens e transcreva TODO o texto dos balões."
                    )
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:{mime_type};base64,{base64_image}"},
                },
            ]
        )
        
        logger.info(f"Solicitando descrição visual rigorosa: {full_path}")
        response = await llm.ainvoke([message])
        description = response.content.strip()
        
        # Log preventivo para debugar aceites indevidos
        if "REJEITADA" not in description:
            logger.info(f"Imagem ACEITA pela Visão: {full_path}")
            
        return description

    except Exception as e:
        logger.error(f"Erro ao descrever imagem com visão: {e}")
        return "[ERRO_VISION]"
