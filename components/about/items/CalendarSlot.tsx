"use client";

import { CalendarDays, Clock } from "lucide-react";
import { aboutDemo } from "@/content/about";
import { cn } from "@/lib/utils";

/**
 * Closing item: the booked 30-minute call, with the duration badge breathing.
 */
export function CalendarSlot({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  const { calendar } = aboutDemo;
  const pulsing = active && !reduceMotion;

  return (
    <div className="rounded-lg border border-border bg-primary-foreground/5 dark:bg-background/60 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-primary-foreground/70 dark:text-foreground/70">
          {calendar.weekday}, {calendar.date}
        </p>
        <CalendarDays
          className="size-4 text-primary-foreground/70 dark:text-foreground/70"
          aria-hidden="true"
        />
      </div>

      <div className="mt-4 rounded-lg border border-border bg-primary-foreground/10 dark:bg-background/70 px-3 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-mono text-sm text-primary-foreground dark:text-foreground">
            <Clock className="size-3.5" aria-hidden="true" />
            {calendar.time}
          </span>
          <span
            className={cn(
              "rounded-full bg-highlight px-2.5 py-1 text-xs font-semibold text-highlight-foreground",
              pulsing && "animate-[about-slot-pulse_2800ms_ease-in-out_infinite]",
            )}
          >
            {calendar.duration}
          </span>
        </div>
        <p className="mt-2 text-sm font-medium text-primary-foreground dark:text-foreground">
          {calendar.title}
        </p>
      </div>

      <p className="mt-3 text-xs text-primary-foreground/60 dark:text-foreground/60">
        No pitch deck. Sample slot.
      </p>
    </div>
  );
}
