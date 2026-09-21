import { useState } from "react";
import BottomNav from "./components/BottomNav";
import FridgeView from "./views/FridgeView";
import RecipesView from "./views/RecipesView";
import ShoppingListView from "./views/ShoppingListView";
import ProfileView from "./views/ProfileView";

// Cada vista trae su propio fondo para que el cambio de pestana se note.
const BACKGROUNDS = {
  fridge: "/img/bg-fridge.png",
  recipes: "/img/bg-recipes.png",
  shopping: "/img/bg-fridge.png",
  profile: "/img/bg-recipes.png",
};

export default function App() {
  const [activeView, setActiveView] = useState("fridge");

  return (
    // pb-28 deja hueco para la barra flotante, que es mas alta que una nav pegada al borde.
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col pb-28 relative overflow-hidden">
      {/* Fondo fotografico a sangre, con un degradado que oscurece la parte
          inferior para que el contenido y la nav siempre sean legibles. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 mx-auto h-screen w-full max-w-md">
        {Object.entries(BACKGROUNDS).map(([view, src]) => (
          <img
            key={view}
            src={src}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              activeView === view ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/85" />
      </div>

      <main className="relative z-10 flex-1">
        {activeView === "fridge" && <FridgeView />}
        {activeView === "recipes" && <RecipesView />}
        {activeView === "shopping" && <ShoppingListView />}
        {activeView === "profile" && <ProfileView />}
      </main>

      <BottomNav activeView={activeView} onChange={setActiveView} />
    </div>
  );
}
