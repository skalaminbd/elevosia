"use client";

import { whyHero } from "@/content/why-custom";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Hero: a balance scale between build and buy, with both sides labelled. */
export function WhyHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-1/4 -left-24 hidden size-64 rounded-full bg-highlight/10 blur-3xl lg:block" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
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
            <div className="mx-auto w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm">
              <svg
                viewBox="0 0 200 120"
                className="h-40 w-full"
                role="img"
                aria-label="A balance scale tipping between build and buy"
              >
                <line x1="100" y1="20" x2="100" y2="100" stroke="var(--color-border)" strokeWidth="2" />
                <line x1="66" y1="104" x2="134" y2="104" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round" />
                <g
                  className={cn(
                    !reduceMotion && "animate-[why-rock_6000ms_ease-in-out_infinite]",
                  )}
                  style={{ transformOrigin: "100px 26px" }}
                >
                  <line x1="40" y1="26" x2="160" y2="26" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M40 26l-11 24h22z" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                  <path d="M160 26l-11 24h22z" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                  <circle cx="100" cy="26" r="4" fill="var(--color-primary)" />
                </g>
              </svg>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md border border-border bg-background p-3">
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Buy
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums">
                    $2,400<span className="text-[10px] font-normal">/mo</span>
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    at 20 people, +7% a year
                  </p>
                </div>
                <div className="rounded-md border border-primary/25 bg-primary/5 p-3">
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Build
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums">
                    $16,000
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    fixed, then $299/mo care
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
