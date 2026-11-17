"use client";

import { aboutHero } from "@/content/about";
import { BrowserFlip } from "@/components/about/items/BrowserFlip";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function AboutHero() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow>{aboutHero.eyebrow}</Eyebrow>
          <h1 className="mt-5 font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {aboutHero.title}
          </h1>
        </div>

        <div ref={ref} className="lg:col-span-5">
          <BrowserFlip
            active={inView && !reduceMotion}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>
    </Section>
  );
}
