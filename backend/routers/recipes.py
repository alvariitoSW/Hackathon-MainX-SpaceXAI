"""Generacion de recetas con Gemini. Propietario: Dev A (pestana Recetas).

Contrato: docs/API_CONTRACT.md -> POST /api/recipes/generate

TODO (Dev A): llamar a gemini_service.generate_recipes(profile, inventory, meal_type)
dentro de un try/except, con fallback a gemini_service.MOCK_RECIPES y source="mock".
Prioriza en el prompt los alimentos que caducan antes y respeta las alergias del perfil.
"""

from typing import Any, Dict, Optional

from pydantic import BaseModel
from fastapi import APIRouter

import database
import gemini_service

router = APIRouter(prefix="/api/recipes", tags=["recipes"])

# Cache en memoria de la ultima generacion, para que /api/shopping-list
# pueda resolver recetas por id sin volver a llamar a Gemini.
last_generated = []


class RecipeRequest(BaseModel):
    meal_type: str = "dinner"
    profile: Optional[Dict[str, Any]] = None
    craving: str = ""
    cooking_time_minutes: Optional[int] = None


@router.post("/generate")
def generate(payload: RecipeRequest):
    global last_generated

    # The backend has a single profile.json, but each demo device keeps its own
    # profile in localStorage. Prefer the profile sent by the frontend so recipes
    # always use the onboarding from that device.
    profile = payload.profile or database.get_profile()
    if payload.profile:
        database.save_profile(payload.profile)

    inventory = database.get_inventory()

    try:
        recipes = gemini_service.generate_recipes(
            profile,
            inventory,
            payload.meal_type,
            craving=payload.craving,
            cooking_time_minutes=payload.cooking_time_minutes,
        )
        source = "gemini"
    except Exception:
        recipes = gemini_service.mock_craving_recipes(
            payload.craving,
            payload.cooking_time_minutes,
        )
        source = "mock"

    last_generated = recipes
    return {
        "success": True,
        "source": source,
        "meal_type": payload.meal_type,
        "recipes": recipes,
    }
