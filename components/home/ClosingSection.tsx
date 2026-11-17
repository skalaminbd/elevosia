"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Coffee } from "lucide-react";
import { motion } from "motion/react";
import { closing } from "@/content/home";
import { Reveal } from "@/components/home/Reveal";
import { BorderBeam } from "@/components/ui/border-beam";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useInViewLoop, useLoopStep } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE } from "@/lib/motion";

// WebGL grid: client only, and only mounted while the section is on screen.
const RetroGrid = dynamic(
  () => import("@/components/ui/retro-grid").then((mod) => mod.RetroGrid),
  { ssr: false },
);

export function ClosingSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const cycle = useLoopStep(2, {
    active: inView && !reduceMotion,
    intervalMs: 9000,
  });

  return (
    <section
      id="next-monday"
      className="relative overflow-hidden bg-primary py-15 text-primary-foreground md:py-20 lg:py-25 dark:bg-secondary dark:text-foreground"
    >
      {inView && !reduceMotion ? (
        <RetroGrid
          aria-hidden="true"
          className="[&>div:last-child]:hidden"
          angle={70}
          cellSize={70}
          opacity={0.12}
          lightLineColor="var(--highlight)"
          darkLineColor="var(--highlight)"
        />
      ) : null}

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div ref={ref} className="lg:col-span-5">
            <Reveal>
              <h2 className="font-heading text-4xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl">
                {closing.title}
              </h2>
            </Reveal>

            <Reveal delay={0.07}>
              <p className="mt-5 text-base text-primary-foreground/80 dark:text-foreground/80">
                {closing.body}
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="relative rounded-lg">
                  {!reduceMotion ? (
                    <BorderBeam
                      size={70}
                      duration={7}
                      borderWidth={1.5}
                      colorFrom="var(--white)"
                      colorTo="var(--highlight)"
                    />
                  ) : null}
                  <ButtonLink href={closing.primary.href} variant="highlight">
                    {closing.primary.label}
                  </ButtonLink>
                </div>

                <ButtonLink
                  href={closing.secondary.href}
                  variant="outline"
                  className="text-foreground"
                >
                  {closing.secondary.label}
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <Link
                href={closing.checklist.href}
                className="mt-5 inline-flex text-sm font-medium text-primary-foreground/80 underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:text-foreground/80"
              >
                {closing.checklist.label}
              </Link>
            </Reveal>
          </div>

          {/* The Monday morning screen */}
          <div className="lg:col-span-7">
            <Reveal delay={0.12}>
              <div
                aria-hidden="true"
                className="relative overflow-hidden rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-5 shadow-md dark:border-border dark:bg-card"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-primary-foreground/70 dark:text-muted-foreground">
                      {closing.day}
                    </p>
                    <p className="mt-1 font-mono text-4xl font-semibold">
                      {closing.clock}
                    </p>
                  </div>

                  <div className="relative flex size-10 items-center justify-center rounded-full bg-primary-foreground/10 dark:bg-muted">
                    {!reduceMotion ? (
                      <span className="absolute -top-2 left-1/2 flex -translate-x-1/2 gap-0.5">
                        {[0, 1].map((index) => (
                          <motion.span
                            key={index}
                            className="block h-2 w-px rounded-full bg-primary-foreground/60 dark:bg-foreground/60"
                            animate={{ y: [0, -4], opacity: [0.1, 0.8, 0] }}
                            transition={{
                              duration: 2.6,
                              repeat: Infinity,
                              delay: index * 0.5,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </span>
                    ) : null}
                    <Coffee className="size-4" />
                  </div>
                </div>

                <div key={cycle} className="mt-5 grid grid-cols-2 gap-3">
                  {closing.widgets.map((widget, index) => (
                    <motion.div
                      key={widget.id}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: reduceMotion ? 0 : 0.15 + index * 0.3,
                        ease: EASE,
                      }}
                      className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-4 dark:border-border dark:bg-background/40"
                    >
                      <p className="text-xs font-medium text-primary-foreground/70 dark:text-muted-foreground">
                        {widget.label}
                      </p>
                      <p className="mt-1 font-mono text-2xl font-semibold">
                        {widget.prefix}
                        {reduceMotion ? (
                          <span className="tabular-nums">
                            {new Intl.NumberFormat("en-US").format(widget.value)}
                          </span>
                        ) : (
                          <NumberTicker
                            value={widget.value}
                            delay={0.2 + index * 0.3}
                          />
                        )}
                        {widget.suffix}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
