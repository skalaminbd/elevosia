"use client";

import { Check } from "lucide-react";
import { blueprint } from "@/content/pricing-page";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Section } from "@/components/shared/Section";
import { ShineBorder } from "@/components/ui/shine-border";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Step 1: the free Blueprint, with its list ticking and the week filling in. */
export function BlueprintSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="blueprint" className="scroll-mt-24">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <p className="font-mono text-xs text-muted-foreground">
            {blueprint.label}
          </p>
          <h2 className="mt-3 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {blueprint.title}
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            {blueprint.body}
          </p>

          <ul className="mt-6 flex flex-col gap-2">
            {blueprint.includes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-8">
            <span className="font-heading text-2xl font-bold text-foreground">
              {blueprint.price}
            </span>{" "}
            <span className="text-sm text-muted-foreground">
              {blueprint.priceNote}
            </span>
          </p>

          <div className="mt-6">
            <ButtonLink href={blueprint.cta.href}>
              {blueprint.cta.label}
            </ButtonLink>
          </div>
        </div>

        <div ref={ref} className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-md">
            {!reduceMotion ? (
              <ShineBorder
                borderWidth={1.5}
                duration={16}
                shineColor="var(--primary)"
              />
            ) : null}

            <div className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">
                  Blueprint
                </p>
                <span className="rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-medium text-success">
                  Free
                </span>
              </div>

              <ul className="mt-4 flex flex-col gap-2">
                {blueprint.includes.map((item, index) => (
                  <li
                    key={item}
                    className={cn(
                      "flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground",
                      alive && "animate-[who-pop_6000ms_ease-out_infinite]",
                    )}
                    style={{ animationDelay: `${index * 0.35}s` }}
                  >
                    <Check className="size-3 text-success" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                <p className="text-xs text-muted-foreground">
                  Delivered in 5 business days
                </p>
                <div className="mt-2 grid grid-cols-5 gap-1.5">
                  {blueprint.days.map((day, index) => (
                    <div key={day} className="text-center">
                      <span
                        className={cn(
                          "block h-6 rounded-sm border border-border bg-muted",
                          alive &&
                            "animate-[who-status-dot_6000ms_ease-in-out_infinite]",
                        )}
                        style={{ animationDelay: `${index * 0.3}s` }}
                      />
                      <span className="mt-1 block font-mono text-[10px] text-muted-foreground">
                        {day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
