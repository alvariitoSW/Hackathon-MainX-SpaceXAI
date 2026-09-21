import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";

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
  loadProfile,
  MEALS,
  persistProfile,
  SHOPPING_DAYS,
} from "../lib/profileStore";
import ViewShell from "./ViewShell";

export default function ProfileView({ profile: appProfile, onProfileChange, onResetOnboarding }) {
  const [profile, setProfile] = useState(appProfile || loadProfile() || createEmptyProfile());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function patch(changes) {
    setSaved(false);
    setProfile((prev) => ({ ...prev, ...changes }));
  }

  function patchSchedule(changes) {
    setSaved(false);
    setProfile((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, ...changes },
    }));
  }

  function toggleAllergen(item) {
    setSaved(false);
    setProfile((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(item)
        ? prev.allergies.filter((allergen) => allergen !== item)
        : [...prev.allergies, item],
    }));
  }

  function toggleMeal(meal) {
    setSaved(false);
    const value = meal.toLowerCase();
    setProfile((prev) => {
      const meals = prev.schedule.meals_per_day;
      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          meals_per_day: meals.includes(value)
            ? meals.filter((current) => current !== value)
            : [...meals, value],
        },
      };
    });
  }

  async function saveProfile() {
    setSaving(true);
    const nextProfile = {
      ...profile,
      name: profile.name.trim() || "Chef",
      hormonal_phase: profile.gender === "Woman" ? profile.hormonal_phase : "",
    };
    const savedProfile = await persistProfile(nextProfile);
    setProfile(savedProfile);
    onProfileChange?.(savedProfile);
    setSaved(true);
    setSaving(false);
  }

  return (
    <ViewShell eyebrow="Your profile" title="Eat the way" accent="you want">
      <div className="space-y-4">
        <GlassCard className="space-y-4 p-5">
          <Field label="Name">
            <input
              value={profile.name}
              onChange={(event) => patch({ name: event.target.value })}
              placeholder="Your name"
              className={inputClassName}
            />
          </Field>

          <Field label="Gender">
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
          </Field>

          {profile.gender === "Woman" && (
            <Field label="Cycle phase">
              <ChipGroup
                options={HORMONAL_PHASES}
                selected={[profile.hormonal_phase]}
                onSelect={(value) => patch({ hormonal_phase: value })}
              />
            </Field>
          )}

          <Field label="Diet">
            <ChipGroup
              options={DIETS}
              selected={[profile.diet_type]}
              onSelect={(value) => patch({ diet_type: value })}
            />
          </Field>

          <Field label="Allergens">
            <ChipGroup
              options={ALLERGENS}
              selected={profile.allergies}
              onSelect={toggleAllergen}
              multiple
            />
          </Field>

          <Field label="Cooking time">
            <ChipGroup
              options={COOKING_TIMES.map((minutes) => `${minutes} min`)}
              selected={[`${profile.schedule.cooking_time_minutes} min`]}
              onSelect={(value) =>
                patchSchedule({ cooking_time_minutes: parseInt(value, 10) })
              }
            />
          </Field>

          <Field label="Meals">
            <ChipGroup
              options={MEALS}
              selected={profile.schedule.meals_per_day.map(capitalize)}
              onSelect={toggleMeal}
              multiple
            />
          </Field>

          <Field label="Grocery day">
            <ChipGroup
              options={SHOPPING_DAYS}
              selected={[profile.schedule.shopping_day]}
              onSelect={(value) => patchSchedule({ shopping_day: value })}
            />
          </Field>
        </GlassCard>

        <PillButton className="flex items-center justify-center gap-2" onClick={saveProfile} disabled={saving}>
          <Save size={17} />
          {saving ? "Saving..." : saved ? "Saved" : "Save profile"}
        </PillButton>

        <PillButton
          variant="ghost"
          className="flex items-center justify-center gap-2"
          onClick={onResetOnboarding}
        >
          <RotateCcw size={17} />
          Redo onboarding
        </PillButton>
      </div>
    </ViewShell>
  );
}

const inputClassName = cn(
  "w-full rounded-2xl bg-white/15 px-4 py-3.5",
  "text-[17px] text-white placeholder:text-white/40",
  "outline-none ring-white/30 focus:ring-2"
);

function Field({ label, children }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
        {label}
      </p>
      {children}
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
              "rounded-full px-4 py-2.5 text-[14px] font-medium",
              "transition-all duration-200 active:scale-[0.97]",
              isOn ? "bg-white text-bark shadow-md" : "glass text-white/85"
            )}
          >
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
