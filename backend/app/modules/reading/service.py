import logging
from typing import Any

from app.models.descriptors import DESCRIPTORS
from .graph import build_graph
from .state import AgentState

logger = logging.getLogger(__name__)

async def generate_questions_agent(
    quantity: int,
    difficulty: str,
    descriptors: list[str],
) -> dict[str, Any]:
    """
    Run the question generation agent with up to 3 retry attempts on failure.
    """
    valid_descriptors = [d for d in descriptors if d in DESCRIPTORS]
    if not valid_descriptors:
        return {
            "error": f"Nenhum descritor válido. Descritores aceitos: {', '.join(DESCRIPTORS.keys())}"
        }

    graph = build_graph()
    last_error = "Erro desconhecido"

    for attempt in range(1, 4):
        logger.info(f"Iniciando tentativa {attempt} de geração de questões...")
        
        initial_state: AgentState = {
            "quantity": quantity,
            "difficulty": difficulty,
            "descriptors": valid_descriptors,
            "search_plan": "",
            "search_results": "",
            "descriptors_detail": "",
            "messages": [],
            "output": None,
            "error": None,
        }

        try:
            result = await graph.ainvoke(initial_state)

            if result.get("output"):
                logger.info(f"Sucesso na tentativa {attempt}!")
                return result["output"]
            
            if result.get("error"):
                last_error = result["error"]
                logger.warning(f"Tentativa {attempt} falhou com erro: {last_error}")
            else:
                last_error = "Resultado inesperado do agente (sem output nem erro)."
                logger.warning(f"Tentativa {attempt}: {last_error}")

        except Exception as e:
            last_error = str(e)
            logger.error(f"Exceção na tentativa {attempt}: {last_error}", exc_info=True)
    
    logger.error(f"Todas as 3 tentativas de geração falharam. Último erro: {last_error}")
    return {"error": f"Falha após 3 tentativas. Último erro: {last_error}"}
