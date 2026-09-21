"""Google Gemini integration layer (gemini-1.5-flash).

Skeleton: the signatures are fixed, the logic lands in its own milestone.
Every function must fall back to mock data if the API fails, so the live demo
never breaks.

All user-facing strings are in English (they end up on screen).
"""

import json
import os
import re
from pathlib import Path

from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

MODEL_NAME = "gemini-1.5-flash"
API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or os.getenv("AI_STUDIO_API_KEY") or ""


MOCK_FOOD_ITEMS = [
    {
        "name": "Greek yogurt",
        "quantity": "4 units",
        "category": "Dairy",
        "is_perishable": True,
        "expiration_date": "2026-10-05",
    },
    {
        "name": "Fresh salmon",
        "quantity": "300 g",
        "category": "Protein",
        "is_perishable": True,
        "expiration_date": "2026-09-23",
    },
    {
        "name": "Brown rice",
        "quantity": "1 kg",
        "category": "Grain",
        "is_perishable": False,
        "expiration_date": None,
    },
]

MOCK_RECIPES = [
    {
        "id": "rcp_001",
        "title": "Spinach and feta omelette",
        "description": "Fast, rich in iron and magnesium, ideal for the luteal phase.",
        "cooking_time_minutes": 15,
        "difficulty": "Easy",
        "uses_expiring_items": ["Fresh spinach"],
        "ingredients_available": ["Free-range eggs", "Fresh spinach"],
        "ingredients_missing": ["Feta cheese"],
        "steps": [
            "Saute the spinach for 3 minutes.",
            "Beat the eggs and fold in the feta.",
            "Cook the omelette for 5 minutes per side.",
        ],
        "nutrition_note": "Provides magnesium and iron, useful during the luteal phase.",
    },
    {
        "id": "rcp_002",
        "title": "Mediterranean spinach saute with poached egg",
        "description": "A one-plate dinner in 20 minutes with what you already have.",
        "cooking_time_minutes": 20,
        "difficulty": "Easy",
        "uses_expiring_items": ["Fresh spinach"],
        "ingredients_available": ["Free-range eggs", "Fresh spinach"],
        "ingredients_missing": ["Cherry tomatoes", "Extra virgin olive oil"],
        "steps": [
            "Saute the cherry tomatoes in olive oil.",
            "Add the spinach and let it wilt down.",
            "Poach the egg for 3 minutes and serve it on top.",
        ],
        "nutrition_note": "Nut-free, safe for the allergy stored in the profile.",
    },
]


def extract_food_from_image(image_bytes):
    """Extract food items from a receipt photo using Gemini Vision.

    Args:
        image_bytes (bytes): raw contents of the uploaded image.

    Returns:
        list[dict]: items with name, quantity, category, is_perishable, expiration_date.
    """
    raise NotImplementedError("Pending: 'Integrate Gemini Vision' milestone in STATE.md")


def generate_recipes(profile, inventory, meal_type, craving="", cooking_time_minutes=None):
    """Generate 2 personalised recipes by crossing profile and inventory.

    Args:
        profile (dict): user profile (diet, allergies, time, cycle phase).
        inventory (list[dict]): current inventory, soonest to expire first.
        meal_type (str): 'breakfast' | 'lunch' | 'dinner'.
        craving (str): what the user feels like eating.
        cooking_time_minutes (int | None): time available today.

    Returns:
        list[dict]: exactly 2 recipes following the Recipe schema in the contract.
    """
    if not API_KEY:
        return mock_craving_recipes(craving, cooking_time_minutes)

    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel(MODEL_NAME)

    prompt = _recipe_prompt(profile, inventory, meal_type, craving, cooking_time_minutes)
    response = model.generate_content(prompt)
    payload = _extract_json(response.text)
    recipes = payload if isinstance(payload, list) else payload.get("recipes", [])

    if not recipes:
        return mock_craving_recipes(craving, cooking_time_minutes)

    return recipes[:2]


def mock_craving_recipes(craving="", cooking_time_minutes=None):
    """Demo-safe fallback that still reflects the user's craving."""
    base = (craving or "Mediterranean dinner").strip()
    time = cooking_time_minutes or 25

    return [
        {
            "id": "rcp_craving_001",
            "title": f"{base.title()} with a fridge-first twist",
            "description": "A concise, demo-safe recipe shaped around your craving and current fridge.",
            "cooking_time_minutes": time,
            "difficulty": "Easy",
            "uses_expiring_items": ["Fresh spinach"],
            "ingredients_available": ["Free-range eggs", "Fresh spinach"],
            "ingredients_missing": ["Greek yogurt", "Cherry tomatoes"],
            "steps": [
                "Prep the vegetables and set a pan on medium heat.",
                "Cook the protein or eggs with spinach for 6-8 minutes.",
                "Finish with yogurt sauce, tomatoes and seasoning.",
            ],
            "nutrition_note": "Balanced protein and vegetables while keeping the ingredient list short.",
            "ai_feedback": "Fallback used: Gemini unavailable, but the recipe still follows the craving.",
        }
    ]


def _recipe_prompt(profile, inventory, meal_type, craving, cooking_time_minutes):
    inventory_summary = [
        {
            "name": item.get("name"),
            "quantity": item.get("quantity"),
            "category": item.get("category"),
            "expiration_date": item.get("expiration_date"),
        }
        for item in inventory
    ]

    return f"""
You are the recipe engine for a smart fridge demo.
Answer ONLY valid JSON, no markdown.
All user-facing strings must be in English.

User craving: {craving or "No specific craving"}
Meal type: {meal_type}
Available cooking time today: {cooking_time_minutes or profile.get("schedule", {}).get("cooking_time_minutes", 25)} minutes

Profile JSON:
{json.dumps(profile, ensure_ascii=False)}

Inventory JSON:
{json.dumps(inventory_summary, ensure_ascii=False)}

Return this exact structure:
{{
  "recipes": [
    {{
      "id": "short_slug",
      "title": "Specific recipe title",
      "description": "One concise sentence.",
      "cooking_time_minutes": 25,
      "difficulty": "Easy",
      "uses_expiring_items": ["item names from inventory"],
      "ingredients_available": ["item names from inventory"],
      "ingredients_missing": ["specific missing ingredient names"],
      "steps": ["3 to 5 concise bullet-like steps"],
      "nutrition_note": "One concise note tied to the user's profile.",
      "ai_feedback": "If the craving conflicts with diet/allergies/inventory, explain the adaptation in one sentence. Otherwise say it fits."
    }}
  ]
}}

Rules:
- Return 1 recipe if the craving is specific, otherwise 2 recipes.
- Be concrete: include exact missing ingredients, not generic phrases.
- Respect allergies and diet.
- Prioritize expiring items.
- Keep steps short and specific.
"""


def _extract_json(text):
    cleaned = text.strip()
    fenced = re.search(r"```(?:json)?\s*(.*?)```", cleaned, re.DOTALL)
    if fenced:
        cleaned = fenced.group(1).strip()
    return json.loads(cleaned)
