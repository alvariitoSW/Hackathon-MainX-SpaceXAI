import ViewShell, { Placeholder } from "./ViewShell";

// Milestone: "Recipes view" in STATE.md
// "What do I eat today?" button -> generateRecipes(mealType) and the 2 recipe cards.
export default function RecipesView() {
  return (
    <ViewShell eyebrow="Today" title="What do I" accent="eat today?">
      <Placeholder>Recipes not implemented yet.</Placeholder>
    </ViewShell>
  );
}
