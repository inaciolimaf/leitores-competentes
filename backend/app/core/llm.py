import logging

from anthropic import AsyncAnthropic
from langchain_core.messages import AIMessage, BaseMessage, SystemMessage

from app.core.config import settings

logger = logging.getLogger(__name__)

# Modelos que aceitam fallbacks="default"; se o modelo recusar, a API refaz em outro
FALLBACK_MODELS = {"claude-opus-5-5", "claude-sonnet-5-5"}
FALLBACK_BETA = "server-side-fallback-2026-07-01"

async def ask_claude(messages: list[BaseMessage], max_tokens: int, effort: str) -> str:
    """Send LangChain messages to Claude and return the response text."""
    params = {}
    system = "\n\n".join(m.content for m in messages if isinstance(m, SystemMessage))
    if system:
        params["system"] = system
    if settings.ANTHROPIC_MODEL in FALLBACK_MODELS:
        params["betas"] = [FALLBACK_BETA]
        params["fallbacks"] = "default"

    client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    async with client.beta.messages.stream(
        model=settings.ANTHROPIC_MODEL,
        max_tokens=max_tokens,
        output_config={"effort": effort},
        messages=[
            {"role": "assistant" if isinstance(m, AIMessage) else "user", "content": m.content}
            for m in messages
            if not isinstance(m, SystemMessage)
        ],
        **params,
    ) as stream:
        response = await stream.get_final_message()

    logger.info(f"Claude: {response.usage.input_tokens} tokens de entrada, {response.usage.output_tokens} de saída")

    if response.stop_reason in ("refusal", "max_tokens"):
        raise RuntimeError(f"Resposta incompleta do Claude (stop_reason={response.stop_reason})")

    return "".join(block.text for block in response.content if block.type == "text")
