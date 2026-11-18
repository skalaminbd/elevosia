"use client";

import { packages } from "@/content/pricing-page";
import { Section } from "@/components/shared/Section";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Step 2: the four build packages, shaped to the workflow. */
export function PackagesSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="packages" className="scroll-mt-24">
      <div ref={ref} className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="max-w-xl font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
          {packages.title}
        </h2>
        <p className="max-w-md text-base text-muted-foreground">
          {packages.intro}
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {packages.plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "flex flex-col rounded-lg border p-6 shadow-sm",
              plan.popular
                ? "border-border bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground"
                : "border-border bg-card",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <h3
                className={cn(
                  "text-sm font-medium",
                  plan.popular
                    ? "text-primary-foreground dark:text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {plan.name}
              </h3>
              {plan.popular ? (
                <span className="shrink-0 rounded-full border border-primary-foreground/40 px-2 py-0.5 text-[10px] font-medium dark:border-foreground/40">
                  Most popular
                </span>
              ) : null}
            </div>

            <p
              className={cn(
                "mt-6 border-t pt-5 text-xs",
                plan.popular
                  ? "border-primary-foreground/20 text-primary-foreground/70 dark:border-border dark:text-foreground/70"
                  : "border-border text-muted-foreground",
              )}
            >
              from
            </p>
            <p className="mt-1 font-mono text-3xl font-semibold">
              $
              {reduceMotion ? (
                plan.price.toLocaleString("en-US")
              ) : (
                <NumberTicker value={plan.price} />
              )}
            </p>
            <p
              className={cn(
                "mt-1 font-mono text-[11px]",
                plan.popular
                  ? "text-primary-foreground/70 dark:text-foreground/70"
                  : "text-muted-foreground",
              )}
            >
              {plan.timeline}
            </p>
            <p
              className={cn(
                "mt-4 text-sm",
                plan.popular
                  ? "text-primary-foreground/80 dark:text-foreground/80"
                  : "text-muted-foreground",
              )}
            >
              {plan.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-6 rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            {packages.paymentTitle}
          </p>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {packages.payment}
          </p>
        </div>
        <div className="flex w-40 flex-col gap-1.5">
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
            {packages.segments.map((segment, index) => (
              <span
                key={segment.label}
                className={cn(
                  "block h-full origin-left bg-primary",
                  alive && "animate-[who-grow-x_6000ms_ease-out_infinite]",
                )}
                style={{
                  width: `${segment.width}%`,
                  animationDelay: `${index * 0.4}s`,
                }}
              />
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {packages.segments.map((segment) => segment.label).join(" · ")}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{packages.context}</p>
    </Section>
  );
}
