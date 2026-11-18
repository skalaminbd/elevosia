"use client";

import { motion } from "motion/react";
import { webPath } from "@/content/website-projects";
import { Section } from "@/components/shared/Section";
import { useInViewLoop, useLoopStep } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Today → Next → Later, with the active stage stepping through in a loop. */
export function PathSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;
  const step = useLoopStep(webPath.stages.length, {
    active: alive,
    intervalMs: 2600,
  });

  return (
    <Section>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {webPath.title}
          </h2>
        </div>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg lg:col-span-5">
          {webPath.intro}
        </p>
      </div>

      <div ref={ref} className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-6">
        {webPath.stages.map((stage, index) => {
          const active = !reduceMotion && index === step;
          return (
            <div
              key={stage.id}
              className={`relative rounded-lg border bg-card p-6 transition-colors duration-300 ${
                active ? "border-primary/40" : "border-border"
              }`}
            >
              {index < webPath.stages.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-9 -right-[26px] hidden h-px w-6 border-t border-dashed border-border md:block"
                />
              ) : null}

              <div className="flex items-center gap-3">
                <motion.span
                  className={`flex size-3 rounded-full ${
                    active ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  animate={active ? { scale: [1, 1.35, 1] } : undefined}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
                <span className="font-mono text-xs text-muted-foreground">
                  {stage.label}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold">{stage.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{stage.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
