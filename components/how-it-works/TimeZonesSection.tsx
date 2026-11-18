"use client";

import { Check } from "lucide-react";
import { timeZones } from "@/content/how-it-works";
import { WorldClocks } from "@/components/how-it-works/WorldClocks";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";

/** Dark band: the overlap hours, with four live clocks. */
export function TimeZonesSection() {
  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow tone="inverse">Time zones</Eyebrow>
          <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {timeZones.title}
          </h2>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/75 dark:text-foreground/75">
            {timeZones.body}
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {timeZones.windows.map((window) => (
              <li
                key={window}
                className="flex items-start gap-2.5 text-sm text-primary-foreground/80 dark:text-foreground/80"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-highlight"
                  aria-hidden="true"
                />
                {window}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <WorldClocks />
        </div>
      </div>
    </Section>
  );
}
