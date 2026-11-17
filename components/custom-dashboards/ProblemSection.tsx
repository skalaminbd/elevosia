"use client";

import { FileWarning, Loader2, Moon, SearchX } from "lucide-react";
import { problem } from "@/content/custom-dashboards";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const ICONS = [FileWarning, Loader2, SearchX, Moon];

/**
 * The problem, told plainly: a gauge that fills to 60%, stalls, shakes and
 * resets — the section's one live item.
 */
export function ProblemSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="problem">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow>The honest version</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {problem.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground">
            {problem.body}
          </p>
        </div>

        <div ref={ref} className="lg:col-span-5">
          <div
            className={cn(
              "mx-auto flex max-w-xs flex-col items-center",
              alive && "animate-[cd-shake_4500ms_ease-in-out_infinite]",
            )}
          >
            <svg
              viewBox="0 0 120 120"
              className="size-44"
              role="img"
              aria-label="Most tools cover about 60 percent of the job"
            >
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="8"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={100}
                transform="rotate(-90 60 60)"
                className={cn(
                  alive && "animate-[cd-gauge_4500ms_ease-in-out_infinite]",
                )}
                style={{ strokeDashoffset: alive ? undefined : 40 }}
              />
              <text
                x="60"
                y="60"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground font-mono text-[26px] font-semibold"
              >
                {problem.gaugeValue}%
              </text>
              <text
                x="60"
                y="82"
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                {problem.gaugeLabel}
              </text>
            </svg>
          </div>
        </div>
      </div>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {problem.pains.map((pain, index) => {
          const Icon = ICONS[index] ?? FileWarning;

          return (
            <li
              key={pain}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <p className="mt-4 text-base font-medium text-foreground">
                {pain}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
