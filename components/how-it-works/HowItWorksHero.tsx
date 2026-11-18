"use client";

import { Check } from "lucide-react";
import { hiwDemo, hiwHero } from "@/content/how-it-works";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function MiniBoard({ alive }: { alive: boolean }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-xs font-semibold text-foreground">Your weekly board</p>
        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          {hiwDemo.board.week}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {hiwDemo.board.columns.map((column) => (
          <div key={column.id} className="rounded-md bg-muted/60 p-2.5">
            <p className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
              {column.label}
              <span className="font-mono">{column.tasks.length}</span>
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {column.tasks.map((task, index) => (
                <li
                  key={task}
                  className="flex items-start gap-1.5 rounded-sm border border-border bg-card px-2 py-1.5 text-[10px] text-foreground"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex size-3 shrink-0 items-center justify-center rounded-full",
                      column.id === "done"
                        ? "bg-success text-success-foreground"
                        : "border border-muted-foreground/40",
                      column.id === "progress" && alive
                        ? "animate-[who-status-dot_5000ms_ease-in-out_infinite]"
                        : "",
                    )}
                    style={{ animationDelay: `${index * 0.6}s` }}
                  >
                    {column.id === "done" ? (
                      <Check className="size-2" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span className="leading-tight">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
        Tasks turn green as we finish them. Sample data.
      </p>
    </div>
  );
}

export function HowItWorksHero() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const alive = inView && !reduceMotion;

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>{hiwHero.eyebrow}</Eyebrow>
            <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {hiwHero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {hiwHero.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={hiwHero.primary.href}>
                {hiwHero.primary.label}
              </ButtonLink>
              <ButtonLink href={hiwHero.secondary.href} variant="outline">
                {hiwHero.secondary.label}
              </ButtonLink>
            </div>
          </div>

          <div ref={ref} className="lg:col-span-5">
            <MiniBoard alive={alive} />
          </div>
        </div>
      </div>
    </section>
  );
}
