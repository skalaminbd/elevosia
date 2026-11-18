"use client";

import { cn } from "@/lib/utils";
import type { NavBadgeConfig } from "./nav-config";

/** Badge in the expanded sidebar: count, suffix, warning dot. */
export function NavBadge({ badge }: { badge: NavBadgeConfig }) {
  const text = `${badge.prefix ? `${badge.prefix} ` : ""}${badge.count}${
    badge.suffix ? ` ${badge.suffix}` : ""
  }`;

  if (badge.variant === "text" || badge.variant === "warningText") {
    return (
      <span
        className={cn(
          "shrink-0 text-xs font-medium",
          badge.variant === "warningText"
            ? "font-semibold text-sb-warning"
            : "text-sb-text-muted",
        )}
      >
        {text}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex h-5 min-w-5 shrink-0 items-center justify-center gap-1.5 rounded-full px-2 text-xs",
        badge.variant === "accent" && "bg-sb-accent-soft font-bold text-sb-accent",
        badge.variant === "warning" && "bg-sb-warning-soft font-bold text-sb-warning",
        badge.variant === "neutral" && "bg-sb-badge-bg font-semibold text-sb-badge-text",
      )}
    >
      {badge.variant === "warning" ? (
        <span className="size-1.5 rounded-full bg-sb-warning" aria-hidden="true" />
      ) : null}
      {text}
    </span>
  );
}

/** Badge in the collapsed rail: a small count bubble or a status dot. */
export function CollapsedBadge({ badge }: { badge: NavBadgeConfig }) {
  if (badge.statusOnly) {
    return (
      <span
        className="absolute top-2 right-2 size-2 rounded-full bg-sb-warning ring-2 ring-sb-bg"
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className={cn(
        "absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ring-2 ring-sb-bg",
        badge.variant === "warning"
          ? "bg-sb-warning text-sb-bg"
          : "bg-sb-accent text-sb-accent-fg",
      )}
      aria-hidden="true"
    >
      {badge.count}
    </span>
  );
}
