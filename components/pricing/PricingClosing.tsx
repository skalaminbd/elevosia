"use client";

import { pricingClosing } from "@/content/pricing-page";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Section } from "@/components/shared/Section";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Closing band: a small calculator preview with the numbers ticking. */
export function PricingClosing() {
  const reduceMotion = useReducedMotion();

  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
            {pricingClosing.title}
          </h2>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 dark:text-foreground/80">
            {pricingClosing.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={pricingClosing.primary.href}
              className="bg-background text-foreground hover:bg-background/90"
            >
              {pricingClosing.primary.label}
            </ButtonLink>
            <ButtonLink
              href={pricingClosing.secondary.href}
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 dark:text-foreground dark:hover:bg-foreground/10"
            >
              {pricingClosing.secondary.label}
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-md">
            <p className="text-xs font-semibold text-foreground">
              Cost calculator
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {pricingClosing.calculator.rows.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-3 rounded-md bg-background px-3 py-2.5"
                >
                  <span className="text-xs text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {reduceMotion ? (
                      row.label.includes("price") ? (
                        `$${row.value.toLocaleString("en-US")}`
                      ) : (
                        row.value.toLocaleString("en-US")
                      )
                    ) : (
                      <NumberTicker value={row.value} />
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Sample numbers. The calculator does the real maths on your inputs.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
