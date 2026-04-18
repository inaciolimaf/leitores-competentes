from pydantic import BaseModel
from typing import List
from app.models.schemas import Question

class ExportPDFRequest(BaseModel):
    title: str
    questions: List[Question]
