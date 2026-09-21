import axios from "axios";

// Vacio = mismo origen. El dev server de Vite hace de proxy de /api hacia el
// backend (ver vite.config.js), asi la app funciona igual desde el portatil,
// desde el movil por IP o a traves de un tunel HTTPS, sin tocar nada.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// GET /api/inventory -> { items, total_items }
export async function getInventory() {
  const { data } = await client.get("/api/inventory");
  return data;
}

// GET /api/profile -> Profile
export async function getProfile() {
  const { data } = await client.get("/api/profile");
  return data;
}

// PUT /api/profile -> { success, profile }
export async function updateProfile(profile) {
  const { data } = await client.put("/api/profile", profile);
  return data;
}

// POST /api/receipt/scan (multipart) -> { success, source, items_added, total_items }
export async function scanReceipt(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await client.post("/api/receipt/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// POST /api/recipes/generate -> { success, source, meal_type, recipes }
export async function generateRecipes(mealType) {
  const { data } = await client.post("/api/recipes/generate", {
    meal_type: mealType,
  });
  return data;
}

// POST /api/shopping-list -> { success, items, total_items }
export async function generateShoppingList(recipeIds = []) {
  const { data } = await client.post("/api/shopping-list", {
    recipe_ids: recipeIds,
  });
  return data;
}

export default client;
