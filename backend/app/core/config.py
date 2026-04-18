import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_MODEL: str = os.getenv("OPENROUTER_MODEL", "google/gemini-2.5-flash-lite")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    USE_TAVILY_CACHE: bool = os.getenv("USE_TAVILY_CACHE", "true").lower() == "true"
    
    # Path settings (Subindo 3 níveis para chegar na raiz /app a partir de app/core/config.py)
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR: str = os.getenv("DATA_DIR", BASE_DIR)
    
    STATIC_DIR: str = os.path.join(DATA_DIR, "static")
    IMAGES_DIR: str = os.path.join(STATIC_DIR, "images")
    EXPORTS_DIR: str = os.path.join(STATIC_DIR, "exports")
    
    # Cache files
    TAVILY_CACHE_FILE: str = os.path.join(DATA_DIR, "tavily_cache.json")
    IMAGE_CACHE_FILE: str = os.path.join(DATA_DIR, "image_cache.json")

settings = Settings()
