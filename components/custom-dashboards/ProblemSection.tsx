"use client";

import { problem } from "@/content/custom-dashboards";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * The problem, told plainly: a gauge that fills to 60%, stalls, shakes and
 * resets. The four pains read as a ruled list, not cards.
 */
export function ProblemSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="problem">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow>The honest version</Eyebrow>
          <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {problem.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {problem.body}
          </p>
        </div>

        <div
          ref={ref}
          className={cn(
            "flex justify-center lg:col-span-5 lg:justify-end",
            alive && "animate-[cd-shake_4500ms_ease-in-out_infinite]",
          )}
        >
          <svg
            viewBox="0 0 120 120"
            className="size-52 sm:size-60"
            role="img"
            aria-label="Most tools cover about 60 percent of the job"
          >
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="6"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="6"
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
              y="59"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-foreground font-heading text-[28px] font-bold"
            >
              {problem.gaugeValue}%
            </text>
            <text
              x="60"
              y="80"
              textAnchor="middle"
              className="fill-muted-foreground text-[8px] tracking-[0.08em]"
            >
              {problem.gaugeLabel}
            </text>
          </svg>
        </div>
      </div>

      <ul className="mt-16 grid gap-x-16 sm:grid-cols-2">
        {problem.pains.map((pain, index) => (
          <li
            key={pain}
            className="flex items-baseline gap-5 border-t border-border py-6"
          >
            <span className="font-mono text-sm text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {pain}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
