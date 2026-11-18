"use client";

import { startHero } from "@/content/start";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Centered hero with a paper plane looping along a dashed path. */
export function StartHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-14 sm:px-6 md:pt-20 md:pb-16 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{startHero.eyebrow}</Eyebrow>
          <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
            {startHero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            {startHero.subhead}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={startHero.primary.href}>
              {startHero.primary.label}
            </ButtonLink>
            <ButtonLink href={startHero.secondary.href} variant="outline">
              {startHero.secondary.label}
            </ButtonLink>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <svg
            viewBox="0 0 720 100"
            className="w-full"
            role="img"
            aria-label="A paper plane heading toward a plan"
          >
            <path
              id="plane-path"
              d="M24 68 C 150 10, 280 96, 400 52 S 610 24, 696 58"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              strokeLinecap="round"
            />
            <circle cx="400" cy="52" r="4" fill="var(--color-success)" opacity="0.6" />
            <g transform={reduceMotion ? "translate(24 68)" : undefined}>
              {!reduceMotion ? (
                <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#plane-path" />
                </animateMotion>
              ) : null}
              <path
                d="M0 0 L24 -8 L10 0 L24 8 Z"
                fill="var(--color-primary)"
              />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
