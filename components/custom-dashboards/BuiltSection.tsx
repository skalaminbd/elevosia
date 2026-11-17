"use client";

import { Check, ShieldCheck } from "lucide-react";
import { built } from "@/content/custom-dashboards";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Built properly: the guarantees as cards, and a terminal running the same
 * checks line by line.
 */
export function BuiltSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="built">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="max-w-2xl font-heading text-4xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl">
            {built.title}
          </h2>

          <div className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {built.cards.map((card) => (
              <div key={card.id} className="border-t border-border py-6">
                <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div ref={ref} className="lg:col-span-5">
          <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-md">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="size-2 rounded-full bg-muted-foreground/30" />
              <span className="size-2 rounded-full bg-muted-foreground/30" />
              <span className="size-2 rounded-full bg-muted-foreground/30" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                security-check.sh
              </span>
            </div>

            <ul className="flex flex-1 flex-col gap-2.5 p-4 font-mono text-xs sm:text-[13px]">
              {built.terminalLines.map((line, index) => (
                <li
                  key={line}
                  className={cn(
                    "flex items-start gap-2",
                    alive && "animate-[cd-line_9000ms_ease-out_infinite]",
                  )}
                  style={{ animationDelay: `${index * 0.55}s` }}
                >
                  <Check
                    className="mt-0.5 size-3.5 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <span className="text-foreground/85">
                    {line}
                  </span>
                </li>
              ))}
              <li
                aria-hidden="true"
                className="mt-1 flex items-center gap-2 text-muted-foreground"
              >
                <span>$</span>
                <span className="inline-block h-3 w-1.5 animate-blink-cursor bg-primary" />
              </li>
            </ul>

            <p className="border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
              Runs nightly. Results go to your inbox.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
