"""Google Gemini integration layer (gemini-1.5-flash).

Skeleton: the signatures are fixed, the logic lands in its own milestone.
Every function must fall back to mock data if the API fails, so the live demo
never breaks.

All user-facing strings are in English (they end up on screen).
"""

import os

MODEL_NAME = "gemini-1.5-flash"
API_KEY = os.getenv("GEMINI_API_KEY", "")


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


def generate_recipes(profile, inventory, meal_type):
    """Generate 2 personalised recipes by crossing profile and inventory.

    Args:
        profile (dict): user profile (diet, allergies, time, cycle phase).
        inventory (list[dict]): current inventory, soonest to expire first.
        meal_type (str): 'breakfast' | 'lunch' | 'dinner'.

    Returns:
        list[dict]: exactly 2 recipes following the Recipe schema in the contract.
    """
    raise NotImplementedError("Pending: 'Integrate Gemini in generate_recipes' milestone")
