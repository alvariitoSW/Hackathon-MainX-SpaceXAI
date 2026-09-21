# API Contract

Fuente unica de verdad para la comunicacion entre `frontend/` y `backend/`.
Si cambias un esquema aqui, avisa al otro dev inmediatamente.

- **Base URL:** `http://localhost:8000`
- **Prefijo:** todos los endpoints cuelgan de `/api`
- **Formato:** JSON (`application/json`), salvo el escaner que usa `multipart/form-data`
- **Fechas:** siempre `YYYY-MM-DD` (string ISO)
- **Idioma:** TODOS los valores de datos van en **ingles**, porque se pintan tal cual en
  la UI. Nombres de alimentos, categorias, titulos y pasos de receta: ingles siempre.

---

## Modelos base

### `FoodItem`

```json
{
  "id": "itm_001",
  "name": "Free-range eggs",
  "quantity": "12 units",
  "category": "Protein",
  "is_perishable": true,
  "expiration_date": "2026-10-02"
}
```

| Campo | Tipo | Notas |
| --- | --- | --- |
| `id` | string | Unico. Generado por el backend (`itm_XXX`). |
| `name` | string | Nombre del alimento, en ingles. |
| `quantity` | string | Texto libre: `"12 units"`, `"250 g"`, `"1 L"`. |
| `category` | string | `Protein` \| `Vegetable` \| `Fruit` \| `Dairy` \| `Grain` \| `Legume` \| `Pantry` \| `Other`. |
| `is_perishable` | boolean | Si es `false`, `expiration_date` puede ser `null`. |
| `expiration_date` | string \| null | `YYYY-MM-DD`. |

> Las categorias tienen emoji asociado en `frontend/src/lib/freshness.js`. Si inventas
> una categoria fuera de la lista, saldra el emoji generico.

### `Profile`

```json
{
  "name": "Laura",
  "gender": "Woman",
  "hormonal_phase": "Luteal",
  "diet_type": "Mediterranean",
  "allergies": ["Nuts"],
  "schedule": {
    "cooking_time_minutes": 25,
    "meals_per_day": ["breakfast", "lunch", "dinner"],
    "shopping_frequency": "Weekly"
  }
}
```

| Campo | Tipo | Notas |
| --- | --- | --- |
| `name` | string | Requerido. El onboarding pone `"Chef"` si se omite. |
| `gender` | string | `Woman` \| `Man` \| `Prefer not to say`. |
| `hormonal_phase` | string | `Menstrual` \| `Follicular` \| `Ovulation` \| `Luteal` \| `Not sure`. Vacio si `gender` no es `Woman`. |
| `diet_type` | string | `Omnivore` \| `Mediterranean` \| `Vegetarian` \| `Vegan` \| `Keto` \| `Gluten-free`. |
| `allergies` | string[] | `Nuts`, `Gluten`, `Lactose`, `Shellfish`, `Egg`, `Soy`, `Fish`. Nunca deben aparecer en una receta. |
| `schedule.cooking_time_minutes` | number | Minutos disponibles para cocinar. |
| `schedule.meals_per_day` | string[] | En minusculas: `breakfast`, `lunch`, `dinner`, `snacks`. |
| `schedule.shopping_frequency` | string | `Every 5 days` \| `Weekly` \| `Every 2 weeks` \| `Monthly` \| `Custom`. |

> El cliente guarda su perfil en `localStorage` para que cada dispositivo tenga el
> suyo durante la demo. `PUT /api/profile` se sigue usando para que Gemini disponga
> del perfil al generar recetas.

### `Recipe`

```json
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
    "Cook the omelette for 5 minutes per side."
  ],
  "nutrition_note": "Provides magnesium and iron, useful during the luteal phase."
}
```

`difficulty`: `Easy` | `Medium` | `Hard`.

---

## `GET /api/inventory`

Devuelve el estado actual de la nevera.

**Respuesta `200`**

```json
{
  "items": [
    {
      "id": "itm_001",
      "name": "Free-range eggs",
      "quantity": "12 units",
      "category": "Protein",
      "is_perishable": true,
      "expiration_date": "2026-10-02"
    }
  ],
  "total_items": 1
}
```

---

## `DELETE /api/inventory/{item_id}`

Consume o tira un alimento.

**Respuesta `200`**

```json
{ "success": true, "total_items": 1 }
```

`404` si el `item_id` no existe.

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
      "name": "Greek yogurt",
      "quantity": "4 units",
      "category": "Dairy",
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
{
  "meal_type": "dinner",
  "craving": "creamy pasta",
  "cooking_time_minutes": 30,
  "profile": {
    "...": "Profile from localStorage, optional but recommended"
  }
}
```

`meal_type`: `"breakfast"` | `"lunch"` | `"dinner"`.
`craving`: texto libre del usuario. Opcional, pero la UI de Recetas lo envia desde el input.
`cooking_time_minutes`: minutos disponibles hoy. Opcional.

`profile` es opcional por compatibilidad, pero el frontend debe enviarlo desde
`localStorage` siempre que exista. Asi las recetas usan el onboarding del dispositivo
actual y no dependen del ultimo `PUT /api/profile` hecho por otro juez.

**Respuesta `200`**

```json
{
  "success": true,
  "source": "gemini",
  "meal_type": "dinner",
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
    { "name": "Feta cheese", "quantity": "200 g", "category": "Dairy" }
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
  "detail": "Readable message, in English (it reaches the UI)"
}
```
