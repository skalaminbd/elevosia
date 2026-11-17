"use client";

import { Check } from "lucide-react";
import { included } from "@/content/custom-dashboards";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function Chip({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full border border-highlight-foreground/25 px-4 py-2 text-sm font-medium whitespace-nowrap text-highlight-foreground">
      <Check className="size-3.5 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}

/**
 * The bold colour block of the page: the basics, on brand lime, drifting in two
 * directions.
 */
export function IncludedSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const running = inView && !reduceMotion;

  return (
    <Section className="bg-highlight text-highlight-foreground">
      <div ref={ref}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {included.title}
          </h2>
          <p className="max-w-xs text-sm text-highlight-foreground/75">
            Every build includes all of it. No add-ons, no per-seat maths.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="mt-12 flex flex-col gap-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
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
