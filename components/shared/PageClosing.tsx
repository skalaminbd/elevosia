"use client";

import type { ReactNode } from "react";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Section } from "@/components/shared/Section";

/**
 * The standard closing band: dark in both themes, a solid light primary button
 * and a light ghost secondary. Optional visual on the right.
 */
export function PageClosing({
  title,
  body,
  primary,
  secondary,
  visual,
}: {
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  visual?: ReactNode;
}) {
  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className={visual ? "lg:col-span-7" : "lg:col-span-12 lg:max-w-3xl"}>
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 dark:text-foreground/80">
            {body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={primary.href}
              className="bg-background text-foreground hover:bg-background/90"
            >
              {primary.label}
            </ButtonLink>
            <ButtonLink
              href={secondary.href}
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 dark:text-foreground dark:hover:bg-foreground/10"
            >
              {secondary.label}
            </ButtonLink>
          </div>
        </div>

        {visual ? <div className="lg:col-span-5">{visual}</div> : null}
      </div>
    </Section>
  );
}
