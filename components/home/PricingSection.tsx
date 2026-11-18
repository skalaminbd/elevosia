"use client";

import { motion } from "motion/react";
import { pricing } from "@/content/home";
import { Reveal } from "@/components/home/Reveal";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE } from "@/lib/motion";

const TAG_TIMING: {
  duration: number;
  times: number[];
  repeat: number;
  ease: [number, number, number, number];
} = {
  duration: 4.4,
  times: [0, 0.12, 0.28, 0.74, 1],
  repeat: Infinity,
  ease: EASE,
};

function Price({
  value,
  reduceMotion,
}: {
  value: number;
  reduceMotion: boolean;
}) {
  return (
    <span className="font-mono tabular-nums">
      <span>$</span>
      {reduceMotion ? (
        new Intl.NumberFormat("en-US").format(value)
      ) : (
        <NumberTicker value={value} />
      )}
    </span>
  );
}

export function PricingSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section id="pricing" className="relative py-15 md:py-20 lg:py-25">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>{pricing.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.07}>
              <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
                {pricing.title}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.14}>
            <p className="text-sm text-muted-foreground">{pricing.note}</p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-14 lg:mt-16">
          {/* The one loop: a "per seat" tag that gets struck out and fades */}
          {inView && !reduceMotion ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 left-1/2 hidden -translate-x-1/2 lg:block"
            >
              <motion.span
                className="relative block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
                animate={{ opacity: [0, 0, 1, 1, 0], y: [4, 4, 0, 0, -3] }}
                transition={TAG_TIMING}
              >
                {pricing.seatTag}
                <motion.span
                  className="absolute top-1/2 right-2 left-2 h-px origin-left bg-foreground"
                  animate={{ scaleX: [0, 0, 1, 1, 1] }}
                  transition={TAG_TIMING}
                />
              </motion.span>
            </div>
          ) : null}

          {/* Four separate cards; the recommended one is inverted */}
          <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {pricing.plans.map((plan) =>
                plan.popular ? (
                  <div
                    key={plan.id}
                    className="relative flex flex-col justify-between gap-12 rounded-lg bg-primary px-6 py-8 text-primary-foreground shadow-md lg:px-8 lg:py-10"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-medium">{plan.name}</h3>
                      <span className="shrink-0 rounded-full border border-primary-foreground/40 px-2 py-0.5 text-xs font-medium">
                        {pricing.popularLabel}
                      </span>
                    </div>
                    <div className="border-t border-primary-foreground/20 pt-6">
                      <p className="text-xs text-primary-foreground/70">from</p>
                      <p className="mt-1 text-4xl font-semibold sm:text-5xl">
                        <Price value={plan.price} reduceMotion={reduceMotion} />
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={plan.id}
                    className="flex flex-col justify-between gap-12 rounded-lg border border-border bg-card px-6 py-8 shadow-sm lg:px-8 lg:py-10"
                  >
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {plan.name}
                    </h3>
                    <div className="border-t border-border pt-6">
                      <p className="text-xs text-muted-foreground">from</p>
                      <p className="mt-1 text-4xl font-semibold text-foreground">
                        <Price value={plan.price} reduceMotion={reduceMotion} />
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10">
            <ButtonLink href={pricing.cta.href} variant="outline">
              {pricing.cta.label}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
