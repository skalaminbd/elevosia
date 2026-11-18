"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { hiddenCosts } from "@/content/why-custom";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ROWS = [
  { label: "Seats, base plan", value: "$2,400", note: "per month" },
  { label: "New seat", value: "+$45", note: "per month" },
  { label: "Yearly increase", value: "+$168", note: "per month" },
  { label: "AI add-on", value: "+$29", note: "per month" },
  { label: "Workaround time", value: "+7 hrs", note: "per week" },
];

const BASE = 2400;

/**
 * Dark band. The bill grows row by row and loops while the section is on
 * screen; it resets off screen and under reduced motion it shows the final
 * state.
 */
export function CostsSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>();
  const live = inView && !reduceMotion;
  const [count, setCount] = useState(reduceMotion ? ROWS.length : 1);

  useEffect(() => {
    if (!live) return;

    const id = window.setTimeout(
      () => {
        setCount((current) =>
          current >= ROWS.length ? 1 : current + 1,
        );
      },
      count >= ROWS.length ? 2600 : 900,
    );

    return () => window.clearTimeout(id);
  }, [count, live]);

  const total = BASE + 45 + 168 + 29;

  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div ref={ref} className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {hiddenCosts.title}
          </h2>
          <p className="mt-4 max-w-lg text-base text-primary-foreground/80 dark:text-foreground/80">
            {hiddenCosts.body}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {hiddenCosts.cards.map((card) => (
              <div
                key={card.id}
                className="rounded-lg border border-primary-foreground/15 p-5 dark:border-border"
              >
                <h3 className="text-base font-semibold">{card.title}</h3>
                <p className="mt-1 text-sm text-primary-foreground/70 dark:text-foreground/70">
                  {card.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-primary-foreground/60 dark:text-foreground/60">
            {hiddenCosts.source}
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 text-foreground shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Your tools, year 2</span>
              <span className="font-mono text-xs text-muted-foreground">
                Sample data
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {ROWS.slice(0, count).map((row) => (
                <motion.div
                  key={row.label}
                  initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex items-center justify-between gap-4 border-b border-border pb-2 text-sm last:border-0"
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-mono tabular-nums">
                    {row.value}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {row.note}
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 flex items-end justify-between rounded-md bg-secondary px-4 py-3">
              <span className="text-xs font-medium text-muted-foreground">
                Monthly total
              </span>
              <AnimatedMoney value={count >= 2 ? total : BASE} />
            </div>

            <AnimatePresence>
              {count >= ROWS.length ? (
                <motion.p
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-2 text-xs text-destructive"
                >
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                  Plus 7 hours of your team&apos;s week, every week.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}

function AnimatedMoney({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const spring = useSpring(value, { damping: 32, stiffness: 180 });
  const [shown, setShown] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const stop = spring.on("change", (latest) =>
      setShown(Math.round(latest)),
    );
    return stop;
  }, [spring]);

  return (
    <span className="font-mono text-2xl font-semibold tabular-nums">
      ${reduceMotion ? value.toLocaleString("en-US") : shown.toLocaleString("en-US")}
      <span className="ml-1 text-xs font-normal text-muted-foreground">/mo</span>
    </span>
  );
}
