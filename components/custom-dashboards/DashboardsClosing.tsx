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
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {dashboardsClosing.title}
          </h2>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 dark:text-foreground/80">
            {dashboardsClosing.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={dashboardsClosing.primary.href} variant="highlight">
              {dashboardsClosing.primary.label}
            </ButtonLink>
            <ButtonLink
              href={dashboardsClosing.secondary.href}
              variant="outline"
              className="text-foreground"
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
              className="relative rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-5 dark:border-border dark:bg-card"
            >
              <div className="flex items-center gap-2">
                <FileText
                  className="size-4 text-primary-foreground/70 dark:text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] text-primary-foreground/60 dark:text-muted-foreground">
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

              <div className="mt-4 flex items-center gap-2 border-t border-primary-foreground/15 pt-4 dark:border-border">
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
                <span className="text-xs text-primary-foreground/60 dark:text-muted-foreground">
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
