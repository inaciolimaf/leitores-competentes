from typing import Annotated, Any, TypedDict
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    """State carried through the LangGraph workflow."""
    # Input parameters
    quantity: int
    difficulty: str
    descriptors: list[str]

    # Intermediate data
    search_plan: str
    search_results: str
    descriptors_detail: str

    # Messages for the LLM
    messages: Annotated[list, add_messages]

    # Final output
    output: dict[str, Any] | None
    error: str | None
    retry_count: int | None
