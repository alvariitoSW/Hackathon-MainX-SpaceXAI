"""Perfil del usuario. Propietario: Dev B (pestanas Perfil y Onboarding).

Contrato: docs/API_CONTRACT.md -> GET /api/profile y PUT /api/profile
"""

from typing import List

from pydantic import BaseModel
from fastapi import APIRouter

import database

router = APIRouter(prefix="/api/profile", tags=["profile"])


class Schedule(BaseModel):
    cooking_time_minutes: int = 25
    meals_per_day: List[str] = ["breakfast", "lunch", "dinner"]
    # Usual grocery shopping day, captured during onboarding.
    shopping_day: str = "Saturday"


class Profile(BaseModel):
    name: str
    gender: str = ""
    hormonal_phase: str = ""
    diet_type: str = ""
    allergies: List[str] = []
    schedule: Schedule = Schedule()


@router.get("")
def read_profile():
    return database.get_profile()


@router.put("")
def update_profile(payload: Profile):
    saved = database.save_profile(payload.model_dump())
    return {"success": True, "profile": saved}
