import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_MODEL: str = os.getenv("OPENROUTER_MODEL", "google/gemini-2.5-flash-lite")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    USE_TAVILY_CACHE: bool = os.getenv("USE_TAVILY_CACHE", "true").lower() == "true"
    
    # Path settings
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    STATIC_DIR: str = os.path.join(BASE_DIR, "static")
    IMAGES_DIR: str = os.path.join(STATIC_DIR, "images")
    
    # Cache files
    TAVILY_CACHE_FILE: str = "tavily_cache.json"
    IMAGE_CACHE_FILE: str = "image_cache.json"

settings = Settings()
