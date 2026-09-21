"""Escaner de tickets con Gemini Vision. Propietario: Dev A (pestana Nevera).

Contrato: docs/API_CONTRACT.md -> POST /api/receipt/scan

TODO (Dev A): llamar a gemini_service.extract_food_from_image(image_bytes) dentro de
un try/except. Si Gemini falla, responder con gemini_service.MOCK_FOOD_ITEMS y
source="mock". La demo nunca puede romperse en directo.
"""

from fastapi import APIRouter, File, UploadFile

import database
import gemini_service

router = APIRouter(prefix="/api/receipt", tags=["receipt"])


@router.post("/scan")
async def scan_receipt(file: UploadFile = File(...)):
    image_bytes = await file.read()

    try:
        items = gemini_service.extract_food_from_image(image_bytes)
        source = "gemini"
    except Exception:
        items = gemini_service.MOCK_FOOD_ITEMS
        source = "mock"

    created = database.add_inventory_items(items)
    return {
        "success": True,
        "source": source,
        "items_added": created,
        "total_items": len(database.get_inventory()),
    }
