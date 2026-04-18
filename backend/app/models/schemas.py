from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    """Request body for the /api/generate endpoint."""

    quantity: int = Field(
        ge=1,
        le=50,
        description="Número de questões a gerar (1-50)",
    )
    difficulty: str = Field(
        description="Nível de dificuldade: fácil, médio ou difícil",
    )
    descriptors: list[str] = Field(
        min_length=1,
        description="Lista de códigos de descritores, ex: ['2L2', '2L4']",
    )


class Alternative(BaseModel):
    """A single answer alternative."""

    letter: str = Field(description="Letra da alternativa: A, B, C ou D")
    text: str = Field(description="Texto da alternativa")


class Question(BaseModel):
    """A generated question with full metadata."""

    id: int
    descriptor: str = Field(description="Código do descritor, ex: 2L2")
    descriptor_description: str = Field(
        description="Descrição do descritor, ex: Localizar informação explícita em textos"
    )
    text: str = Field(
        description="Texto-base da questão (pode conter múltiplos parágrafos)"
    )
    support_image_url: str | None = Field(
        default=None,
        description="URL de imagem de suporte (tirinha, charge, infográfico etc.)",
    )
    statement: str = Field(description="O enunciado/pergunta da questão")
    alternatives: list[Alternative] = Field(description="Lista de 4 alternativas")
    correct_answer: str = Field(description="Letra da resposta correta (A, B, C ou D)")
    explanation: str = Field(description="Explicação da resposta correta")


class GenerateResponse(BaseModel):
    """Response body for the /api/generate endpoint."""

    questions: list[Question]
