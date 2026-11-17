"use client";

import { BadgeCheck, Eye, KeyRound, LifeBuoy } from "lucide-react";
import { beliefs, principlesLead, principlesTitle } from "@/content/about";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const ICONS = {
  honest: BadgeCheck,
  ownership: KeyRound,
  show: Eye,
  after: LifeBuoy,
} as const;

type BeliefId = keyof typeof ICONS;

const isBeliefId = (value: string): value is BeliefId => value in ICONS;

/**
 * The principles read as a manifesto, not four product cards.
 */
export function BeliefsSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="beliefs">
      <div ref={ref} className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Eyebrow>What we believe</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {principlesTitle}
          </h2>
          <p className="mt-4 max-w-xs text-base text-muted-foreground">
            {principlesLead}
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {beliefs.map((belief, index) => {
              const Icon = isBeliefId(belief.id) ? ICONS[belief.id] : BadgeCheck;

              return (
                <div key={belief.id} className="border-t border-border pt-5">
                  <Icon
                    className={cn(
                      "size-5 text-primary",
                      alive && "motion-safe:animate-pulse-soft",
                    )}
                    style={{ animationDelay: `${index * 0.35}s` }}
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                    {belief.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {belief.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
