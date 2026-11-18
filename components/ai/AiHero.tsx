"use client";

import { AnimatePresence, motion } from "motion/react";
import { aiHero } from "@/content/ai-automation";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useInViewLoop, useLoopStep } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const TONE: Record<string, string> = {
  success: "bg-success",
  info: "bg-info",
  primary: "bg-primary",
  warning: "bg-warning",
};

/**
 * Split hero with a Safari-style window. The action feed rolls while it is on
 * screen; reduced motion shows the first four actions as a static list.
 */
export function AiHero() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;
  const step = useLoopStep(aiHero.actions.length, {
    active: alive,
    intervalMs: 2200,
  });

  const loop = [...aiHero.actions, ...aiHero.actions];
  const rows = Array.from({ length: 3 }, (_, index) => {
    const key = step + index;
    return { ...loop[(key + aiHero.actions.length) % loop.length], key };
  });

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow>{aiHero.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {aiHero.title}
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
              {aiHero.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={aiHero.primary.href}>
                {aiHero.primary.label}
              </ButtonLink>
              <ButtonLink href={aiHero.secondary.href} variant="outline">
                {aiHero.secondary.label}
              </ButtonLink>
            </div>
          </div>

          <div ref={ref} className="lg:col-span-6">
            <div className="mx-auto w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-md">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="size-2 rounded-full bg-destructive/40" />
                <span className="size-2 rounded-full bg-warning/50" />
                <span className="size-2 rounded-full bg-success/50" />
                <span className="ml-2 flex-1 truncate rounded-full bg-muted px-3 py-1 text-center font-mono text-[10px] text-muted-foreground">
                  app.elevosia.com/today
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["Hours saved", "6.2"],
                    ["Tasks handled", "14"],
                    ["Awaiting you", "2"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-md border border-border bg-background px-2.5 py-2"
                    >
                      <p className="text-[9px] text-muted-foreground">{label}</p>
                      <p className="mt-0.5 font-mono text-base font-semibold tabular-nums">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-semibold">Handled this morning</p>
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-success" />
                    live
                  </span>
                </div>

                <ul className="relative mt-3 flex h-[126px] flex-col gap-2 overflow-hidden">
                  <AnimatePresence initial={false} mode="popLayout">
                    {rows.map((row) => (
                      <motion.li
                        key={row.key}
                        layout
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2.5"
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span
                            className={`size-1.5 shrink-0 rounded-full ${TONE[row.tone] ?? "bg-primary"}`}
                          />
                          <span className="truncate text-xs font-medium">
                            {row.label}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                          {row.meta}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
                  <span>From 6:02 am · nobody at a keyboard</span>
                  <span className="font-mono">Sample data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
