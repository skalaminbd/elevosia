"use client";

import { aboutClosing } from "@/content/about";
import { CalendarSlot } from "@/components/about/items/CalendarSlot";
import { Section } from "@/components/shared/Section";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function AboutClosing() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });

  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-4xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl">
            {aboutClosing.title}
          </h2>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 dark:text-foreground/80">
            {aboutClosing.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={aboutClosing.primary.href} variant="highlight">
              {aboutClosing.primary.label}
            </ButtonLink>
            <ButtonLink
              href={aboutClosing.secondary.href}
              variant="outline"
              className="text-foreground"
            >
              {aboutClosing.secondary.label}
            </ButtonLink>
          </div>
        </div>

        <div ref={ref} className="lg:col-span-5">
          <CalendarSlot
            active={inView && !reduceMotion}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>
    </Section>
  );
}
