"use client";

import { experience } from "@/content/about";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export function ExperienceSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const running = inView && !reduceMotion;

  return (
    <Section id="experience">
      <div className="max-w-3xl">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {experience.title}
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          {experience.body}
        </p>
      </div>

      {/* The sectors drift; the list below keeps them readable for screen readers */}
      <div
        ref={ref}
        aria-hidden="true"
        className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <div
          className={cn(
            "marquee-track flex w-max gap-3",
            !running && "who-pause",
          )}
        >
          {[...experience.sectors, ...experience.sectors].map((sector, index) => (
            <span
              key={`${sector}-${index}`}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium whitespace-nowrap text-foreground shadow-sm"
            >
              {sector}
            </span>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {experience.sectors.map((sector) => (
          <li key={sector}>{sector}</li>
        ))}
      </ul>
    </Section>
  );
}
