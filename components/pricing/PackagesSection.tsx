"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Database,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { packages } from "@/content/pricing-page";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof LayoutDashboard> = {
  portal: LayoutDashboard,
  roles: KeyRound,
  migration: Database,
  training: GraduationCap,
  warranty: Wrench,
  ownership: ShieldCheck,
};

/**
 * Step 2: the four build packages. Picking a team size points to the closest
 * fit, which gets a ring and a badge; the payment bar fills on a loop.
 */
export function PackagesSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const alive = inView && !reduceMotion;
  const [team, setTeam] = useState(packages.teamFit[1].id);
  const recommended = packages.teamFit.find((item) => item.id === team)?.plan;

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

      <div className="mt-8 flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">{packages.teamFitLabel}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {packages.teamFitHint}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {packages.teamFit.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setTeam(option.id)}
              aria-pressed={team === option.id}
              className={cn(
                "min-h-9 rounded-full px-3 text-xs font-medium transition-colors",
                team === option.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {packages.plans.map((plan) => {
          const isRecommended = plan.id === recommended;
          return (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col rounded-lg border p-6 shadow-sm transition-shadow",
                plan.popular
                  ? "border-border bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground"
                  : "border-border bg-card",
                isRecommended &&
                  (plan.popular
                    ? "ring-2 ring-highlight/60"
                    : "ring-2 ring-primary/35"),
              )}
            >
              <div className="flex min-h-6 items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {plan.popular ? (
                  <span className="shrink-0 rounded-full border border-primary-foreground/40 px-2 py-0.5 text-[10px] font-medium dark:border-foreground/40">
                    Most popular
                  </span>
                ) : null}
              </div>

              {isRecommended ? (
                <p
                  className={cn(
                    "mt-2 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium",
                    plan.popular
                      ? "bg-highlight text-highlight-foreground"
                      : "bg-success/10 text-success",
                  )}
                >
                  Best fit for {packages.teamFit.find((item) => item.id === team)?.label}
                </p>
              ) : (
                <span className="mt-2 block h-[18px]" aria-hidden="true" />
              )}

              <p
                className={cn(
                  "mt-5 border-t pt-4 text-xs",
                  plan.popular
                    ? "border-primary-foreground/20 text-primary-foreground/70 dark:border-border dark:text-foreground/70"
                    : "border-border text-muted-foreground",
                )}
              >
                from
              </p>
              <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">
                ${plan.price.toLocaleString("en-US")}
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

              <ul className="mt-4 space-y-1.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs">
                    <BadgeCheck
                      className={cn(
                        "mt-0.5 size-3.5 shrink-0",
                        plan.popular
                          ? "text-highlight"
                          : "text-success",
                      )}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-5">
                <div
                  className={cn(
                    "mb-3 flex gap-1",
                    plan.popular
                      ? "text-primary-foreground/30 dark:text-foreground/30"
                      : "text-muted-foreground/25",
                  )}
                  aria-hidden="true"
                >
                  {Array.from({ length: 8 }, (_, index) => (
                    <span
                      key={index}
                      className={cn(
                        "h-1 flex-1 rounded-full",
                        index < plan.modules
                          ? plan.popular
                            ? "bg-highlight"
                            : "bg-primary"
                          : "bg-current",
                      )}
                    />
                  ))}
                </div>
                <ButtonLink
                  href="/start"
                  variant="outline"
                  className={
                    plan.popular
                      ? "border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 dark:border-foreground/40 dark:text-foreground dark:hover:bg-foreground/10"
                      : undefined
                  }
                >
                  Start with {plan.name}
                </ButtonLink>
              </div>
            </div>
          );
        })}
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

      <div className="mt-4 rounded-lg border border-border bg-card p-6">
        <h3 className="text-sm font-semibold">{packages.everyPackage.title}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.everyPackage.items.map((item) => {
            const Icon = ICONS[item.id];
            return (
              <div key={item.id} className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{packages.context}</p>
    </Section>
  );
}
