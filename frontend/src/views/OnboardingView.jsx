import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";

import GlassCard from "../components/ui/GlassCard";
import PillButton from "../components/ui/PillButton";
import { cn } from "../lib/utils";
import {
  ALLERGENS,
  COOKING_TIMES,
  createEmptyProfile,
  DIETS,
  GENDERS,
  HORMONAL_PHASES,
  MEALS,
  SHOPPING_DAYS,
  persistProfile,
} from "../lib/profileStore";

const STEPS = ["name", "you", "diet", "allergies", "routine"];

export default function OnboardingView({ onFinish }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(createEmptyProfile);
  const [saving, setSaving] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  // Only worth asking about the cycle when it applies.
  const asksHormonalPhase = profile.gender === "Woman";

  function patch(changes) {
    setProfile((prev) => ({ ...prev, ...changes }));
  }

  function patchSchedule(changes) {
    setProfile((prev) => ({ ...prev, schedule: { ...prev.schedule, ...changes } }));
  }

  function toggleAllergen(item) {
    setProfile((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(item)
        ? prev.allergies.filter((a) => a !== item)
        : [...prev.allergies, item],
    }));
  }

  function toggleMeal(meal) {
    const value = meal.toLowerCase();
    setProfile((prev) => {
      const meals = prev.schedule.meals_per_day;
      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          meals_per_day: meals.includes(value)
            ? meals.filter((m) => m !== value)
            : [...meals, value],
        },
      };
    });
  }

  async function finish(finalProfile) {
    setSaving(true);
    const saved = await persistProfile({
      ...finalProfile,
      name: finalProfile.name.trim() || "Chef",
    });
    onFinish(saved);
  }

  function next() {
    if (isLast) return finish(profile);
    setStep((s) => s + 1);
  }

  const COPY = {
    name: {
      eyebrow: "Welcome",
      title: "Your fridge,",
      accent: "your chef",
      subtitle:
        "One minute to set up your profile so every recipe actually fits you.",
    },
    you: {
      eyebrow: "About you",
      title: "Tell us",
      accent: "who you are",
      subtitle: "We use this to tune the nutrients that suit you best right now.",
    },
    diet: {
      eyebrow: "Eating",
      title: "How do you",
      accent: "eat?",
      subtitle: "Pick whatever best describes your everyday.",
    },
    allergies: {
      eyebrow: "Safety",
      title: "Anything to",
      accent: "avoid?",
      subtitle: "No dish we suggest will ever include these ingredients.",
    },
    routine: {
      eyebrow: "Your routine",
      title: "Time and",
      accent: "groceries",
      subtitle: "So we match recipes to the minutes you actually have.",
    },
  }[current];

  return (
    <div className="flex min-h-screen flex-col px-5 pb-8 pt-14">
      <div className="flex items-center gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            aria-label="Back to previous step"
            className="glass grid h-9 w-9 place-items-center rounded-full text-white"
          >
            <ChevronLeft size={18} />
          </button>
        ) : (
          <span className="h-9 w-9" />
        )}
        <Dots total={STEPS.length} active={step} />
      </div>

      <header key={current} className="mt-8 animate-fade-up">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/60">
          {COPY.eyebrow}
        </p>
        <h1 className="mt-2 text-[40px] leading-[1.05] font-semibold tracking-tight text-white text-shadow-soft">
          {COPY.title}
          <br />
          <span className="font-serif italic font-normal">{COPY.accent}</span>
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-white/70">{COPY.subtitle}</p>
      </header>

      <div
        key={`${current}-body`}
        className="mt-7 flex-1 animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        {current === "name" && (
          <GlassCard className="p-5">
            <label
              htmlFor="onboarding-name"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50"
            >
              What's your name?
            </label>
            <input
              id="onboarding-name"
              autoFocus
              value={profile.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder="Your name"
              className={cn(
                "mt-3 w-full rounded-2xl bg-white/15 px-4 py-3.5",
                "text-[17px] text-white placeholder:text-white/40",
                "outline-none ring-white/30 focus:ring-2"
              )}
            />
          </GlassCard>
        )}

        {current === "you" && (
          <div className="space-y-4">
            <Section label="Gender">
              <ChipGroup
                options={GENDERS}
                selected={[profile.gender]}
                onSelect={(value) =>
                  patch({
                    gender: value,
                    hormonal_phase: value === "Woman" ? profile.hormonal_phase : "",
                  })
                }
              />
            </Section>

            {asksHormonalPhase && (
              <Section
                label="Cycle phase"
                hint="We adapt iron, magnesium and energy to your phase."
              >
                <ChipGroup
                  options={HORMONAL_PHASES}
                  selected={[profile.hormonal_phase]}
                  onSelect={(value) => patch({ hormonal_phase: value })}
                />
              </Section>
            )}
          </div>
        )}

        {current === "diet" && (
          <Section label="Diet type">
            <ChipGroup
              options={DIETS}
              selected={[profile.diet_type]}
              onSelect={(value) => patch({ diet_type: value })}
            />
          </Section>
        )}

        {current === "allergies" && (
          <Section label="Allergens and intolerances" hint="You can pick several.">
            <ChipGroup
              options={ALLERGENS}
              selected={profile.allergies}
              onSelect={toggleAllergen}
              multiple
            />
          </Section>
        )}

        {current === "routine" && (
          <div className="space-y-4">
            <Section label="Minutes to cook">
              <ChipGroup
                options={COOKING_TIMES.map((m) => `${m} min`)}
                selected={[`${profile.schedule.cooking_time_minutes} min`]}
                onSelect={(value) =>
                  patchSchedule({ cooking_time_minutes: parseInt(value, 10) })
                }
              />
            </Section>

            <Section label="Meals you plan">
              <ChipGroup
                options={MEALS}
                selected={profile.schedule.meals_per_day.map(capitalize)}
                onSelect={toggleMeal}
                multiple
              />
            </Section>

            <Section label="Grocery shopping day">
              <ChipGroup
                options={SHOPPING_DAYS}
                selected={[profile.schedule.shopping_day]}
                onSelect={(value) => patchSchedule({ shopping_day: value })}
              />
            </Section>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-2">
        <PillButton onClick={next} disabled={saving}>
          {saving ? "Saving..." : isLast ? "Get started" : "Next"}
        </PillButton>
        <PillButton variant="ghost" onClick={() => finish(profile)} disabled={saving}>
          Skip
        </PillButton>
      </div>
    </div>
  );
}

function Dots({ total, active }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === active ? "w-6 bg-white" : "w-1.5 bg-white/35"
          )}
        />
      ))}
    </div>
  );
}

function Section({ label, hint, children }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
        {label}
      </p>
      {children}
      {hint && <p className="mt-2 text-[13px] text-white/50">{hint}</p>}
    </div>
  );
}

function ChipGroup({ options, selected, onSelect, multiple }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isOn = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isOn}
            onClick={() => onSelect(option)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[14px] font-medium",
              "transition-all duration-200 active:scale-[0.97]",
              isOn ? "bg-white text-bark shadow-md" : "glass text-white/85"
            )}
          >
            {multiple && isOn && <Check size={14} strokeWidth={3} />}
            {option}
          </button>
        );
      })}
    </div>
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
