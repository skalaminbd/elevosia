"use client";

import { normalWeek } from "@/content/how-it-works";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

/**
 * A normal week: the day strip with a marker that walks the week, plus what
 * happens on each kind of day.
 */
export function WeekSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="weekly-board" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="max-w-xl font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
          {normalWeek.title}
        </h2>
        <p className="max-w-md text-base text-muted-foreground">
          {normalWeek.intro}
        </p>
      </div>

      <div ref={ref} className="mt-12">
        <div className="relative rounded-lg border border-border bg-card p-2 shadow-sm">
          <div className="relative z-10 grid grid-cols-5 gap-1">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="rounded-md bg-muted/50 py-2 text-center font-mono text-xs text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-2 left-2 w-[calc(20%-0.4rem)] rounded-md border border-primary/40 bg-accent",
              alive && "animate-[hiw-week_9000ms_ease-in-out_infinite]",
            )}
          />
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {normalWeek.days.map((day) => (
            <li
              key={day.id}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <p className="font-mono text-xs text-muted-foreground">
                {day.day}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                {day.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
