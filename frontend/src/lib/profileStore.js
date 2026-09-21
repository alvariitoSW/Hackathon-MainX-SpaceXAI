// Per-device profile.
//
// The backend stores a single profile.json, so if several judges open the demo at
// the same time they would overwrite each other. To avoid that, the client source
// of truth is localStorage: every phone keeps its own profile and sees its own
// onboarding. We still sync to the backend because Gemini needs the profile to
// generate recipes.

import { updateProfile } from "../services/api";

const KEY = "smartfridge.profile";

export const DIETS = [
  "Omnivore",
  "Mediterranean",
  "Vegetarian",
  "Vegan",
  "Keto",
  "Gluten-free",
];

export const ALLERGENS = [
  "Nuts",
  "Gluten",
  "Lactose",
  "Shellfish",
  "Egg",
  "Soy",
  "Fish",
];

export const GENDERS = ["Woman", "Man", "Prefer not to say"];

export const HORMONAL_PHASES = [
  "Menstrual",
  "Follicular",
  "Ovulation",
  "Luteal",
  "Not sure",
];

export const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export const COOKING_TIMES = [15, 25, 40, 60];

export const SHOPPING_FREQUENCIES = [
  "Every 5 days",
  "Weekly",
  "Every 2 weeks",
  "Monthly",
  "Custom",
];

export const EMPTY_PROFILE = {
  name: "",
  gender: "",
  hormonal_phase: "",
  diet_type: "",
  allergies: [],
  schedule: {
    cooking_time_minutes: 25,
    meals_per_day: ["breakfast", "lunch", "dinner"],
    shopping_frequency: "Weekly",
  },
};

export function normalizeProfile(profile) {
  if (!profile) return null;

  return {
    ...EMPTY_PROFILE,
    ...profile,
    allergies: Array.isArray(profile.allergies) ? profile.allergies : [],
    schedule: {
      ...EMPTY_PROFILE.schedule,
      ...(profile.schedule || {}),
      meals_per_day: Array.isArray(profile.schedule?.meals_per_day)
        ? profile.schedule.meals_per_day
        : EMPTY_PROFILE.schedule.meals_per_day,
      shopping_frequency:
        profile.schedule?.shopping_frequency ||
        (profile.schedule?.shopping_day ? "Weekly" : EMPTY_PROFILE.schedule.shopping_frequency),
    },
  };
}

export function createEmptyProfile() {
  return normalizeProfile({
    ...EMPTY_PROFILE,
    allergies: [...EMPTY_PROFILE.allergies],
    schedule: {
      ...EMPTY_PROFILE.schedule,
      meals_per_day: [...EMPTY_PROFILE.schedule.meals_per_day],
    },
  });
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? normalizeProfile(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function hasProfile() {
  return loadProfile() !== null;
}

export function clearProfile() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* private mode: ignore */
  }
}

/**
 * Save on the device and sync with the backend.
 * The PUT must never break the demo, hence the silent try/catch.
 */
export async function persistProfile(profile) {
  const normalized = normalizeProfile(profile);

  try {
    localStorage.setItem(KEY, JSON.stringify(normalized));
  } catch {
    /* private mode: carry on, the profile lives in memory */
  }

  try {
    await updateProfile(normalized);
  } catch {
    /* backend down or profile overwritten by another judge: UI keeps working */
  }

  return normalized;
}
