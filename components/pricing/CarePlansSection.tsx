"use client";

import { Check } from "lucide-react";
import { carePlans } from "@/content/pricing-page";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShineBorder } from "@/components/ui/shine-border";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Step 3: care plans, on a dark band, with a heartbeat line above them. */
export function CarePlansSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const alive = inView && !reduceMotion;

  return (
    <Section
      id="care-plans"
      className="scroll-mt-24 bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground"
    >
      <div ref={ref}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Eyebrow tone="inverse">Step 3</Eyebrow>
            <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
              {carePlans.title}
            </h2>
            <p className="mt-4 text-base text-primary-foreground/75 dark:text-foreground/75">
              {carePlans.intro}
            </p>
          </div>

          <div className="w-56 rounded-lg border border-border bg-card p-3 text-card-foreground">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-success motion-safe:animate-[who-blink_1800ms_ease-in-out_infinite]" />
              <p className="text-[11px] text-muted-foreground">
                All systems operational
              </p>
            </div>
            <svg viewBox="0 0 120 24" className="mt-2 h-6 w-full" aria-hidden="true">
              <path
                d="M0 12h18l4-8 4 16 4-10 4 4h16l4-6 4 12 4-8 4 2h18l4-4 4 8 4-4h22"
                fill="none"
                stroke="var(--color-success)"
                strokeWidth="1.4"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={100}
                className={cn(alive && "animate-[hiw-sign_5000ms_ease-in-out_infinite]")}
                style={{ strokeDashoffset: alive ? undefined : 0 }}
              />
            </svg>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-6">
          {carePlans.plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm",
                plan.highlight && "shadow-md",
              )}
            >
              {plan.highlight && !reduceMotion ? (
                <ShineBorder
                  borderWidth={1.5}
                  duration={14}
                  shineColor="var(--primary)"
                />
              ) : null}

              <div className="relative flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {plan.name}
                </h3>
                {plan.highlight ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                    {carePlans.recommended}
                  </span>
                ) : null}
              </div>

              <p className="relative mt-5 border-t border-border pt-5">
                <span className="font-mono text-2xl font-semibold text-foreground">
                  $
                  {reduceMotion ? (
                    plan.price.toLocaleString("en-US")
                  ) : (
                    <NumberTicker value={plan.price} />
                  )}
                </span>
                <span className="text-xs text-muted-foreground"> a month</span>
              </p>

              <ul className="relative mt-4 flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
