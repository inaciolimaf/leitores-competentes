from langgraph.graph import END, StateGraph

from .state import AgentState
from .nodes import plan_questions, search_content, generate_questions, validate_output

def build_graph() -> StateGraph:
    """Build and compile the LangGraph workflow."""
    graph = StateGraph(AgentState)

    # Add nodes
    graph.add_node("plan_questions", plan_questions)
    graph.add_node("search_content", search_content)
    graph.add_node("generate_questions", generate_questions)
    graph.add_node("validate_output", validate_output)

    # Set entry point
    graph.set_entry_point("plan_questions")

    # Add edges
    graph.add_edge("plan_questions", "search_content")
    graph.add_edge("search_content", "generate_questions")
    graph.add_edge("generate_questions", "validate_output")
    
    # Conditional edge for retries
    def decide_to_retry(state: AgentState):
        if state.get("error") == "RETRY_NEEDED":
            return "retry"
        return "end"

    graph.add_conditional_edges(
        "validate_output",
        decide_to_retry,
        {
            "retry": "generate_questions",
            "end": END
        }
    )

    return graph.compile()
