"use client";

import { motion } from "motion/react";
import { Check, Unlink, Wrench } from "lucide-react";
import { workHero } from "@/content/work";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useInViewLoop, useLoopStep } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ICONS = [Unlink, Wrench, Check];

/**
 * Split hero with the three-part story strip. The active step cycles while the
 * section is on screen.
 */
export function WorkHero() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;
  const step = useLoopStep(workHero.steps.length, {
    active: alive,
    intervalMs: 2400,
  });

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>{workHero.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {workHero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {workHero.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={workHero.primary.href}>
                {workHero.primary.label}
              </ButtonLink>
              <ButtonLink href={workHero.secondary.href} variant="outline">
                {workHero.secondary.label}
              </ButtonLink>
            </div>
          </div>

          <div ref={ref} className="lg:col-span-5">
            <ol className="mx-auto w-full max-w-sm">
              {workHero.steps.map((item, index) => {
                const Icon = ICONS[index];
                const active = !reduceMotion && index === step;

                return (
                  <li key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
                    {index < workHero.steps.length - 1 ? (
                      <span
                        className="absolute top-11 left-5 h-[calc(100%-2.75rem)] border-l border-dashed border-border"
                        aria-hidden="true"
                      />
                    ) : null}

                    <motion.span
                      className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                      animate={
                        active ? { scale: [1, 1.08, 1] } : undefined
                      }
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </motion.span>

                    <div className="pt-1.5">
                      <p
                        className={`text-sm font-semibold ${
                          active ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.meta}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
