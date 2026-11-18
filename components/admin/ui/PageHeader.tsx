import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Page title block: meta line, heading, description, optional actions. */
export function PageHeader({
  title,
  description,
  meta,
  children,
  className,
}: {
  title: string;
  description?: string;
  meta?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {meta ? (
          <p className="text-xs text-muted-foreground">{meta}</p>
        ) : null}
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children ? (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}
