"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { founding } from "@/content/work";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Section } from "@/components/shared/Section";
import { BorderBeam } from "@/components/ui/border-beam";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Dark band. Five founding seats pulsing softly inside one card. */
export function FoundingSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section
      id="founding-clients"
      className="scroll-mt-24 bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground"
    >
      <div ref={ref} className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {founding.title}
          </h2>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 dark:text-foreground/80">
            {founding.body}
          </p>

          <ul className="mt-6 space-y-2">
            {founding.perks.map((perk) => (
              <li
                key={perk}
                className="flex items-start gap-2 text-sm text-primary-foreground/75 dark:text-foreground/75"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-highlight"
                  aria-hidden="true"
                />
                {perk}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ButtonLink
              href={founding.cta.href}
              className="bg-background text-foreground hover:bg-background/90"
            >
              {founding.cta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card p-6 text-foreground shadow-md">
            <BorderBeam
              size={60}
              duration={9}
              borderWidth={1.5}
              colorFrom="var(--primary)"
              colorTo="var(--success)"
            />

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Founding seats</span>
              <span className="font-mono text-xs text-muted-foreground">
                {founding.seats} open
              </span>
            </div>

            <div className="mt-6 flex items-center justify-between gap-2">
              {Array.from({ length: founding.seats }, (_, index) => (
                <motion.span
                  key={index}
                  className="relative flex aspect-square w-full max-w-12 items-center justify-center rounded-full border border-dashed border-muted-foreground/40"
                  animate={
                    alive
                      ? { opacity: [0.4, 1, 0.4] }
                      : undefined
                  }
                  transition={{
                    duration: 3.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.35,
                  }}
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </span>
                </motion.span>
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Founding price</span>
                <span className="font-mono font-semibold">Locked</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Weekly call with</span>
                <span className="font-semibold">The founder</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">In return</span>
                <span className="font-semibold">An honest case study</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
