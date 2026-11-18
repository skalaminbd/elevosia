"use client";

import { integrations } from "@/content/custom-dashboards";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Integrations: a wall of tools, a few of them drifting so the panel feels alive.
 */
export function IntegrationsSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="integrations">
      <div ref={ref} className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="max-w-xl font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
          {integrations.title}
        </h2>
        <p className="max-w-md text-base text-muted-foreground">
          {integrations.body}
        </p>
      </div>

      <ul className="mt-10 flex flex-wrap gap-2.5 rounded-lg border border-border bg-card p-6 shadow-sm sm:gap-3 sm:p-8">
        {integrations.tools.map((tool, index) => (
          <li
            key={tool}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium",
              index % 3 === 0 || tool === "Any tool with an API"
                ? "border-primary/25 bg-accent text-accent-foreground"
                : "border-border bg-background text-foreground",
              alive &&
                (index % 3 === 0 || tool === "Any tool with an API") &&
                "animate-[cd-drift_5200ms_ease-in-out_infinite]",
            )}
            style={{ animationDelay: `${(index % 5) * 0.4}s` }}
          >
            {tool}
          </li>
        ))}
      </ul>
    </Section>
  );
}
