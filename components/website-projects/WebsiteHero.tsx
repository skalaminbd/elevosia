"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { webHero } from "@/content/website-projects";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Split hero. A website card sends a submission along a beam into a dashboard
 * card; the beam flows while the section is on screen.
 */
export function WebsiteHero() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow>{webHero.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {webHero.title}
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
              {webHero.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={webHero.primary.href}>
                {webHero.primary.label}
              </ButtonLink>
              <ButtonLink href={webHero.secondary.href} variant="outline">
                {webHero.secondary.label}
              </ButtonLink>
            </div>
          </div>

          <div ref={ref} className="lg:col-span-6">
            <div className="relative mx-auto w-full max-w-md">
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <span className="size-2 rounded-full bg-destructive/40" />
                  <span className="size-2 rounded-full bg-warning/50" />
                  <span className="size-2 rounded-full bg-success/50" />
                  <span className="ml-2 flex-1 truncate rounded-full bg-muted px-3 py-1 text-center font-mono text-[10px] text-muted-foreground">
                    smithroofing.com
                  </span>
                </div>
                <div className="mt-4 rounded-md bg-secondary/60 p-3">
                  <p className="text-xs font-semibold">Get a roof quote</p>
                  <div className="mt-2 space-y-1.5">
                    <span className="block h-5 rounded-sm border border-border bg-card" />
                    <span className="block h-5 rounded-sm border border-border bg-card" />
                  </div>
                </div>
              </div>

              <svg
                viewBox="0 0 260 64"
                className="mx-4 my-1 h-14 w-[calc(100%-2rem)]"
                aria-hidden="true"
              >
                <path
                  d="M8 6 C 60 58, 200 58, 252 6"
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="1.5"
                  strokeDasharray="4 7"
                />
                {alive ? (
                  <circle r="3.5" fill="var(--color-primary)">
                    <animateMotion
                      dur="2.6s"
                      repeatCount="indefinite"
                      path="M8 6 C 60 58, 200 58, 252 6"
                    />
                  </circle>
                ) : (
                  <circle cx="130" cy="40" r="3.5" fill="var(--color-primary)" />
                )}
              </svg>

              <motion.div
                className="ml-auto w-[85%] rounded-lg border border-border bg-card p-4 shadow-sm"
                animate={alive ? { y: [0, -4, 0] } : undefined}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">New enquiry</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    just now
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Roof repair, next week · high intent
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                    Scored
                  </span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    Booked
                  </span>
                  <Check className="ml-auto size-3.5 text-success" aria-hidden="true" />
                </div>
              </motion.div>

              <ArrowUpRight
                className="absolute -right-1 -bottom-1 size-5 text-highlight"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
