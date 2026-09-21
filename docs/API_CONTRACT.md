# API Contract

Fuente unica de verdad para la comunicacion entre `frontend/` y `backend/`.
Si cambias un esquema aqui, avisa al otro dev inmediatamente.

- **Base URL:** `http://localhost:8000`
- **Prefijo:** todos los endpoints cuelgan de `/api`
- **Formato:** JSON (`application/json`), salvo el escaner que usa `multipart/form-data`
- **Fechas:** siempre `YYYY-MM-DD` (string ISO)

---

## Modelos base

### `FoodItem`

```json
{
  "id": "itm_001",
  "name": "Huevos camperos",
  "quantity": "12 uds",
  "category": "Proteina",
  "is_perishable": true,
  "expiration_date": "2026-10-02"
}
```

| Campo | Tipo | Notas |
| --- | --- | --- |
| `id` | string | Unico. Generado por el backend (`itm_XXX`). |
| `name` | string | Nombre legible del alimento. |
| `quantity` | string | Texto libre: `"12 uds"`, `"250 g"`, `"1 L"`. |
| `category` | string | `Proteina` \| `Verdura` \| `Fruta` \| `Lacteo` \| `Cereal` \| `Legumbre` \| `Despensa` \| `Otro`. |
| `is_perishable` | boolean | Si es `false`, `expiration_date` puede ser `null`. |
| `expiration_date` | string \| null | `YYYY-MM-DD`. |

### `Profile`

```json
{
  "name": "Laura",
  "gender": "Femenino",
  "hormonal_phase": "Fase lutea (requiere magnesio)",
  "diet_type": "Mediterranea",
  "allergies": ["Frutos secos"],
  "schedule": {
    "cooking_time_minutes": 25,
    "meals_per_day": ["desayuno", "comida", "cena"]
  }
}
```

### `Recipe`

```json
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
    "Cuaja la tortilla 5 minutos por cada lado."
  ],
  "nutrition_note": "Aporta magnesio y hierro, utiles en fase lutea."
}
```

---

## `GET /api/inventory`

Devuelve el estado actual de la nevera.

**Respuesta `200`**

```json
{
  "items": [
    {
      "id": "itm_001",
      "name": "Huevos camperos",
      "quantity": "12 uds",
      "category": "Proteina",
      "is_perishable": true,
      "expiration_date": "2026-10-02"
    }
  ],
  "total_items": 1
}
```

---

## `GET /api/profile`

Devuelve las preferencias del usuario.

**Respuesta `200`:** objeto `Profile`.

---

## `PUT /api/profile`

Actualiza (reemplaza) las preferencias del usuario.

**Body:** objeto `Profile` completo.

**Respuesta `200`**

```json
{
  "success": true,
  "profile": { "...": "Profile actualizado" }
}
```

---

## `POST /api/receipt/scan`

Recibe la foto de un ticket, extrae los alimentos con Gemini Vision y los anade al inventario.

**Request:** `multipart/form-data`

| Campo | Tipo | Requerido | Notas |
| --- | --- | --- | --- |
| `file` | file (jpg/png) | si | Imagen del ticket. |

**Respuesta `200`**

```json
{
  "success": true,
  "source": "gemini",
  "items_added": [
    {
      "id": "itm_003",
      "name": "Yogur griego",
      "quantity": "4 uds",
      "category": "Lacteo",
      "is_perishable": true,
      "expiration_date": "2026-10-05"
    }
  ],
  "total_items": 3
}
```

`source` puede ser `"gemini"` o `"mock"` (fallback si la API falla).

**Nota de demo:** el frontend tiene un boton oculto de Demo/Bypass que inyecta el JSON mockeado
sin llamar al backend, por si la API falla durante el pitch.

---

## `POST /api/recipes/generate`

Cruza inventario (priorizando lo que caduca antes) con el perfil y devuelve **2 recetas**.

**Body**

```json
{ "meal_type": "cena" }
```

`meal_type`: `"desayuno"` | `"comida"` | `"cena"`.

**Respuesta `200`**

```json
{
  "success": true,
  "source": "gemini",
  "meal_type": "cena",
  "recipes": [
    { "...": "Recipe 1" },
    { "...": "Recipe 2" }
  ]
}
```

Siempre exactamente 2 elementos en `recipes`.

---

## `POST /api/shopping-list`

Genera la lista de ingredientes que faltan para las recetas seleccionadas.

**Body**

```json
{ "recipe_ids": ["rcp_001", "rcp_002"] }
```

Si `recipe_ids` viene vacio o ausente, el backend usa las ultimas recetas generadas.

**Respuesta `200`**

```json
{
  "success": true,
  "items": [
    { "name": "Queso feta", "quantity": "200 g", "category": "Lacteo" }
  ],
  "total_items": 1
}
```

---

## Errores

Formato comun para cualquier fallo.

**Respuesta `4xx` / `5xx`**

```json
{
  "detail": "Mensaje legible para el usuario"
}
```
