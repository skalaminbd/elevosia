"use client";

import { Check } from "lucide-react";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { dashboardsDemo, dashboardsHero } from "@/content/custom-dashboards";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const TRUST = [
  "Fixed price before we build",
  "You own the code",
  "Live in 6 to 10 weeks",
];

function Screen({ active }: { active: boolean }) {
  return (
    <div className="overflow-hidden rounded-t-lg bg-card text-card-foreground">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-destructive/40" />
          <span className="size-2 rounded-full bg-warning/50" />
          <span className="size-2 rounded-full bg-success/50" />
          <span className="ml-3 text-xs text-muted-foreground">Overview</span>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          Mon 18 Nov
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
        {dashboardsDemo.kpis.map((kpi) => (
          <div key={kpi.id} className="rounded-md bg-muted/70 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            <p className="mt-1 font-mono text-lg font-semibold text-foreground">
              {kpi.prefix}
              {kpi.value.toLocaleString("en-US")}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 px-5 pb-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="text-[11px] text-muted-foreground">Revenue this week</p>
          <div className="mt-3 flex h-28 items-end gap-1.5">
            {dashboardsDemo.bars.map((height, index) => (
              <span
                key={index}
                className={cn(
                  "flex-1 origin-bottom rounded-t-sm bg-primary",
                  active && "animate-[cd-bar_3200ms_ease-in-out_infinite]",
                )}
                style={{
                  height: `${height}%`,
                  animationDelay: `${index * 0.16}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-[11px] text-muted-foreground">Today&apos;s jobs</p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {dashboardsDemo.jobs.map((job, index) => (
              <li
                key={job.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border px-2.5 py-2"
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-foreground">
                    {job.title}
                  </span>
                  <span className="block truncate text-[10px] text-muted-foreground">
                    {job.meta}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full",
                    job.done
                      ? "bg-success text-success-foreground"
                      : "border border-muted-foreground/40",
                    job.done && active
                      ? "animate-[who-pop_4500ms_ease-out_infinite]"
                      : "",
                  )}
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  {job.done ? (
                    <Check className="size-2.5" aria-hidden="true" />
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function DashboardsHero() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.1 });
  const alive = inView && !reduceMotion;

  return (
    <section className="relative overflow-hidden bg-secondary text-secondary-foreground">
      <div
        aria-hidden="true"
        className="line-grid pointer-events-none absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 md:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <Eyebrow>{dashboardsHero.eyebrow}</Eyebrow>
          <h1 className="mt-6 font-heading text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.96] font-bold tracking-[-0.04em] text-balance">
            {dashboardsHero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base text-secondary-foreground/80 sm:text-lg dark:text-foreground/75">
            {dashboardsHero.subhead}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={dashboardsHero.primary.href} variant="highlight">
              {dashboardsHero.primary.label}
            </ButtonLink>
            <ButtonLink
              href={dashboardsHero.secondary.href}
              variant="outline"
              className="text-foreground"
            >
              {dashboardsHero.secondary.label}
            </ButtonLink>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST.map((line) => (
              <li
                key={line}
                className="flex items-center gap-1.5 text-xs text-secondary-foreground/70 dark:text-foreground/70"
              >
                <Check className="size-3.5 text-primary" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div ref={ref} className="relative mt-14 lg:mt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 top-0 h-52 bg-highlight/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-t-xl border border-b-0 border-border shadow-md">
              <Screen active={alive} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
