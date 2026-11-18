import { cn } from "@/lib/utils";

/** Initials avatar for clients and staff. */
export function Avatar({
  initials,
  className,
  muted = false,
}: {
  initials: string;
  className?: string;
  muted?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold",
        muted
          ? "bg-secondary text-muted-foreground"
          : "bg-primary/10 text-primary",
        className,
      )}
    >
      {initials}
    </span>
  );
}
