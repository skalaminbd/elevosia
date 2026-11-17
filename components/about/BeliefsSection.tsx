"use client";

import { BadgeCheck, Eye, KeyRound, LifeBuoy } from "lucide-react";
import { beliefs } from "@/content/about";
import { Section } from "@/components/shared/Section";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { MagicCard } from "@/components/ui/magic-card";
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

export function BeliefsSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="beliefs">
      <div ref={ref}>
        <Eyebrow>What we believe</Eyebrow>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {beliefs.map((belief, index) => {
            const Icon = isBeliefId(belief.id) ? ICONS[belief.id] : BadgeCheck;

            return (
              <MagicCard key={belief.id} className="h-full rounded-lg">
                <div className="flex h-full flex-col p-6">
                  <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon
                      className={cn(
                        "size-5",
                        alive && "motion-safe:animate-pulse-soft",
                      )}
                      style={{ animationDelay: `${index * 0.35}s` }}
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-foreground">
                    {belief.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {belief.body}
                  </p>
                </div>
              </MagicCard>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
