"""Capa de integracion con Google Gemini (gemini-1.5-flash).

Esqueleto: las firmas estan fijadas, la logica se implementa en el hito correspondiente.
Toda funcion debe devolver datos mock si la API falla, para no romper la demo en vivo.
"""

import os

MODEL_NAME = "gemini-1.5-flash"
API_KEY = os.getenv("GEMINI_API_KEY", "")


MOCK_FOOD_ITEMS = [
    {
        "name": "Yogur griego",
        "quantity": "4 uds",
        "category": "Lacteo",
        "is_perishable": True,
        "expiration_date": "2026-10-05",
    },
    {
        "name": "Salmon fresco",
        "quantity": "300 g",
        "category": "Proteina",
        "is_perishable": True,
        "expiration_date": "2026-09-23",
    },
    {
        "name": "Arroz integral",
        "quantity": "1 kg",
        "category": "Cereal",
        "is_perishable": False,
        "expiration_date": None,
    },
]

MOCK_RECIPES = [
    {
        "id": "rcp_001",
        "title": "Tortilla de espinacas y queso feta",
        "description": "Rapida, rica en hierro y magnesio, ideal para fase lutea.",
        "cooking_time_minutes": 15,
        "difficulty": "Facil",
        "uses_expiring_items": ["Espinacas frescas"],
        "ingredients_available": ["Huevos camperos", "Espinacas frescas"],
        "ingredients_missing": ["Queso feta"],
        "steps": [
            "Saltea las espinacas 3 minutos.",
            "Bate los huevos y anade el feta.",
            "Cuaja la tortilla 5 minutos por cada lado.",
        ],
        "nutrition_note": "Aporta magnesio y hierro, utiles en fase lutea.",
    },
    {
        "id": "rcp_002",
        "title": "Salteado mediterraneo de espinacas y huevo poche",
        "description": "Plato unico en 20 minutos con lo que ya tienes en la nevera.",
        "cooking_time_minutes": 20,
        "difficulty": "Facil",
        "uses_expiring_items": ["Espinacas frescas"],
        "ingredients_available": ["Huevos camperos", "Espinacas frescas"],
        "ingredients_missing": ["Tomate cherry", "Aceite de oliva virgen extra"],
        "steps": [
            "Saltea los tomates cherry con aceite de oliva.",
            "Anade las espinacas hasta que reduzcan.",
            "Escalfa el huevo 3 minutos y sirvelo encima.",
        ],
        "nutrition_note": "Sin frutos secos, apto para la alergia registrada en el perfil.",
    },
]


def extract_food_from_image(image_bytes):
    """Extrae alimentos de la foto de un ticket usando Gemini Vision.

    Args:
        image_bytes (bytes): contenido binario de la imagen subida.

    Returns:
        list[dict]: items con name, quantity, category, is_perishable, expiration_date.
    """
    raise NotImplementedError("Pendiente: hito 'Integrar Gemini Vision' en STATE.md")


def generate_recipes(profile, inventory, meal_type):
    """Genera 2 recetas personalizadas cruzando perfil e inventario.

    Args:
        profile (dict): perfil del usuario (dieta, alergias, tiempo, fase hormonal).
        inventory (list[dict]): inventario actual, priorizando lo que caduca antes.
        meal_type (str): 'desayuno' | 'comida' | 'cena'.

    Returns:
        list[dict]: exactamente 2 recetas segun el esquema Recipe del contrato.
    """
    raise NotImplementedError("Pendiente: hito 'Integrar Gemini en generate_recipes' en STATE.md")
