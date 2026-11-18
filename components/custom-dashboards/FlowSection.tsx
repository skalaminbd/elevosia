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
 * Website → dashboard → AI → portal, as a rail with four stations.
 */
export function FlowSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="flow">
      <div ref={ref} className="max-w-2xl">
        <Eyebrow>Website + dashboard</Eyebrow>
        <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
          {flow.title}
        </h2>
        <p className="mt-5 text-base text-muted-foreground sm:text-lg">
          {flow.body}
        </p>
      </div>

      <div className="relative mt-16">
        <svg
          aria-hidden="true"
          className="absolute inset-x-0 top-0 hidden h-px w-full lg:block"
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
            strokeDasharray="2 2"
            className={cn(alive && "animate-[about-beam_2400ms_linear_infinite]")}
          />
        </svg>

        <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {flow.steps.map((step, index) => {
            const Icon = isStepId(step.id) ? ICONS[step.id] : Globe;

            return (
              <li
                key={step.id}
                className="relative border-t border-border pt-6 lg:border-t-0 lg:pt-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-[-3px] left-0 hidden size-1.5 rounded-full bg-primary lg:block"
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                </div>
                <p className="mt-5 max-w-[16rem] font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
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
