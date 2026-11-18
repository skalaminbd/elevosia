"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { pricingHero } from "@/content/pricing-page";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function BlueprintTicket({ alive }: { alive: boolean }) {
  const [free, setFree] = useState(false);

  useEffect(() => {
    if (!alive) return;
    const first = window.setTimeout(() => setFree(true), 1200);
    const timer = window.setInterval(() => setFree((value) => !value), 3400);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [alive]);

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        aria-hidden="true"
        className="absolute inset-x-5 -top-3 -bottom-3 rotate-2 rounded-xl border border-border bg-secondary/70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-8 -top-6 -bottom-6 -rotate-1 rounded-xl border border-border/70 bg-secondary/40"
      />

      <div className="relative rounded-xl border border-border bg-card p-6 shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            Your Blueprint
          </p>
          <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-medium text-success">
            No card needed
          </span>
        </div>

        <div className="relative mt-3 h-14 overflow-hidden">
          <span
            className={cn(
              "absolute inset-0 flex items-center font-heading text-4xl font-bold text-foreground transition-all duration-300",
              free ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100",
            )}
          >
            <span className="relative">
              {pricingHero.struck}
              <span
                aria-hidden="true"
                className="absolute top-[54%] left-0 h-[3px] w-full -rotate-2 rounded-full bg-foreground"
              />
            </span>
          </span>

          <span
            className={cn(
              "absolute inset-0 flex items-center font-heading text-5xl font-bold text-primary transition-all duration-300",
              free ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            {pricingHero.free}
          </span>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Fixed price, in 5 business days
        </p>

        <div className="mt-5 flex gap-1.5">
          {DAYS.map((day, index) => (
            <div
              key={day}
              className="flex-1 rounded-md border border-border bg-background px-1 py-2 text-center"
            >
              <p className="text-[9px] text-muted-foreground">{day}</p>
              <motion.span
                className="mx-auto mt-1.5 flex size-4 items-center justify-center rounded-full bg-primary/10 text-primary"
                animate={
                  alive
                    ? { opacity: [0.25, 0.25, 1, 1, 0.25] }
                    : { opacity: 1 }
                }
                transition={{
                  duration: 4.2,
                  times: [0, index * 0.13 + 0.08, index * 0.13 + 0.2, 0.9, 1],
                  repeat: Infinity,
                }}
              >
                <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
              </motion.span>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <Check className="size-3.5 text-success" aria-hidden="true" />
            Milestones, tasks, timeline and price
          </p>
          <p className="flex items-center gap-2">
            <Check className="size-3.5 text-success" aria-hidden="true" />
            Yours to keep, whether you build or not
          </p>
        </div>
      </div>
    </div>
  );
}

export function PricingHero() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const alive = inView && !reduceMotion;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-1/3 -right-24 hidden size-72 rounded-full bg-highlight/15 blur-3xl lg:block" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>{pricingHero.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {pricingHero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {pricingHero.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={pricingHero.primary.href}>
                {pricingHero.primary.label}
              </ButtonLink>
              <ButtonLink href={pricingHero.secondary.href} variant="outline">
                {pricingHero.secondary.label}
              </ButtonLink>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Fixed price before we build · No per-user fees · Payment plans
              available
            </p>
          </div>

          <div ref={ref} className="lg:col-span-5">
            <BlueprintTicket alive={alive} />
          </div>
        </div>
      </div>
    </section>
  );
}
