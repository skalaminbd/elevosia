"use client";

import { motion } from "motion/react";
import { workProcess } from "@/content/work";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Section } from "@/components/shared/Section";
import { useInViewLoop, useLoopStep } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const SAMPLE = { label: "Read the sample weekly board", href: "/how-it-works#weekly-board" };

/**
 * Four steps with one moving top bar. The bar is the section's single live
 * item; reduced motion parks it on the first card.
 */
export function ProcessSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;
  const step = useLoopStep(workProcess.steps.length, {
    active: alive,
    intervalMs: 2600,
  });

  return (
    <Section id="process" className="scroll-mt-24">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {workProcess.title}
          </h2>
        </div>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg lg:col-span-5">
          {workProcess.intro}
        </p>
      </div>

      <div ref={ref} className="mt-10">
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {workProcess.steps.map((item, index) => {
            const active = !reduceMotion && index === step;
            return (
              <li
                key={item.id}
                className={cn(
                  "relative overflow-hidden rounded-lg border bg-card p-5",
                  active ? "border-primary/30" : "border-border",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="work-process-bar"
                    className="absolute inset-x-0 top-0 h-0.5 bg-primary"
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                ) : null}

                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full font-mono text-[10px] font-semibold transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {item.meta}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold">{item.label}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card px-5 py-4">
          <p className="text-sm text-muted-foreground">
            Every step is visible on your weekly board, including the boring
            ones.
          </p>
          <ButtonLink href={SAMPLE.href} variant="outline" size="sm">
            {SAMPLE.label}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
