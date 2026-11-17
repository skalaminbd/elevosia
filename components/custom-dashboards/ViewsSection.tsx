"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Check,
  CreditCard,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { views } from "@/content/custom-dashboards";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "clients", label: "Clients", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

/** Which nav item each role actually lives in. */
const NAV_ACTIVE: Record<string, string> = {
  owner: "overview",
  manager: "schedule",
  staff: "schedule",
  client: "billing",
};

function OwnerBody() {
  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-3 gap-2">
        {[
          { k: "Revenue", v: "$4,820" },
          { k: "Booked", v: "18" },
          { k: "Margin", v: "41%" },
        ].map((item) => (
          <div key={item.k} className="rounded-md bg-muted px-3 py-2.5">
            <p className="text-[10px] text-muted-foreground">{item.k}</p>
            <p className="font-mono text-base font-semibold text-foreground">
              {item.v}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-[10px] text-muted-foreground">
        Revenue this week
      </p>
      <div className="mt-2 flex min-h-24 flex-1 items-end gap-1.5 pb-1">
        {[38, 54, 42, 66, 50, 72, 58, 84, 64, 90, 70, 96].map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-sm bg-primary"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <p className="mt-4 rounded-md bg-accent px-3 py-2.5 text-[11px] text-accent-foreground">
        AI briefing: 3 invoices overdue, one shift open Friday.
      </p>
    </div>
  );
}

function ManagerBody() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-foreground">This week</p>
        <span className="rounded-full bg-highlight/25 px-2 py-0.5 text-[10px] font-medium text-foreground">
          1 open shift
        </span>
      </div>
      <ul className="mt-3 flex flex-1 flex-col gap-2">
        {[
          { name: "Ana R.", time: "Mon–Fri · 8–4", state: "Confirmed" },
          { name: "Luis M.", time: "Mon–Thu · 9–5", state: "Confirmed" },
          { name: "Priya S.", time: "Wed–Sat · 10–6", state: "Confirmed" },
          { name: "Open shift", time: "Fri · 8–4", state: "Suggest 2" },
        ].map((row) => (
          <li
            key={row.name}
            className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2.5"
          >
            <span>
              <span className="block text-xs font-medium text-foreground">
                {row.name}
              </span>
              <span className="block text-[10px] text-muted-foreground">
                {row.time}
              </span>
            </span>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                row.state === "Confirmed"
                  ? "bg-success/15 text-success"
                  : "bg-highlight/25 text-foreground",
              )}
            >
              {row.state}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-muted-foreground">
        2 time-off requests waiting.
      </p>
    </div>
  );
}

function StaffBody() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">Today</p>
        <span className="font-mono text-[11px] text-foreground">3 jobs</span>
      </div>
      <ul className="mt-3 flex flex-1 flex-col gap-2">
        {[
          { t: "Gutter repair", m: "Oak St · 9:30", done: true },
          { t: "AC service", m: "Pine Ave · 11:00", done: true },
          { t: "Boiler check", m: "Cedar Rd · 2:15", done: false },
        ].map((job) => (
          <li
            key={job.t}
            className="flex items-center gap-2 rounded-md bg-muted px-3 py-3"
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-foreground">
                {job.t}
              </span>
              <span className="block text-[10px] text-muted-foreground">
                {job.m}
              </span>
            </span>
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full",
                job.done
                  ? "bg-success text-success-foreground"
                  : "border border-muted-foreground/40",
              )}
            >
              {job.done ? <Check className="size-3" aria-hidden="true" /> : null}
            </span>
          </li>
        ))}
      </ul>
      <span className="mt-3 rounded-md bg-primary px-3 py-2 text-center text-[11px] font-medium text-primary-foreground">
        Clock out
      </span>
    </div>
  );
}

function ClientBody() {
  return (
    <div className="flex h-full flex-col">
      <div className="rounded-md bg-muted px-3 py-3">
        <p className="text-[10px] text-muted-foreground">Next visit</p>
        <p className="mt-0.5 font-heading text-base font-semibold text-foreground">
          Thursday, 2:15 pm
        </p>
        <div className="mt-2 flex gap-2">
          <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium text-primary-foreground">
            Reschedule
          </span>
          <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-foreground">
            Pay invoice
          </span>
        </div>
      </div>

      <ul className="mt-3 flex flex-1 flex-col gap-1.5">
        {[
          "Work order shared",
          "Invoice #1042 paid",
          "Message from Ana",
          "Photos from your visit",
        ].map((row) => (
          <li
            key={row}
            className="rounded-md border border-border px-3 py-2 text-[11px] text-muted-foreground"
          >
            {row}
          </li>
        ))}
      </ul>
    </div>
  );
}

const BODIES: Record<string, () => React.JSX.Element> = {
  owner: OwnerBody,
  manager: ManagerBody,
  staff: StaffBody,
  client: ClientBody,
};

const NAV_RAIL = (
  activeNav: string,
  compact: boolean,
) =>
  NAV.map((item) => (
    <span
      key={item.id}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5",
        compact ? "text-[10px]" : "text-[11px]",
        item.id === activeNav
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground",
      )}
    >
      <item.icon
        className={compact ? "size-3" : "size-3.5"}
        aria-hidden="true"
      />
      {item.label}
    </span>
  ));

function ScreenWindow({
  roleId,
  compact = false,
}: {
  roleId: string;
  compact?: boolean;
}) {
  const tab = views.tabs.find((item) => item.id === roleId) ?? views.tabs[0];
  const Body = BODIES[tab.id] ?? OwnerBody;
  const activeNav = NAV_ACTIVE[tab.id] ?? "overview";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-md">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-highlight" />
          <span className="text-xs font-medium text-card-foreground">
            {tab.label} view
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-wide text-muted-foreground">
          live
        </span>
      </div>

      <div className="flex">
        <aside className="hidden w-36 shrink-0 flex-col gap-1 border-r border-border p-3 sm:flex">
          {NAV_RAIL(activeNav, false)}
        </aside>
        <div
          className={cn(
            "min-w-0 flex-1 p-4 sm:p-5",
            compact ? "" : "sm:h-[430px]",
          )}
        >
          <Body />
        </div>
      </div>
    </div>
  );
}

/**
 * One app window that stays put while the four roles scroll past. Tall, with a
 * real nav rail, so it reads like software rather than a card.
 */
export function ViewsSection() {
  const [active, setActive] = useState(0);
  const blocks = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    blocks.current.forEach((block) => block && observer.observe(block));
    return () => observer.disconnect();
  }, []);

  const tab = views.tabs[active] ?? views.tabs[0];

  return (
    <Section
      id="views"
      className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground"
    >
      <div className="max-w-2xl">
        <Eyebrow tone="inverse">One system, four views</Eyebrow>
        <h2 className="mt-5 font-heading text-4xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl">
          {views.title}
        </h2>
        <p className="mt-5 text-base text-primary-foreground/75 sm:text-lg dark:text-foreground/75">
          {views.intro}
        </p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          {views.tabs.map((item, index) => (
            <div
              key={item.id}
              data-index={index}
              ref={(element) => {
                blocks.current[index] = element;
              }}
              className="border-t border-primary-foreground/15 py-8 first:border-t-0 lg:flex lg:min-h-[48vh] lg:flex-col lg:justify-center lg:py-10 lg:first:justify-start lg:first:pt-0 dark:border-border"
            >
              <p
                className={cn(
                  "font-mono text-sm transition-colors",
                  active === index
                    ? "text-highlight"
                    : "text-primary-foreground/45 dark:text-foreground/45",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                {item.headline}
              </h3>
              <ul className="mt-5 flex flex-col gap-2.5">
                {item.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2.5 text-sm text-primary-foreground/75 sm:text-base dark:text-foreground/75"
                  >
                    <Check
                      className="mt-1 size-4 shrink-0 text-highlight"
                      aria-hidden="true"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="mt-6 lg:hidden">
                <ScreenWindow roleId={item.id} compact />
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:col-span-7 lg:block">
          <div className="sticky top-24">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 rounded-3xl bg-highlight/15 blur-3xl"
              />
              <div className="relative">
                <ScreenWindow roleId={tab.id} />
              </div>
            </div>
            <p className="mt-4 text-center font-mono text-xs text-primary-foreground/50 dark:text-foreground/50">
              {String(active + 1).padStart(2, "0")} / 04 · {tab.label}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
