// Expiry colour code, per docs/PROJECT_CONTEXT.md:
// red = expires today or already expired, amber = 1-3 days, green = more than 3 days.
//
// All user-facing copy in this app is in English.

export function daysUntil(expirationDate) {
  if (!expirationDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${expirationDate}T00:00:00`);
  return Math.round((target - today) / 86400000);
}

export function freshnessOf(item) {
  const days = daysUntil(item.expiration_date);

  if (days === null) {
    return { level: "pantry", days, label: "Pantry", dot: "bg-bark/30", text: "text-bark/50" };
  }
  if (days < 0) {
    return { level: "urgent", days, label: "Expired", dot: "bg-urgent", text: "text-urgent" };
  }
  if (days === 0) {
    return { level: "urgent", days, label: "Today", dot: "bg-urgent", text: "text-urgent" };
  }
  if (days <= 3) {
    const label = days === 1 ? "Tomorrow" : `${days} days`;
    return { level: "soon", days, label, dot: "bg-soon", text: "text-soon" };
  }
  return { level: "fresh", days, label: `${days} days`, dot: "bg-fresh", text: "text-fresh" };
}

// Soonest to expire first: this is the anti-waste hook of the pitch.
export function sortByUrgency(items) {
  return [...items].sort((a, b) => {
    const da = daysUntil(a.expiration_date);
    const db = daysUntil(b.expiration_date);
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db;
  });
}

const CATEGORY_EMOJI = {
  Protein: "🥚",
  Vegetable: "🥬",
  Fruit: "🍎",
  Dairy: "🧀",
  Grain: "🌾",
  Legume: "🫘",
  Pantry: "🫙",
};

export function emojiFor(category) {
  return CATEGORY_EMOJI[category] || "🍽️";
}

// Categories already come in English from the API (see docs/API_CONTRACT.md),
// so this is a passthrough kept for display-layer tweaks.
export function categoryLabel(category) {
  return category;
}
