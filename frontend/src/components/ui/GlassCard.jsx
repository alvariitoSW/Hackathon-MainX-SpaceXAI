import { cn } from "../../lib/utils";

export default function GlassCard({ as: Tag = "div", variant = "light", className, children, ...props }) {
  return (
    <Tag
      className={cn(
        "glass-specular rounded-3xl",
        variant === "solid" ? "glass-solid" : "glass",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
