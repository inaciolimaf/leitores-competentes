import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

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

# Ensure images directory exists
import os
os.makedirs(settings.IMAGES_DIR, exist_ok=True)

# Mount static directory for images
app.mount("/api/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

# Include modular routers
app.include_router(reading_router, prefix="/api", tags=["reading"])
app.include_router(export_router, prefix="/api")


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.get("/api/descriptors")
async def get_descriptors():
    """Return the available descriptors and their configurations."""
    descriptors_list = [
        {"code": code, **data} for code, data in DESCRIPTORS.items()
    ]
    return {"descriptors": descriptors_list}
