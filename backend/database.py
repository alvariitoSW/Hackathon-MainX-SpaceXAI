"""Persistencia en archivos JSON locales. Sin base de datos, sin ORM."""

import json
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
PROFILE_FILE = DATA_DIR / "profile.json"
INVENTORY_FILE = DATA_DIR / "inventory.json"


def _read(path, fallback):
    if not path.exists():
        return fallback
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return data


def get_profile():
    return _read(PROFILE_FILE, {})


def save_profile(profile):
    return _write(PROFILE_FILE, profile)


def get_inventory():
    return _read(INVENTORY_FILE, [])


def save_inventory(items):
    return _write(INVENTORY_FILE, items)


def add_inventory_items(new_items):
    """Anade items al inventario asignando ids incrementales. Devuelve los items creados."""
    inventory = get_inventory()
    next_id = len(inventory) + 1
    created = []

    for item in new_items:
        item = dict(item)
        if not item.get("id"):
            item["id"] = f"itm_{next_id:03d}"
            next_id += 1
        inventory.append(item)
        created.append(item)

    save_inventory(inventory)
    return created


def delete_inventory_item(item_id):
    inventory = get_inventory()
    remaining = [item for item in inventory if item.get("id") != item_id]
    save_inventory(remaining)
    return len(remaining) != len(inventory)
