"use client";

import { Globe, LayoutDashboard, Users, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const SOURCES = [
  { id: "team", label: "Team", icon: Users, y: 20 },
  { id: "clients", label: "Clients", icon: Globe, y: 60 },
  { id: "website", label: "Website", icon: Wrench, y: 100 },
];

/**
 * Chapter 3 item: team, clients and website all feed one dashboard.
 */
export function BeamHub({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  const flowing = active && !reduceMotion;

  return (
    <div className="flex h-full items-center gap-3">
      <ul className="flex flex-1 flex-col gap-3">
        {SOURCES.map((source) => (
          <li
            key={source.id}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2"
          >
            <source.icon
              className="size-3.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-foreground">
              {source.label}
            </span>
          </li>
        ))}
      </ul>

      <svg
        aria-hidden="true"
        viewBox="0 0 64 120"
        preserveAspectRatio="none"
        className="h-[152px] w-16 shrink-0"
      >
        {[20, 60, 100].map((y) => (
          <path
            key={y}
            d={`M0 ${y} H28 V60 H64`}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={1.25}
            strokeDasharray="4 4"
            className={cn(
              "opacity-45",
              flowing && "animate-[about-beam_2400ms_linear_infinite]",
            )}
          />
        ))}
      </svg>

      <div className="flex w-24 shrink-0 flex-col items-center gap-2 rounded-lg bg-primary px-3 py-4 text-center text-primary-foreground">
        <LayoutDashboard className="size-5" aria-hidden="true" />
        <span className="text-xs font-medium leading-tight">One dashboard</span>
      </div>
    </div>
  );
}
