import { cn } from "../../lib/utils";

export default function FreshnessBadge({ freshness, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1",
        "text-[11px] font-semibold tabular-nums",
        freshness.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", freshness.dot)} />
      {freshness.label}
    </span>
  );
}
