"""Inventario de la nevera. Propietario: Dev A (pestana Nevera).

Contrato: docs/API_CONTRACT.md -> GET /api/inventory
"""

from fastapi import APIRouter, HTTPException

import database

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


@router.get("")
def read_inventory():
    items = database.get_inventory()
    return {"items": items, "total_items": len(items)}


@router.delete("/{item_id}")
def delete_item(item_id: str):
    """Consumir o tirar un alimento. Hito pendiente en STATE.md."""
    if not database.delete_inventory_item(item_id):
        raise HTTPException(status_code=404, detail="Ese alimento no esta en la nevera.")
    items = database.get_inventory()
    return {"success": True, "total_items": len(items)}
