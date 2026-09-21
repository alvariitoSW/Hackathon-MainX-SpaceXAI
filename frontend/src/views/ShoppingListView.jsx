import ViewShell, { Placeholder } from "./ViewShell";

// Milestone: "Shopping list view" in STATE.md
// Should render generateShoppingList(recipeIds) with the missing ingredients.
export default function ShoppingListView() {
  return (
    <ViewShell eyebrow="You're missing" title="Your shopping" accent="list">
      <Placeholder>Shopping list not implemented yet.</Placeholder>
    </ViewShell>
  );
}
