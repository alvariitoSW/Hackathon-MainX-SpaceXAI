// Semaforo de caducidad segun docs/PROJECT_CONTEXT.md:
// rojo = caduca hoy o ya caduco, ambar = 1-3 dias, verde = mas de 3 dias.

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
    return { level: "pantry", days, label: "Despensa", dot: "bg-bark/30", text: "text-bark/50" };
  }
  if (days < 0) {
    return { level: "urgent", days, label: "Caducado", dot: "bg-urgent", text: "text-urgent" };
  }
  if (days === 0) {
    return { level: "urgent", days, label: "Caduca hoy", dot: "bg-urgent", text: "text-urgent" };
  }
  if (days <= 3) {
    const label = days === 1 ? "Caduca mañana" : `${days} días`;
    return { level: "soon", days, label, dot: "bg-soon", text: "text-soon" };
  }
  return { level: "fresh", days, label: `${days} días`, dot: "bg-fresh", text: "text-fresh" };
}

// Los que caducan antes van primero: es el gancho del pitch contra el desperdicio.
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
  Proteina: "🥚",
  Verdura: "🥬",
  Fruta: "🍎",
  Lacteo: "🧀",
  Cereal: "🌾",
  Legumbre: "🫘",
  Despensa: "🫙",
};

export function emojiFor(category) {
  return CATEGORY_EMOJI[category] || "🍽️";
}

// El contrato de API define las categorias sin acentos; aqui solo las mostramos bonitas.
const CATEGORY_LABEL = {
  Proteina: "Proteína",
  Lacteo: "Lácteo",
};

export function categoryLabel(category) {
  return CATEGORY_LABEL[category] || category;
}
