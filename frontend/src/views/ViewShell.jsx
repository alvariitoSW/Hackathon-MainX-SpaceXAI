import GlassCard from "../components/ui/GlassCard";

// Shared view header. The headline mixes sans with a serif italic accent, which
// is what gives the reference design its editorial feel.
export default function ViewShell({ eyebrow, title, accent, children }) {
  return (
    <div className="px-5 pb-8 pt-16">
      <header className="animate-fade-up">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/60">{eyebrow}</p>
        <h1 className="mt-2 text-[40px] leading-[1.05] font-semibold tracking-tight text-white text-shadow-soft">
          {title}
          <br />
          <span className="font-serif italic font-normal">{accent}</span>
        </h1>
      </header>

      <div className="mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
        {children}
      </div>
    </div>
  );
}

export function Placeholder({ children }) {
  return (
    <GlassCard className="p-5">
      <p className="text-sm leading-relaxed text-white/70">{children}</p>
    </GlassCard>
  );
}
