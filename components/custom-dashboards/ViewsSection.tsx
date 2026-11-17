"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { views } from "@/content/custom-dashboards";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { cn } from "@/lib/utils";

function ScreenFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="size-2 rounded-full bg-muted-foreground/30" />
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function OwnerScreen() {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">Owner · this week</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { k: "Revenue", v: "$4,820" },
          { k: "Booked", v: "18" },
          { k: "Margin", v: "41%" },
        ].map((item) => (
          <div key={item.k} className="rounded-md bg-muted px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground">{item.k}</p>
            <p className="font-mono text-sm font-semibold text-foreground">
              {item.v}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-24 items-end gap-1">
        {[38, 56, 44, 68, 52, 74, 60, 86, 66, 92].map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-sm bg-primary"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="mt-3 rounded-md bg-accent px-3 py-2 text-[11px] text-accent-foreground">
        AI briefing: 3 invoices overdue, one shift open Friday.
      </p>
    </div>
  );
}

function ManagerScreen() {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">Manager · scheduling</p>
      <ul className="mt-3 flex flex-col gap-1.5">
        {[
          { name: "Ana R.", time: "Mon–Fri · 8–4", state: "Confirmed" },
          { name: "Luis M.", time: "Mon–Thu · 9–5", state: "Confirmed" },
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
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
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
    </div>
  );
}

function StaffScreen() {
  return (
    <div className="mx-auto w-full max-w-56">
      <p className="text-[10px] text-muted-foreground">Today</p>
      <p className="font-mono text-sm font-semibold text-foreground">3 jobs</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {[
          { t: "Gutter repair", m: "Oak St · 9:30", done: true },
          { t: "AC service", m: "Pine Ave · 11:00", done: true },
          { t: "Boiler check", m: "Cedar Rd · 2:15", done: false },
        ].map((job) => (
          <li
            key={job.t}
            className="flex items-center gap-2 rounded-md bg-muted px-2.5 py-2"
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
                "flex size-4 items-center justify-center rounded-full",
                job.done
                  ? "bg-success text-success-foreground"
                  : "border border-muted-foreground/40",
              )}
            >
              {job.done ? <Check className="size-2.5" aria-hidden="true" /> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClientScreen() {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">Client portal</p>
      <p className="mt-1 font-heading text-lg font-semibold text-foreground">
        Next visit Thursday
      </p>
      <div className="mt-3 flex gap-2">
        <span className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground">
          Reschedule
        </span>
        <span className="rounded-full border border-border px-3 py-1.5 text-[11px] font-medium text-foreground">
          Pay invoice
        </span>
      </div>
      <ul className="mt-4 flex flex-col gap-1.5">
        {["Work order shared", "Invoice #1042 paid", "Message from Ana"].map(
          (row) => (
            <li
              key={row}
              className="rounded-md bg-muted px-3 py-2 text-[11px] text-muted-foreground"
            >
              {row}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

const SCREENS = [OwnerScreen, ManagerScreen, StaffScreen, ClientScreen];

/**
 * Four views: the screen stays put while the story for each role scrolls past.
 * On mobile each role gets its own block and screen.
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

  const ActiveScreen = SCREENS[active] ?? OwnerScreen;

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
          {views.tabs.map((tab, index) => (
            <div
              key={tab.id}
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
                {tab.headline}
              </h3>
              <ul className="mt-5 flex flex-col gap-2.5">
                {tab.bullets.map((bullet) => (
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
                <ScreenFrame>
                  {(() => {
                    const Screen = SCREENS[index] ?? OwnerScreen;
                    return <Screen />;
                  })()}
                </ScreenFrame>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:col-span-7 lg:block">
          <div className="sticky top-24">
            <ScreenFrame>
              <ActiveScreen />
            </ScreenFrame>
            <p className="mt-4 text-center font-mono text-xs text-primary-foreground/50 dark:text-foreground/50">
              {String(active + 1).padStart(2, "0")} / 04 · {views.tabs[active].label}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
