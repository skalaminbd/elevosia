"use client";

import { useEffect, useState } from "react";
import { pricingHero } from "@/content/pricing-page";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function PriceTag({ alive }: { alive: boolean }) {
  const [free, setFree] = useState(false);

  useEffect(() => {
    if (!alive) return;
    const timer = window.setInterval(() => setFree((value) => !value), 3200);
    return () => window.clearInterval(timer);
  }, [alive]);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md">
      <p className="text-xs text-muted-foreground">Your Blueprint</p>

      <div className="relative mt-2 h-12">
        <span
          className={cn(
            "absolute inset-0 flex items-center font-heading text-4xl font-bold text-foreground transition-opacity duration-300",
            free ? "opacity-0" : "opacity-100",
          )}
        >
          <span className="relative">
            {pricingHero.struck}
            <span
              aria-hidden="true"
              className="absolute top-[54%] left-0 h-[3px] w-full rounded-full bg-foreground"
            />
          </span>
        </span>

        <span
          className={cn(
            "absolute inset-0 flex items-center font-heading text-4xl font-bold text-primary transition-opacity duration-300",
            free ? "opacity-100" : "opacity-0",
          )}
        >
          {pricingHero.free}
        </span>
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        Fixed price, in 5 business days
      </p>

      <ul className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
        <li>Milestones, timeline and price</li>
        <li className="mt-1">No card, no commitment</li>
      </ul>
    </div>
  );
}

export function PricingHero() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const alive = inView && !reduceMotion;

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
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
          </div>

          <div ref={ref} className="lg:col-span-5">
            <PriceTag alive={alive} />
          </div>
        </div>
      </div>
    </section>
  );
}
