import ViewShell, { Placeholder } from "./ViewShell";

// Hito: "Vista Lista de la compra" en STATE.md
// Debe pintar generateShoppingList(recipeIds) con los ingredientes que faltan.
export default function ShoppingListView() {
  return (
    <ViewShell eyebrow="Te falta" title="Lista de" accent="la compra">
      <Placeholder>Lista de la compra pendiente de implementar.</Placeholder>
    </ViewShell>
  );
}
