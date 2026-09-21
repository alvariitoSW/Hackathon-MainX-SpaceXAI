import { useEffect, useState } from "react";
import { ScanLine, TriangleAlert } from "lucide-react";
import { getInventory } from "../services/api";
import { freshnessOf, sortByUrgency, emojiFor, categoryLabel } from "../lib/freshness";
import GlassCard from "../components/ui/GlassCard";
import PillButton from "../components/ui/PillButton";
import FreshnessBadge from "../components/ui/FreshnessBadge";

export default function FridgeView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getInventory()
      .then((data) => setItems(sortByUrgency(data.items || [])))
      .catch(() => setError("No se pudo cargar la nevera."))
      .finally(() => setLoading(false));
  }, []);

  const expiringSoon = items.filter((item) => {
    const level = freshnessOf(item).level;
    return level === "urgent" || level === "soon";
  });

  return (
    <div className="px-5 pb-8 pt-16">
      <header className="animate-fade-up">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/60">
          Hola, Laura
        </p>
        <h1 className="mt-2 text-[40px] leading-[1.05] font-semibold tracking-tight text-white text-shadow-soft">
          Tu nevera,
          <br />
          <span className="font-serif italic font-normal">tu chef</span>
        </h1>
      </header>

      <GlassCard
        className="mt-6 flex items-center gap-4 p-4 animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        <Stat value={items.length} label="alimentos" />
        <div className="h-9 w-px bg-white/25" />
        <Stat value={expiringSoon.length} label="por caducar" highlight />
      </GlassCard>

      {expiringSoon.length > 0 && (
        <GlassCard
          className="mt-3 flex items-center gap-3 p-4 animate-fade-up"
          style={{ animationDelay: "140ms" }}
        >
          <TriangleAlert size={18} className="shrink-0 text-soon" />
          <p className="text-[13px] leading-snug text-white/90">
            Cocina pronto <strong className="font-semibold">{expiringSoon[0].name}</strong> para
            no tirarlo.
          </p>
        </GlassCard>
      )}

      <section className="mt-7">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
          En la nevera
        </h2>

        {loading && <SkeletonList />}
        {error && <p className="text-sm text-white/70">{error}</p>}

        <ul className="space-y-2.5">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="animate-fade-up"
              style={{ animationDelay: `${180 + index * 60}ms` }}
            >
              <FoodRow item={item} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-7 animate-fade-up" style={{ animationDelay: "320ms" }}>
        <PillButton className="flex items-center justify-center gap-2">
          <ScanLine size={18} />
          Escanear ticket
        </PillButton>
      </div>
    </div>
  );
}

function Stat({ value, label, highlight }) {
  return (
    <div className="flex-1">
      <p
        className={`text-2xl font-semibold tabular-nums ${
          highlight && value > 0 ? "text-soon" : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="text-[11px] font-medium uppercase tracking-wider text-white/60">{label}</p>
    </div>
  );
}

function FoodRow({ item }) {
  const freshness = freshnessOf(item);

  return (
    <GlassCard className="flex items-center gap-3.5 p-3.5">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20 text-2xl">
        {emojiFor(item.category)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-white">{item.name}</p>
        <p className="text-[13px] text-white/60">
          {item.quantity} &middot; {categoryLabel(item.category)}
        </p>
      </div>

      <FreshnessBadge freshness={freshness} />
    </GlassCard>
  );
}

function SkeletonList() {
  return (
    <ul className="space-y-2.5">
      {[0, 1, 2].map((i) => (
        <li key={i} className="glass h-[76px] animate-pulse rounded-3xl" />
      ))}
    </ul>
  );
}
