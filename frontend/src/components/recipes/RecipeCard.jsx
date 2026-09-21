import { Clock, Loader2, Utensils } from "lucide-react";

import GlassCard from "../ui/GlassCard";
import PillButton from "../ui/PillButton";
import { cn } from "../../lib/utils";

export default function RecipeCard({ recipe, isCooking, isOpen, onCook }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[17px] font-semibold leading-tight text-white">{recipe.title}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-white/60">
            <Clock size={14} />
            {recipe.time}
          </p>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/20">
          <Utensils size={18} className="text-white" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {recipe.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold",
              "bg-white/15 text-white/80 ring-1 ring-white/15"
            )}
          >
            {tag}
          </span>
        ))}
      </div>

      <PillButton
        variant="accent"
        className="mt-4 flex items-center justify-center gap-2 py-3"
        onClick={() => onCook(recipe.id)}
        disabled={isCooking}
      >
        {isCooking && <Loader2 size={16} className="animate-spin" />}
        {isCooking ? "Preparing..." : isOpen ? "Recipe ready" : "Cook this"}
      </PillButton>

      {isOpen && (
        <div className="mt-4 rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            Gemini plan
          </p>
          <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-white/75">
            {recipe.steps.map((step, index) => (
              <li key={step} className="flex gap-2">
                <span className="font-semibold text-white/90">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[12px] leading-relaxed text-white/55">
            Inventory update simulated: ingredients used would be deducted after the
            real Gemini JSON lands.
          </p>
        </div>
      )}
    </GlassCard>
  );
}
