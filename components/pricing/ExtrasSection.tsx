"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { addOns, websiteBand } from "@/content/pricing-page";
import { Section } from "@/components/shared/Section";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Add-ons and the small "need a website first" band. */
export function ExtrasSection() {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="add-ons" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[2.75rem]">
          {addOns.title}
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Add later, at these prices, without renegotiating the whole build.
        </p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {addOns.items.map((item) => (
          <li
            key={item.name}
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-foreground">{item.name}</p>
            <p className="mt-4 border-t border-border pt-4 font-mono text-xl font-semibold text-foreground">
              <span className="text-xs font-normal text-muted-foreground">
                from{" "}
              </span>
              $
              {reduceMotion ? (
                item.price.toLocaleString("en-US")
              ) : (
                <NumberTicker value={item.price} />
              )}
            </p>
            {"note" in item && item.note ? (
              <p className="mt-1 text-[11px] text-muted-foreground">
                {item.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm">
        <p className="max-w-2xl text-sm text-muted-foreground">
          {websiteBand.body}
        </p>
        <Link
          href={websiteBand.link.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {websiteBand.link.label}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}
