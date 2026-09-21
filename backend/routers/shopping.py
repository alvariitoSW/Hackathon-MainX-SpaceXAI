"""Lista de la compra. Propietario: Dev B (pestana Lista).

Contrato: docs/API_CONTRACT.md -> POST /api/shopping-list

Cruza las recetas generadas con el inventario y devuelve lo que falta. No necesita
llamar a Gemini: los ingredientes que faltan ya vienen en `ingredients_missing`
de cada receta.
"""

from typing import List

from pydantic import BaseModel
from fastapi import APIRouter

import database
from routers import recipes as recipes_router

router = APIRouter(prefix="/api/shopping-list", tags=["shopping"])


class ShoppingRequest(BaseModel):
    recipe_ids: List[str] = []


@router.post("")
def build_list(payload: ShoppingRequest):
    source_recipes = recipes_router.last_generated

    if payload.recipe_ids:
        source_recipes = [r for r in source_recipes if r.get("id") in payload.recipe_ids]

    in_fridge = {item["name"].lower() for item in database.get_inventory()}

    items = []
    seen = set()
    for recipe in source_recipes:
        for name in recipe.get("ingredients_missing", []):
            key = name.lower()
            if key in seen or key in in_fridge:
                continue
            seen.add(key)
            items.append({"name": name, "quantity": "", "category": "Other"})

    return {"success": True, "items": items, "total_items": len(items)}
