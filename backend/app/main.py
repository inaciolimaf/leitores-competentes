import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.core.config import settings
from app.models.descriptors import DESCRIPTORS
from app.modules.reading.router import router as reading_router
from app.modules.export.router import router as export_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Leitores Competentes API",
    description="API for automatically generating reading comprehension questions.",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. API ROUTES ---

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/descriptors")
async def get_descriptors():
    descriptors_list = [
        {"code": code, **data} for code, data in DESCRIPTORS.items()
    ]
    return {"descriptors": descriptors_list}

app.include_router(reading_router, prefix="/api", tags=["reading"])
app.include_router(export_router, prefix="/api")

# --- 2. STATIC FILES (API) ---

os.makedirs(settings.IMAGES_DIR, exist_ok=True)
os.makedirs(settings.EXPORTS_DIR, exist_ok=True)
app.mount("/api/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

# --- 3. FRONTEND (SERVE AT THE END) ---

FRONTEND_DIR = os.path.join(settings.BASE_DIR, "static", "frontend")
logger.info(f"Procurando frontend em: {FRONTEND_DIR}")

if os.path.exists(FRONTEND_DIR):
    logger.info("Frontend encontrado! Ativando rotas do site.")
    
    # Rota específica para o index e arquivos estáticos do assets
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Se for uma rota de API que não foi capturada acima, retorna 404
        if full_path.startswith("api/"):
            return {"detail": "Not Found"}, 404
        
        # Para qualquer outra rota, serve o index.html (suporte ao React Router)
        file_path = os.path.join(FRONTEND_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
else:
    logger.warning("Frontend NÃO encontrado. O site principal não será carregado.")
