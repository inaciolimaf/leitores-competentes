import json
import logging
import os
from app.core.config import settings

logger = logging.getLogger(__name__)

def load_json_cache(file_path: str) -> dict:
    """Load JSON cache from disk."""
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Falha ao carregar cache {file_path}: {e}")
    return {}

def save_json_cache(file_path: str, data: dict):
    """Save JSON cache to disk."""
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.warning(f"Falha ao salvar cache {file_path}: {e}")

def get_tavily_cache() -> dict:
    return load_json_cache(settings.TAVILY_CACHE_FILE)

def save_tavily_cache(cache: dict):
    save_json_cache(settings.TAVILY_CACHE_FILE, cache)

def get_image_cache() -> dict:
    return load_json_cache(settings.IMAGE_CACHE_FILE)

def save_image_cache(cache: dict):
    save_json_cache(settings.IMAGE_CACHE_FILE, cache)
