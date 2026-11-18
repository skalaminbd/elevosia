"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLE_ACCESS, type SidebarCounts, type SidebarRole } from "./nav-config";

/** "Today's briefing" card. Hidden when every row is zero. */
export function BriefingCard({
  counts,
  role,
}: {
  counts: SidebarCounts;
  role: SidebarRole;
}) {
  const allowed = new Set<string>(ROLE_ACCESS[role]);
  const rows: {
    id: string;
    label: string;
    value: number;
    href: string;
    tone: "warning" | "normal";
  }[] = [];

  if (counts.blueprintsDue > 0 && allowed.has("blueprints")) {
    rows.push({
      id: "blueprints",
      label: "Blueprints due",
      value: counts.blueprintsDue,
      href: "/admin/requirements?sort=due",
      tone: "warning",
    });
  }
  if (counts.ticketsNearSla > 0 && allowed.has("tickets")) {
    rows.push({
      id: "tickets",
      label: "Tickets near SLA",
      value: counts.ticketsNearSla,
      href: "/admin/tickets?filter=sla",
      tone: "warning",
    });
  }
  if (counts.callsToday > 0 && allowed.has("calls")) {
    rows.push({
      id: "calls",
      label: "Calls today",
      value: counts.callsToday,
      href: "/admin/calls",
      tone: "normal",
    });
  }

  if (rows.length === 0) return null;

  return (
    <div className="mt-4 rounded-lg border border-sb-surface-border bg-sb-surface p-3.5">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-sb-accent" aria-hidden="true" />
        <p className="text-sm font-semibold text-sb-text-hover">Today&apos;s briefing</p>
      </div>
      <div className="mt-2.5 flex flex-col gap-2">
        {rows.map((row) => (
          <Link
            key={row.id}
            href={row.href}
            className="flex items-center justify-between gap-2 rounded-sm text-sm text-sb-text transition-colors hover:text-sb-text-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sb-focus"
          >
            <span>{row.label}</span>
            <span
              className={cn(
                "font-semibold tabular-nums",
                row.tone === "warning" ? "text-sb-warning" : "text-sb-text-hover",
              )}
            >
              {row.value}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
