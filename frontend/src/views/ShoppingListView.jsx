import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, RefreshCw, Share2, Sparkles } from "lucide-react";

import ShoppingItemTile from "../components/forms/ShoppingItemTile";
import GlassCard from "../components/ui/GlassCard";
import PillButton from "../components/ui/PillButton";
import { generateShoppingList } from "../services/api";
import { cn } from "../lib/utils";
import ViewShell from "./ViewShell";

const FALLBACK_AI_ITEMS = [
  {
    id: "ai_feta",
    name: "Feta cheese",
    quantity: "200 g",
    category: "Dairy",
    source: "Recipe gap",
    bought: false,
  },
  {
    id: "ai_yogurt",
    name: "Greek yogurt",
    quantity: "4 units",
    category: "Dairy",
    source: "Running low",
    bought: false,
  },
  {
    id: "ai_tomatoes",
    name: "Cherry tomatoes",
    quantity: "1 pack",
    category: "Vegetable",
    source: "Pairs with dinner",
    bought: false,
  },
];

const QUICK_ADDS = [
  { name: "Chicken breast", category: "Protein" },
  { name: "Bananas", category: "Fruit" },
  { name: "Oat milk", category: "Dairy" },
  { name: "Avocado", category: "Vegetable" },
  { name: "Rice", category: "Grain" },
  { name: "Dark chocolate", category: "Pantry" },
];

export default function ShoppingListView() {
  const [items, setItems] = useState([]);
  const [manualName, setManualName] = useState("");
  const [manualQuantity, setManualQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    refreshAiList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingItems = items.filter((item) => !item.bought);
  const boughtItems = items.filter((item) => item.bought);

  const categoryCount = useMemo(() => {
    return pendingItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
  }, [pendingItems]);

  async function refreshAiList() {
    setLoading(true);
    setSyncing(true);
    try {
      const response = await generateShoppingList();
      const apiItems = response.items?.map((item, index) => ({
        id: `api_${index}_${item.name}`,
        name: item.name,
        quantity: item.quantity || "",
        category: item.category || "Other",
        source: "AI recipe gap",
        bought: false,
      }));
      setItems(apiItems?.length ? apiItems : FALLBACK_AI_ITEMS);
    } catch {
      setItems(FALLBACK_AI_ITEMS);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }

  function addManualItem() {
    const name = manualName.trim();
    if (!name) return;

    addItem({
      name,
      quantity: manualQuantity.trim(),
      category: "Custom",
      source: "Added by you",
    });
    setManualName("");
    setManualQuantity("");
  }

  function addItem(item) {
    setItems((current) => {
      const exists = current.some((existing) => existing.name.toLowerCase() === item.name.toLowerCase());
      if (exists) return current;

      return [
        {
          id: `manual_${Date.now()}_${item.name}`,
          quantity: "",
          bought: false,
          ...item,
        },
        ...current,
      ];
    });
  }

  function toggleBought(item) {
    setItems((current) =>
      current.map((candidate) =>
        candidate.id === item.id ? { ...candidate, bought: !candidate.bought } : candidate
      )
    );
  }

  return (
    <ViewShell eyebrow="You're missing" title="Your shopping" accent="list">
      <div className="space-y-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                AI restock
              </p>
              <p className="mt-1 text-[14px] leading-relaxed text-white/75">
                Missing ingredients from recipes and products likely to run out soon.
              </p>
            </div>
            <button
              type="button"
              onClick={refreshAiList}
              disabled={syncing}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-bark shadow-md active:scale-[0.97]"
              aria-label="Refresh AI shopping suggestions"
            >
              {syncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat value={pendingItems.length} label="to buy" />
            <Stat value={boughtItems.length} label="done" />
            <Stat value={Object.keys(categoryCount).length} label="groups" />
          </div>
        </GlassCard>

        <ManualAddCard
          name={manualName}
          quantity={manualQuantity}
          onNameChange={setManualName}
          onQuantityChange={setManualQuantity}
          onAdd={addManualItem}
        />

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Quick add
              </p>
              <p className="mt-1 text-[13px] text-white/60">
                Bring-style suggestions for common items.
              </p>
            </div>
            <Sparkles size={18} className="text-white/70" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_ADDS.map((item) => (
              <ShoppingItemTile
                key={item.name}
                item={{ ...item, quantity: item.category, source: "Suggestion" }}
                onAdd={addItem}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Shopping list
              </p>
              <p className="mt-1 text-[13px] text-white/60">
                Tap an item when it is in the cart.
              </p>
            </div>
            <Share2 size={18} className="text-white/70" />
          </div>

          {loading ? (
            <LoadingList />
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {items.map((item) => (
                <ShoppingItemTile key={item.id} item={item} onToggle={toggleBought} />
              ))}
            </div>
          )}
        </section>
      </div>
    </ViewShell>
  );
}

function ManualAddCard({ name, quantity, onNameChange, onQuantityChange, onAdd }) {
  return (
    <GlassCard className="p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
        Add anything
      </p>
      <div className="mt-3 grid grid-cols-[1fr_88px] gap-2">
        <input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="What do you need?"
          className={inputClassName}
        />
        <input
          value={quantity}
          onChange={(event) => onQuantityChange(event.target.value)}
          placeholder="Qty"
          className={cn(inputClassName, "text-center")}
        />
      </div>
      <PillButton
        variant="accent"
        className="mt-3 flex items-center justify-center gap-2 py-3"
        onClick={onAdd}
      >
        <Plus size={17} />
        Add to list
      </PillButton>
    </GlassCard>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-3xl bg-white/10 p-3 text-center ring-1 ring-white/10">
      <p className="text-xl font-semibold tabular-nums text-white">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{label}</p>
    </div>
  );
}

function LoadingList() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="glass h-[92px] animate-pulse rounded-3xl" />
      ))}
    </div>
  );
}

const inputClassName = cn(
  "min-w-0 rounded-full bg-white/15 px-4 py-3",
  "text-[14px] text-white placeholder:text-white/40",
  "outline-none ring-white/30 focus:ring-2"
);
