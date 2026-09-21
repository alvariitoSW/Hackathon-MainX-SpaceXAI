import { cn } from "../../lib/utils";

const VARIANTS = {
  primary: "bg-white text-bark shadow-lg shadow-black/20",
  ghost: "glass text-white",
  accent: "bg-clay text-white shadow-lg shadow-ember/30",
};

export default function PillButton({ variant = "primary", className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "w-full rounded-full px-6 py-4 text-[15px] font-semibold",
        "transition-transform duration-200 active:scale-[0.97]",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
