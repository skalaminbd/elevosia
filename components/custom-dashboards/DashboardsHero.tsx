"use client";

import { Check } from "lucide-react";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { dashboardsDemo, dashboardsHero } from "@/content/custom-dashboards";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function DashboardScreen({ active }: { active: boolean }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-background text-foreground">
      <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
        <span className="ml-1 text-[10px] text-muted-foreground">
          Overview
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">
        {dashboardsDemo.kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="rounded-sm bg-muted px-2 py-1.5"
          >
            <p className="text-[9px] text-muted-foreground">{kpi.label}</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
              {kpi.prefix}
              {kpi.value.toLocaleString("en-US")}
            </p>
          </div>
        ))}
      </div>

      <div className="flex h-24 items-end gap-1.5 px-3 pb-3">
        {dashboardsDemo.bars.map((height, index) => (
          <span
            key={index}
            className={cn(
              "flex-1 origin-bottom rounded-t-sm bg-primary",
              active && "animate-[cd-bar_3200ms_ease-in-out_infinite]",
            )}
            style={{
              height: `${height}%`,
              animationDelay: `${index * 0.18}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function DayPlan({ active }: { active: boolean }) {
  return (
    <div className="w-32 overflow-hidden rounded-[20px] border-4 border-foreground/20 bg-background shadow-md sm:w-36">
      <div className="mx-auto mt-1 h-1 w-8 rounded-full bg-foreground/20" />
      <div className="px-2.5 py-2">
        <p className="text-[9px] text-muted-foreground">Today</p>
        <p className="font-mono text-[11px] font-semibold text-foreground">
          3 jobs
        </p>
        <ul className="mt-1.5 flex flex-col gap-1">
          {dashboardsDemo.jobs.map((job, index) => (
            <li key={job.id} className="flex items-center gap-1.5 rounded-sm bg-muted px-1.5 py-1">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[9px] font-medium text-foreground">
                  {job.title}
                </span>
                <span className="block truncate text-[8px] text-muted-foreground">
                  {job.meta}
                </span>
              </span>
              <span
                className={cn(
                  "flex size-3 shrink-0 items-center justify-center rounded-full",
                  job.done
                    ? "bg-success text-success-foreground"
                    : "border border-muted-foreground/40",
                  job.done && active
                    ? "animate-[who-pop_4500ms_ease-out_infinite]"
                    : "",
                )}
                style={{ animationDelay: `${index * 0.55}s` }}
              >
                {job.done ? <Check className="size-2" aria-hidden="true" /> : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DashboardsHero() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const alive = inView && !reduceMotion;

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow>{dashboardsHero.eyebrow}</Eyebrow>
          <h1 className="mt-5 font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {dashboardsHero.title}
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground lg:text-lg">
            {dashboardsHero.subhead}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={dashboardsHero.primary.href}>
              {dashboardsHero.primary.label}
            </ButtonLink>
            <ButtonLink href={dashboardsHero.secondary.href} variant="outline">
              {dashboardsHero.secondary.label}
            </ButtonLink>
          </div>
        </div>

        <div ref={ref} className="lg:col-span-6">
          <div className="relative rounded-lg bg-primary p-4 text-primary-foreground shadow-md sm:p-6">
            <div className="sm:pr-36">
              <DashboardScreen active={alive} />
            </div>

            <div className="mt-4 flex justify-end sm:absolute sm:right-3 sm:-bottom-8 sm:mt-0">
              <DayPlan active={alive} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
