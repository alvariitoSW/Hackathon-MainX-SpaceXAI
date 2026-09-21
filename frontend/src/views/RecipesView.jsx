import ViewShell, { Placeholder } from "./ViewShell";

// Hito: "Vista Recetas" en STATE.md
// Boton "Que como hoy?" -> generateRecipes(mealType) y tarjetas con las 2 recetas.
export default function RecipesView() {
  return (
    <ViewShell eyebrow="Hoy toca" title="¿Qué como" accent="hoy?">
      <Placeholder>Recetas pendientes de implementar.</Placeholder>
    </ViewShell>
  );
}
