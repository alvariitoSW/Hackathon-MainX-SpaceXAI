"""Generacion de recetas con Gemini. Propietario: Dev A (pestana Recetas).

Contrato: docs/API_CONTRACT.md -> POST /api/recipes/generate

TODO (Dev A): llamar a gemini_service.generate_recipes(profile, inventory, meal_type)
dentro de un try/except, con fallback a gemini_service.MOCK_RECIPES y source="mock".
Prioriza en el prompt los alimentos que caducan antes y respeta las alergias del perfil.
"""

from pydantic import BaseModel
from fastapi import APIRouter

import database
import gemini_service

router = APIRouter(prefix="/api/recipes", tags=["recipes"])

# Cache en memoria de la ultima generacion, para que /api/shopping-list
# pueda resolver recetas por id sin volver a llamar a Gemini.
last_generated = []


class RecipeRequest(BaseModel):
    meal_type: str = "cena"


@router.post("/generate")
def generate(payload: RecipeRequest):
    global last_generated

    profile = database.get_profile()
    inventory = database.get_inventory()

    try:
        recipes = gemini_service.generate_recipes(profile, inventory, payload.meal_type)
        source = "gemini"
    except Exception:
        recipes = gemini_service.MOCK_RECIPES
        source = "mock"

    last_generated = recipes
    return {
        "success": True,
        "source": source,
        "meal_type": payload.meal_type,
        "recipes": recipes,
    }
