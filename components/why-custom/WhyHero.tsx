"use client";

import { whyHero } from "@/content/why-custom";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Hero: a balance scale rocking between Build and Buy. */
export function WhyHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>{whyHero.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {whyHero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {whyHero.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={whyHero.primary.href}>
                {whyHero.primary.label}
              </ButtonLink>
              <ButtonLink href={whyHero.secondary.href} variant="outline">
                {whyHero.secondary.label}
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="mx-auto flex max-w-sm flex-col items-center rounded-lg border border-border bg-card p-6 shadow-sm">
              <svg
                viewBox="0 0 200 120"
                className="h-44 w-full"
                role="img"
                aria-label="A balance scale tipping between build and buy"
              >
                <line x1="100" y1="18" x2="100" y2="100" stroke="var(--color-border)" strokeWidth="2" />
                <line x1="70" y1="104" x2="130" y2="104" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round" />
                <g
                  className={cn(
                    "origin-center",
                    !reduceMotion && "animate-[why-rock_6000ms_ease-in-out_infinite]",
                  )}
                  style={{ transformOrigin: "100px 24px" }}
                >
                  <line x1="40" y1="24" x2="160" y2="24" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M40 24l-10 22h20z" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                  <path d="M160 24l-10 22h20z" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                  <circle cx="100" cy="24" r="4" fill="var(--color-primary)" />
                </g>
              </svg>

              <div className="mt-2 flex w-full items-center justify-between font-mono text-xs text-muted-foreground">
                <span>Buy</span>
                <span>Build</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
