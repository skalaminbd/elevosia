"use client";

import { motion } from "motion/react";
import { rollout } from "@/content/ai-automation";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Four rollout steps, each with a ring that fills 25 / 50 / 75 / 100. */
export function RolloutSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {rollout.title}
          </h2>
        </div>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg lg:col-span-5">
          {rollout.intro}
        </p>
      </div>

      <div ref={ref} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {rollout.steps.map((step, index) => {
          const value = 25 * (index + 1);
          const offset = CIRCUMFERENCE * (1 - value / 100);

          return (
            <div
              key={step.id}
              className="flex flex-col rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <div className="relative size-14">
                  <svg viewBox="0 0 56 56" className="size-14 -rotate-90" aria-hidden="true">
                    <circle
                      cx="28"
                      cy="28"
                      r={RADIUS}
                      fill="none"
                      stroke="var(--color-secondary)"
                      strokeWidth="3"
                    />
                    <motion.circle
                      cx="28"
                      cy="28"
                      r={RADIUS}
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      initial={{ strokeDashoffset: alive ? CIRCUMFERENCE : offset }}
                      animate={
                        alive
                          ? { strokeDashoffset: [CIRCUMFERENCE, offset, offset] }
                          : { strokeDashoffset: offset }
                      }
                      transition={
                        alive
                          ? {
                              duration: 3.2,
                              times: [0, 0.55, 1],
                              repeat: Infinity,
                              repeatDelay: 0.8,
                              delay: index * 0.35,
                              ease: "easeInOut",
                            }
                          : undefined
                      }
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold tabular-nums">
                    {value}%
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold">{step.label}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
