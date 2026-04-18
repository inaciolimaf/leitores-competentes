from fastapi import APIRouter, HTTPException
from .schemas import ExportPDFRequest
from .service import generate_pdf

router = APIRouter(prefix="/export", tags=["Export"])

@router.post("/pdf")
async def export_pdf(request: ExportPDFRequest):
    try:
        pdf_url = generate_pdf(request.title, request.questions)
        return {"url": pdf_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
