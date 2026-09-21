import { Check, Plus } from "lucide-react";

import { cn } from "../../lib/utils";

export default function ShoppingItemTile({ item, onToggle, onAdd }) {
  const isBought = Boolean(item.bought);
  const action = onToggle || onAdd;

  return (
    <button
      type="button"
      onClick={() => action?.(item)}
      aria-pressed={isBought}
      className={cn(
        "glass glass-specular min-h-[92px] rounded-3xl p-3 text-left",
        "transition-all duration-200 active:scale-[0.98]",
        isBought && "opacity-55"
      )}
    >
      <div className="flex h-full flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={cn("text-[15px] font-semibold leading-tight text-white", isBought && "line-through")}>
              {item.name}
            </p>
            <p className="mt-1 text-[12px] text-white/55">{item.quantity || item.category}</p>
          </div>
          <span
            className={cn(
              "grid h-7 w-7 shrink-0 place-items-center rounded-full",
              isBought ? "bg-fresh text-white" : "bg-white/20 text-white"
            )}
          >
            {onAdd ? <Plus size={15} /> : <Check size={15} />}
          </span>
        </div>

        <span className="w-fit rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-semibold text-white/65">
          {item.source}
        </span>
      </div>
    </button>
  );
}
