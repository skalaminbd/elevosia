"use client";

import { industriesClosing } from "@/content/industries";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const JOBS = [2, 3, 2, 4, 3];

/** Closing band: a small week calendar that fills with jobs. */
export function IndustriesClosing() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.25 });
  const alive = inView && !reduceMotion;

  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
            {industriesClosing.title}
          </h2>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 dark:text-foreground/80">
            {industriesClosing.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={industriesClosing.primary.href}
              className="bg-background text-foreground hover:bg-background/90"
            >
              {industriesClosing.primary.label}
            </ButtonLink>
            <ButtonLink
              href={industriesClosing.secondary.href}
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 dark:text-foreground dark:hover:bg-foreground/10"
            >
              {industriesClosing.secondary.label}
            </ButtonLink>
          </div>
        </div>

        <div ref={ref} className="lg:col-span-5">
          <div className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">This week</p>
              <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                14 jobs
              </span>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2">
              {DAYS.map((day, dayIndex) => (
                <div key={day} className="flex flex-col gap-1.5">
                  <p className="text-center font-mono text-[10px] text-muted-foreground">
                    {day}
                  </p>
                  {Array.from({ length: JOBS[dayIndex] }).map((_, jobIndex) => (
                    <span
                      key={jobIndex}
                      className={cn(
                        "block h-4 rounded-sm bg-accent",
                        alive && "animate-[who-pop_6000ms_ease-out_infinite]",
                      )}
                      style={{
                        animationDelay: `${(dayIndex * 3 + jobIndex) * 0.18}s`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
              Jobs land on the board as soon as a customer books. Sample data.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
