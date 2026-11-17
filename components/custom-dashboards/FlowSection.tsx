"use client";

import { Globe, LayoutDashboard, Sparkles, UserRound } from "lucide-react";
import { flow } from "@/content/custom-dashboards";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const ICONS = {
  website: Globe,
  dashboard: LayoutDashboard,
  ai: Sparkles,
  portal: UserRound,
} as const;

type StepId = keyof typeof ICONS;

const isStepId = (value: string): value is StepId => value in ICONS;

/**
 * Website → dashboard → AI → portal: one chain, with the connection flowing.
 */
export function FlowSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="flow">
      <div ref={ref} className="max-w-3xl">
        <Eyebrow>Website + dashboard</Eyebrow>
        <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {flow.title}
        </h2>
        <p className="mt-4 text-base text-muted-foreground">{flow.body}</p>
      </div>

      <div className="relative mt-12">
        {/* The connector only needs to show between the cards */}
        <svg
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 hidden h-px w-full lg:block"
          viewBox="0 0 100 1"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="0.5"
            x2="100"
            y2="0.5"
            stroke="var(--color-muted-foreground)"
            strokeOpacity="0.45"
            strokeWidth="1"
            strokeDasharray="3 3"
            className={cn(alive && "animate-[about-beam_2400ms_linear_infinite]")}
          />
        </svg>

        <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {flow.steps.map((step, index) => {
            const Icon = isStepId(step.id) ? ICONS[step.id] : Globe;

            return (
              <li
                key={step.id}
                className="rounded-lg border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-4 text-base font-medium text-foreground">
                  {step.label}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
