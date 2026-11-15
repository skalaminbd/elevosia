import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "inverse";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "inverse"
          ? "bg-highlight/10 text-highlight"
          : "bg-success/15 text-success",
      )}
    >
      {children}
    </span>
  );
}
