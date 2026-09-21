import { Refrigerator, ChefHat, ShoppingCart, User } from "lucide-react";
import { cn } from "../lib/utils";

const TABS = [
  { id: "fridge", label: "Fridge", icon: Refrigerator },
  { id: "recipes", label: "Recipes", icon: ChefHat },
  { id: "shopping", label: "List", icon: ShoppingCart },
  { id: "profile", label: "Profile", icon: User },
];

export default function BottomNav({ activeView, onChange }) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 px-4 pb-5 pt-2">
      <div className="glass glass-specular flex items-stretch justify-around rounded-full p-1.5">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-full py-2.5",
                "transition-all duration-300",
                isActive ? "bg-white text-bark shadow-md" : "text-white/70"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              <span className="text-[10px] font-semibold tracking-tight">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
