"use client";

import { motion } from "motion/react";
import { aboutTimeline } from "@/content/about";
import { Section } from "@/components/shared/Section";
import { useInViewLoop, useLoopStep } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Four stages on a rail, with one highlighted node stepping through. */
export function TimelineSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;
  const step = useLoopStep(aboutTimeline.stages.length, {
    active: alive,
    intervalMs: 2800,
  });

  return (
    <Section id="timeline" className="scroll-mt-24">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {aboutTimeline.title}
          </h2>
        </div>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg lg:col-span-5">
          {aboutTimeline.intro}
        </p>
      </div>

      <div ref={ref} className="relative mt-10">
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[7px] border-l border-dashed border-border sm:top-[7px] sm:right-0 sm:bottom-auto sm:left-0 sm:border-t sm:border-l-0"
        />

        <ol className="grid gap-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {aboutTimeline.stages.map((stage, index) => {
            const active = !reduceMotion && index === step;
            return (
              <li key={stage.id} className="relative pl-8 sm:pt-9 sm:pl-0">
                <motion.span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1 left-0 size-3.5 rounded-full border-2 sm:top-0",
                    active
                      ? "border-primary bg-primary"
                      : "border-border bg-background",
                  )}
                  animate={active ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />

                <p className="font-mono text-[10px] text-muted-foreground">
                  {stage.label}
                </p>
                <h3
                  className={cn(
                    "mt-1.5 text-lg font-semibold transition-colors",
                    active ? "text-foreground" : "text-foreground/80",
                  )}
                >
                  {stage.title}
                </h3>
                <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                  {stage.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
