"use client";

import { Check } from "lucide-react";
import { included } from "@/content/custom-dashboards";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function Chip({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium whitespace-nowrap text-foreground shadow-sm">
      <Check className="size-3.5 shrink-0 text-success" aria-hidden="true" />
      {label}
    </span>
  );
}

/**
 * The basics are never extras: two rows of check chips drifting in opposite
 * directions.
 */
export function IncludedSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const running = inView && !reduceMotion;

  return (
    <Section className="border-y border-border">
      <div ref={ref}>
        <h2 className="max-w-3xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {included.title}
        </h2>

        <div
          aria-hidden="true"
          className="mt-10 flex flex-col gap-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          {[false, true].map((reverse) => (
            <div
              key={String(reverse)}
              className={cn(
                "marquee-track flex w-max gap-3",
                reverse && "[animation-direction:reverse]",
                !running && "who-pause",
              )}
            >
              {[...included.items, ...included.items].map((item, index) => (
                <Chip key={`${item}-${index}`} label={item} />
              ))}
            </div>
          ))}
        </div>

        <ul className="sr-only">
          {included.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
