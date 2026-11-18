"use client";

import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { nightStory } from "@/content/ai-automation";
import { Section } from "@/components/shared/Section";
import { useInViewLoop, useLoopStep } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The night-to-morning story. The clock steps through the timestamps and each
 * event lands as it does; the sky strip switches from night to morning on the
 * last step. Reduced motion shows the full sequence with the final clock.
 */
export function NightStory() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;
  const step = useLoopStep(nightStory.steps.length, {
    active: alive,
    intervalMs: 2600,
  });

  const current = reduceMotion
    ? nightStory.steps[nightStory.steps.length - 1]
    : nightStory.steps[step];
  const morning = current.phase === "morning";

  return (
    <Section className="bg-secondary/50 dark:bg-card">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {nightStory.title}
          </h2>
        </div>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg lg:col-span-5">
          {nightStory.intro}
        </p>
      </div>

      <div ref={ref} className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between bg-primary px-6 py-4 text-primary-foreground">
              <div className="flex items-center gap-2.5">
                {morning ? (
                  <motion.span
                    key="sun"
                    initial={reduceMotion ? false : { rotate: -30, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Sun className="size-5 text-highlight" aria-hidden="true" />
                  </motion.span>
                ) : (
                  <Moon className="size-5 text-highlight" aria-hidden="true" />
                )}
                <span className="text-sm font-medium">
                  {morning ? "Morning" : "Night"}
                </span>
              </div>
              <span className="font-mono text-xs text-primary-foreground/60">
                {morning ? "Tue" : "Mon"}
              </span>
            </div>

            <div className="px-6 py-8">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Local time
              </p>
              <p className="mt-2 font-mono text-[clamp(2.5rem,6vw,3.5rem)] leading-none font-semibold tabular-nums">
                {current.time.replace(" am", "").replace(" pm", "")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {morning ? "Before you open" : "Overnight, nobody at a keyboard"}
              </p>

              <div className="mt-8 flex items-center gap-2">
                {nightStory.steps.map((event, index) => (
                  <span
                    key={event.time + event.title}
                    className={`h-1 flex-1 rounded-full ${
                      reduceMotion || index <= step
                        ? "bg-primary"
                        : "bg-secondary"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {reduceMotion
                  ? "All five events, start to finish."
                  : `Event ${step + 1} of ${nightStory.steps.length}`}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul className="flex flex-col gap-2">
            {nightStory.steps.map((event, index) => {
              const future = !reduceMotion && index > step;
              return (
                <motion.li
                  key={event.time + event.title}
                  initial={false}
                  animate={{ opacity: future ? 0 : 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  aria-hidden={future}
                  className={`flex gap-4 rounded-md border px-4 py-3 ${
                    !reduceMotion && index === step
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <span className="w-16 shrink-0 pt-0.5 font-mono text-xs text-muted-foreground">
                    {event.time}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">
                      {event.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {event.body}
                    </span>
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
