import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import FridgeView from "./views/FridgeView";
import RecipesView from "./views/RecipesView";
import ShoppingListView from "./views/ShoppingListView";
import ProfileView from "./views/ProfileView";
import OnboardingView from "./views/OnboardingView";
import { clearProfile, loadProfile, persistProfile } from "./lib/profileStore";

// Cada vista trae su propio fondo para que el cambio de pestana se note.
const BACKGROUNDS = {
  fridge: "/img/bg-fridge.png",
  recipes: "/img/bg-recipes.png",
  shopping: "/img/bg-fridge.png",
  profile: "/img/bg-recipes.png",
};

// ?reset=1 borra el perfil del dispositivo: sirve para volver a grabar el
// onboarding sin tener que limpiar el navegador a mano durante la demo.
function readInitialProfile() {
  if (new URLSearchParams(window.location.search).has("reset")) {
    clearProfile();
    window.history.replaceState({}, "", window.location.pathname);
    return null;
  }
  return loadProfile();
}

export default function App() {
  const [activeView, setActiveView] = useState("fridge");
  const [profile, setProfile] = useState(readInitialProfile);

  // El backend guarda un unico profile.json y puede haberlo pisado otro juez,
  // asi que reafirmamos el perfil de este dispositivo al arrancar.
  useEffect(() => {
    if (profile) persistProfile(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!profile) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative overflow-hidden">
        <Backdrop src="/img/bg-fridge.png" />
        <main className="relative z-10 flex-1">
          <OnboardingView onFinish={setProfile} />
        </main>
      </div>
    );
  }

  function resetOnboarding() {
    clearProfile();
    setProfile(null);
    setActiveView("fridge");
  }

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
        {activeView === "profile" && (
          <ProfileView
            profile={profile}
            onProfileChange={setProfile}
            onResetOnboarding={resetOnboarding}
          />
        )}
      </main>

      <BottomNav activeView={activeView} onChange={setActiveView} />
    </div>
  );
}

function Backdrop({ src }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-0 mx-auto h-screen w-full max-w-md">
      <img src={src} alt="" aria-hidden="true" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/85" />
    </div>
  );
}
