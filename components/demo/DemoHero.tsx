"use client";

import { motion } from "motion/react";
import { CalendarDays, Check, Sparkles } from "lucide-react";
import { demoHero } from "@/content/demo";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Split hero with a mini schedule preview and a cursor that auto-fills a
 * shift, on a loop. Reduced motion shows the filled state, still.
 */
export function DemoHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 pb-14 sm:px-6 md:pt-20 md:pb-16 lg:px-8 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow>{demoHero.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {demoHero.title}
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
              {demoHero.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={demoHero.cta.href}>
                {demoHero.cta.label}
              </ButtonLink>
              <ButtonLink href="#demo" variant="outline">
                Try it below
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative mx-auto w-full max-w-md rounded-xl border border-border bg-card p-4 shadow-md">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-md bg-primary font-heading text-[9px] font-bold text-primary-foreground">
                    B
                  </span>
                  <span className="text-[11px] font-semibold">Schedule</span>
                </div>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] text-muted-foreground">
                  Sample
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                {[
                  { time: "9:00 am", client: "M. Okafor", who: "Nora P.", open: false },
                  { time: "10:00 am", client: "T. Brooks", who: "Ava M.", open: true },
                  { time: "2:00 pm", client: "A. Rivera", who: "Sam K.", open: false },
                ].map((row) => {
                  const showFilled = reduceMotion ? row.open : false;
                  return (
                    <div
                      key={row.time}
                      className="flex items-center gap-2.5 rounded-md border border-border bg-background px-2.5 py-2"
                    >
                      <span className="w-12 shrink-0 font-mono text-[9px] text-muted-foreground">
                        {row.time}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[10px] font-medium">
                        {row.client}
                      </span>
                      {row.open ? (
                        <motion.span
                          className="flex items-center gap-1"
                          animate={
                            reduceMotion
                              ? undefined
                              : {
                                  opacity: [0.35, 0.35, 1, 1, 0.35],
                                }
                          }
                          transition={{
                            duration: 6,
                            times: [0, 0.55, 0.66, 0.9, 1],
                            repeat: Infinity,
                          }}
                        >
                          <span className="flex size-4 items-center justify-center rounded-full bg-primary/10 font-mono text-[7px] font-semibold text-primary">
                            {showFilled ? "AM" : "—"}
                          </span>
                          <span className="text-[9px] text-muted-foreground">
                            {showFilled ? "Ava M." : "Open"}
                          </span>
                        </motion.span>
                      ) : (
                        <span className="text-[9px] text-muted-foreground">
                          {row.who}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                  <Sparkles className="size-3 text-primary" aria-hidden="true" />
                  AI matching
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[9px] font-medium text-primary-foreground">
                  <Check className="size-2.5" aria-hidden="true" />
                  Auto-fill
                </span>
              </div>

              {!reduceMotion ? (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute z-20 text-foreground"
                  animate={{
                    left: ["16%", "58%", "58%", "58%", "16%"],
                    top: ["70%", "62%", "62%", "62%", "70%"],
                    scale: [1, 1, 0.8, 1, 1],
                  }}
                  transition={{
                    duration: 6,
                    times: [0, 0.45, 0.55, 0.65, 1],
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4 fill-foreground drop-shadow-sm"
                    aria-hidden="true"
                  >
                    <path d="M5 3l14 7-6 1.5L10 18z" />
                  </svg>
                  <motion.span
                    className="absolute -top-1 -left-1 size-6 rounded-full border border-primary/50"
                    animate={{ scale: [0.4, 1.6], opacity: [0.8, 0] }}
                    transition={{
                      duration: 0.7,
                      times: [0, 1],
                      repeat: Infinity,
                      repeatDelay: 5.3,
                      delay: 2.5,
                    }}
                  />
                </motion.span>
              ) : null}

              <p className="mt-3 border-t border-border pt-2.5 text-[9px] text-muted-foreground">
                <CalendarDays className="mr-1 inline size-2.5" aria-hidden="true" />
                {demoHero.sampleLabel}
              </p>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              The real demo is below. Nothing here is saved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
