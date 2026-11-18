"use client";

import { Check, Search } from "lucide-react";
import { audit } from "@/content/ai-automation";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { NumberTicker } from "@/components/ui/number-ticker";

/** Dark band. The audit offer, with a workflow panel and a lens on hover. */
export function AuditSection() {
  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow tone="inverse">{audit.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {audit.title}
          </h2>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-4xl font-semibold tabular-nums text-highlight">
              $<NumberTicker value={audit.price} className="text-highlight" />
            </span>
            <span className="text-sm text-primary-foreground/60 dark:text-foreground/60">
              one week, credited if we build
            </span>
          </p>
          <p className="mt-4 max-w-lg text-base text-primary-foreground/80 dark:text-foreground/80">
            {audit.body}
          </p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {audit.checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-primary-foreground/75 dark:text-foreground/75"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-highlight"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ButtonLink
              href={audit.cta.href}
              className="bg-background text-foreground hover:bg-background/90"
            >
              {audit.cta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="group relative mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 text-foreground shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Your week, mapped</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                Sample
              </span>
            </div>

            <ol className="mt-5 space-y-2">
              {[
                { label: "Tools you run today", meta: "scheduling, CRM, invoicing" },
                { label: "Shadow a real week", meta: "where the hours go" },
                { label: "Written plan", meta: "three wins, ranked" },
              ].map((row, index) => (
                <li
                  key={row.label}
                  className={`relative flex items-center gap-3 rounded-md border px-3 py-3 text-sm ${
                    index === 1
                      ? "border-primary/30 bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[11px] text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {row.label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {row.meta}
                    </span>
                  </span>

                  {index === 1 ? (
                    <span className="pointer-events-none absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-primary/40 bg-card text-primary transition-transform duration-300 ease-out group-hover:scale-125">
                      <Search className="size-3.5" aria-hidden="true" />
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <span>Three wins, ranked by hours saved</span>
              <span className="font-mono">1 week</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
