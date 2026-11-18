"use client";

import { hiwClosing } from "@/content/how-it-works";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Closing band: the 15-minute first step, counting itself in. */
export function HiwClosing() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.25 });
  const alive = inView && !reduceMotion;

  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
            {hiwClosing.title}
          </h2>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 dark:text-foreground/80">
            {hiwClosing.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={hiwClosing.primary.href}
              className="bg-background text-foreground hover:bg-background/90"
            >
              {hiwClosing.primary.label}
            </ButtonLink>
            <ButtonLink
              href={hiwClosing.secondary.href}
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 dark:text-foreground dark:hover:bg-foreground/10"
            >
              {hiwClosing.secondary.label}
            </ButtonLink>
          </div>
        </div>

        <div ref={ref} className="lg:col-span-5">
          <div className="mx-auto flex max-w-xs flex-col items-center">
            <svg
              viewBox="0 0 120 120"
              className="size-40"
              role="img"
              aria-label="About 15 minutes to write down what you need"
            >
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--color-primary-foreground)"
                strokeOpacity="0.2"
                strokeWidth="6"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--color-highlight)"
                strokeWidth="6"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={100}
                transform="rotate(-90 60 60)"
                className={cn(
                  alive && "animate-[hiw-fill_5000ms_ease-out_infinite]",
                )}
                style={{ strokeDashoffset: alive ? undefined : 0 }}
              />
              <text
                x="60"
                y="58"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-primary-foreground font-heading text-[24px] font-bold dark:fill-foreground"
              >
                {hiwClosing.timer}
              </text>
              <text
                x="60"
                y="78"
                textAnchor="middle"
                className="fill-primary-foreground/60 text-[8px] tracking-[0.08em] dark:fill-foreground/60"
              >
                to write it down
              </text>
            </svg>
          </div>
        </div>
      </div>
    </Section>
  );
}
