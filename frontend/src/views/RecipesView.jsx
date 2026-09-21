import { useState } from "react";
import { Bell, Flame, Leaf, Loader2, Sparkles, Target, Timer, Drumstick } from "lucide-react";

import RecipeCard from "../components/recipes/RecipeCard";
import GlassCard from "../components/ui/GlassCard";
import PillButton from "../components/ui/PillButton";
import { cn } from "../lib/utils";
import ViewShell from "./ViewShell";

const TIME_OPTIONS = ["15 min", "30 min", "1 hour+"];

const GOALS = [
  {
    label: "Red meat limit",
    value: "1 / 2",
    progress: 50,
    caption: "weekly portions",
    icon: Flame,
    tone: "text-soon",
  },
  {
    label: "White meat",
    value: "3 / 4",
    progress: 75,
    caption: "weekly target",
    icon: Drumstick,
    tone: "text-white",
  },
  {
    label: "Vegetables today",
    value: "4 / 5",
    progress: 80,
    caption: "daily servings",
    icon: Leaf,
    tone: "text-fresh",
  },
  {
    label: "Protein",
    value: "82g",
    progress: 68,
    caption: "120g goal",
    icon: Target,
    tone: "text-white",
  },
];

const RECOMMENDATIONS = [
  {
    id: "protein-bowl",
    title: "Lemon chicken protein bowl",
    time: "30 min",
    tags: ["High protein", "Uses spinach", "1 minor ingredient missing"],
    steps: [
      "Marinate chicken with lemon, garlic and olive oil.",
      "Saute spinach until soft and season with black pepper.",
      "Serve with rice and finish with yogurt sauce.",
    ],
  },
  {
    id: "tomato-eggs",
    title: "Shakshuka with fresh spinach",
    time: "20 min",
    tags: ["Spend your tomatoes", "Vegetarian", "Iron boost"],
    steps: [
      "Simmer tomatoes with paprika and a splash of olive oil.",
      "Fold in spinach and make two pockets for the eggs.",
      "Cover until the eggs set and serve straight away.",
    ],
  },
  {
    id: "salmon-plate",
    title: "Salmon and greens plate",
    time: "15 min",
    tags: ["Omega 3", "Fast dinner", "Low effort"],
    steps: [
      "Sear salmon skin-side down until crisp.",
      "Steam greens for 4 minutes and season lightly.",
      "Plate with lemon and a spoon of yogurt dressing.",
    ],
  },
];

export default function RecipesView() {
  const [selectedTime, setSelectedTime] = useState("30 min");
  const [craving, setCraving] = useState("");
  const [aiState, setAiState] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const [cookingId, setCookingId] = useState(null);
  const [openRecipeId, setOpenRecipeId] = useState(null);

  function generateFromCraving() {
    setAiState("loading");
    setFeedback("");

    window.setTimeout(() => {
      const normalized = craving.trim().toLowerCase();
      if (!normalized) {
        setFeedback("Tell me what you are craving first.");
      } else if (normalized.includes("burger") || normalized.includes("pizza")) {
        setFeedback(
          "Gemini would adapt that craving: red meat is close to your weekly limit, so try a chicken or veggie version."
        );
      } else {
        setFeedback(
          `Gemini found a ${selectedTime} path for "${craving.trim()}" using your fridge first.`
        );
      }
      setAiState("feedback");
    }, 900);
  }

  function cookRecipe(recipeId) {
    setCookingId(recipeId);
    setOpenRecipeId(null);

    window.setTimeout(() => {
      setCookingId(null);
      setOpenRecipeId(recipeId);
    }, 850);
  }

  return (
    <ViewShell eyebrow="Today" title="What do I" accent="eat today?">
      <div className="space-y-4">
        <PreventiveBanner />
        <GoalDashboard />
        <TimeSelector selectedTime={selectedTime} onSelect={setSelectedTime} />

        <CravingInput
          craving={craving}
          onCravingChange={setCraving}
          aiState={aiState}
          feedback={feedback}
          onGenerate={generateFromCraving}
        />

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Smart recommendations
              </p>
              <p className="mt-1 text-[13px] text-white/60">
                Tuned to your profile and fridge.
              </p>
            </div>
            <Sparkles size={18} className="text-white/70" />
          </div>

          <div className="space-y-3">
            {RECOMMENDATIONS.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isCooking={cookingId === recipe.id}
                isOpen={openRecipeId === recipe.id}
                onCook={cookRecipe}
              />
            ))}
          </div>
        </section>
      </div>
    </ViewShell>
  );
}

function PreventiveBanner() {
  return (
    <GlassCard className="p-4">
      <div className="flex gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/20">
          <Bell size={18} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            Preventive reminder
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-white/85">
            It is 11:00. Take the chicken out now to hit today's protein goal at dinner.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

function GoalDashboard() {
  return (
    <GlassCard className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            Goals
          </p>
          <p className="text-[13px] text-white/60">Weekly and daily progress</p>
        </div>
        <Target size={18} className="text-white/70" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GOALS.map((goal) => (
          <GoalTile key={goal.label} goal={goal} />
        ))}
      </div>
    </GlassCard>
  );
}

function GoalTile({ goal }) {
  const Icon = goal.icon;

  return (
    <div className="rounded-3xl bg-white/10 p-3 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-2">
        <Icon size={16} className={goal.tone} />
        <span className="text-[15px] font-semibold tabular-nums text-white">{goal.value}</span>
      </div>
      <p className="mt-2 text-[12px] font-semibold leading-tight text-white">{goal.label}</p>
      <p className="text-[11px] text-white/50">{goal.caption}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: `${goal.progress}%` }}
        />
      </div>
    </div>
  );
}

function TimeSelector({ selectedTime, onSelect }) {
  return (
    <GlassCard className="p-4">
      <div className="mb-3 flex items-center gap-2">
        <Timer size={17} className="text-white/70" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
          Time available today
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {TIME_OPTIONS.map((time) => {
          const isActive = selectedTime === time;
          return (
            <button
              key={time}
              type="button"
              onClick={() => onSelect(time)}
              aria-pressed={isActive}
              className={cn(
                "rounded-full px-3 py-3 text-[14px] font-semibold transition-all active:scale-[0.97]",
                isActive ? "bg-white text-bark shadow-md" : "bg-white/10 text-white/75"
              )}
            >
              {time}
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}

function CravingInput({ craving, onCravingChange, aiState, feedback, onGenerate }) {
  const isLoading = aiState === "loading";

  return (
    <GlassCard className="p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
        Craving input
      </p>
      <p className="mt-1 text-[13px] text-white/60">
        Tell Gemini what you feel like eating.
      </p>

      <div className="mt-3 flex gap-2">
        <input
          value={craving}
          onChange={(event) => onCravingChange(event.target.value)}
          placeholder="Pasta, burger, something fresh..."
          className={cn(
            "min-w-0 flex-1 rounded-full bg-white/15 px-4 py-3",
            "text-[14px] text-white placeholder:text-white/40",
            "outline-none ring-white/30 focus:ring-2"
          )}
        />
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-bark shadow-md active:scale-[0.97]"
          aria-label="Generate craving recipe"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
        </button>
      </div>

      {aiState === "feedback" && (
        <div className="mt-3 rounded-3xl bg-white/10 p-3 ring-1 ring-white/10">
          <p className="text-[13px] leading-relaxed text-white/75">{feedback}</p>
        </div>
      )}

      <PillButton
        variant="ghost"
        className="mt-3 flex items-center justify-center gap-2 py-3"
        onClick={onGenerate}
        disabled={isLoading}
      >
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        {isLoading ? "Generating..." : "Generate"}
      </PillButton>
    </GlassCard>
  );
}
