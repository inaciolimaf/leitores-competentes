import logging
from fastapi import APIRouter, HTTPException

from app.models.schemas import GenerateRequest, GenerateResponse
from .service import generate_questions_agent

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/generate", response_model=GenerateResponse)
async def generate_endpoint(request: GenerateRequest):
    """
    Generate reading comprehension questions using the LangGraph agent.
    """
    logger.info(
        f"Generating {request.quantity} questions, "
        f"difficulty={request.difficulty}, "
        f"descriptors={request.descriptors}"
    )

    try:
        result = await generate_questions_agent(
            quantity=request.quantity,
            difficulty=request.difficulty,
            descriptors=request.descriptors,
        )

        if "error" in result:
            logger.error(f"Agent returned error: {result['error']}")
            raise HTTPException(status_code=500, detail=result["error"])

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error handling request: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Erro interno no servidor: {str(e)}"
        )
