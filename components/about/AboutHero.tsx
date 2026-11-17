"use client";

import { aboutHero, heroLead } from "@/content/about";
import { BrowserFlip } from "@/components/about/items/BrowserFlip";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The shared page hero: full-bleed brand band, centred display headline, lead
 * line, and the live visual below.
 */
export function AboutHero() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div
        aria-hidden="true"
        className="line-grid pointer-events-none absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow tone="inverse">{aboutHero.eyebrow}</Eyebrow>
          <h1 className="mt-6 font-heading text-[clamp(2.5rem,5.6vw,5rem)] leading-[0.96] font-bold tracking-[-0.04em] text-balance">
            {aboutHero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-primary-foreground/75 sm:text-lg dark:text-foreground/75">
            {heroLead}
          </p>
        </div>

        <div ref={ref} className="relative mt-14 lg:mt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 top-0 h-40 bg-highlight/20 blur-3xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <BrowserFlip
              active={inView && !reduceMotion}
              reduceMotion={reduceMotion}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
