"use client";

import { useEffect, useState } from "react";
import { ArrowRight, FileText } from "lucide-react";
import { dashboardsClosing } from "@/content/custom-dashboards";
import { Section } from "@/components/shared/Section";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Ripple } from "@/components/ui/ripple";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Closing band: a pain point gets written down and turns into a Blueprint.
 */
export function DashboardsClosing() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.25 });
  const [round, setRound] = useState(0);
  const alive = inView && !reduceMotion;

  useEffect(() => {
    if (!alive) return;
    const timer = window.setInterval(
      () => setRound((value) => value + 1),
      7200,
    );
    return () => window.clearInterval(timer);
  }, [alive]);

  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
            {dashboardsClosing.title}
          </h2>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 dark:text-foreground/80 dark:text-foreground/80">
            {dashboardsClosing.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={dashboardsClosing.primary.href} className="bg-background text-foreground hover:bg-background/90">
              {dashboardsClosing.primary.label}
            </ButtonLink>
            <ButtonLink
              href={dashboardsClosing.secondary.href}
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 dark:text-foreground dark:hover:bg-foreground/10"
            >
              {dashboardsClosing.secondary.label}
            </ButtonLink>
          </div>
        </div>

        <div ref={ref} className="lg:col-span-5">
          <div className="relative">
            {alive ? (
              <Ripple
                aria-hidden="true"
                numCircles={4}
                mainCircleOpacity={0.12}
                className="[mask-image:none]"
              />
            ) : null}

            <div
              key={round}
              className="relative rounded-lg border border-border bg-primary-foreground/5 dark:bg-background/60 p-5 dark:bg-card"
            >
              <div className="flex items-center gap-2">
                <FileText
                  className="size-4 text-primary-foreground/70 dark:text-foreground/70 dark:text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] text-primary-foreground/60 dark:text-foreground/60 dark:text-muted-foreground">
                  notes.txt
                </span>
              </div>

              <p className="mt-3 min-h-12 font-mono text-sm text-primary-foreground dark:text-foreground">
                {reduceMotion ? (
                  dashboardsClosing.note
                ) : (
                  <TypingAnimation duration={55} showCursor>
                    {dashboardsClosing.note}
                  </TypingAnimation>
                )}
              </p>

              <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                <ArrowRight
                  className="size-3.5 text-highlight"
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-highlight-foreground",
                    alive &&
                      "animate-[who-pop_7200ms_ease-out_infinite]",
                  )}
                  style={{ animationDelay: "2.4s" }}
                >
                  {dashboardsClosing.blueprint}
                </span>
                <span className="text-xs text-primary-foreground/60 dark:text-foreground/60 dark:text-muted-foreground">
                  Fixed price, free
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
