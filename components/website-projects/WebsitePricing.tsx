"use client";

import { Check } from "lucide-react";
import { webPricing } from "@/content/website-projects";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Section } from "@/components/shared/Section";
import { NumberTicker } from "@/components/ui/number-ticker";

/** Dark band with the two website packages as light cards. */
export function WebsitePricing() {
  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {webPricing.title}
          </h2>
        </div>
        <p className="max-w-xl text-base text-primary-foreground/80 dark:text-foreground/80 lg:col-span-5">
          {webPricing.intro}
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:gap-6">
        {webPricing.plans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col rounded-lg border border-border bg-card p-6 text-foreground lg:p-8"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="font-mono text-sm text-muted-foreground">from</p>
            </div>
            <p className="mt-3 flex items-baseline gap-1">
              <span className="font-mono text-3xl font-semibold tabular-nums">
                $
                <NumberTicker value={plan.price} />
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{plan.body}</p>

            <ul className="mt-5 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <ButtonLink href="/start" variant="outline">
                Start a project
              </ButtonLink>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-sm text-primary-foreground/70 dark:text-foreground/70">
          {webPricing.addon}
        </p>
        <p className="text-sm font-medium text-highlight">{webPricing.note}</p>
      </div>
    </Section>
  );
}
