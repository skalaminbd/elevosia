"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { views } from "@/content/custom-dashboards";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const CYCLE_MS = 6000;

function ScreenFrame({
  children,
  phone = false,
}: {
  children: React.ReactNode;
  phone?: boolean;
}) {
  if (phone) {
    return (
      <div className="mx-auto w-60 rounded-[26px] border-4 border-foreground/10 bg-background p-3 shadow-md">
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-foreground/15" />
        {children}
      </div>
    );
  }

  return (
    <div className="rounded-lg border-4 border-foreground/10 bg-background p-3 shadow-md">
      <div className="flex items-center gap-1.5 border-b border-border pb-2">
        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
      </div>
      <div className="pt-3">{children}</div>
    </div>
  );
}

function OwnerScreen() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { k: "Revenue", v: "$4,820" },
          { k: "Booked", v: "18" },
          { k: "Margin", v: "41%" },
        ].map((item) => (
          <div key={item.k} className="rounded-sm bg-muted px-2 py-1.5">
            <p className="text-[9px] text-muted-foreground">{item.k}</p>
            <p className="font-mono text-sm font-semibold text-foreground">
              {item.v}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-20 items-end gap-1">
        {[38, 56, 44, 68, 52, 74, 60, 86, 66, 92].map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-sm bg-primary/80"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function ManagerScreen() {
  return (
    <ul className="flex flex-col gap-1.5">
      {[
        { name: "Ana R.", time: "Mon–Fri · 8–4", state: "Confirmed" },
        { name: "Luis M.", time: "Mon–Thu · 9–5", state: "Confirmed" },
        { name: "Open shift", time: "Fri · 8–4", state: "Suggest 2" },
      ].map((row) => (
        <li
          key={row.name}
          className="flex items-center justify-between rounded-sm bg-muted px-2.5 py-2"
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
                : "bg-highlight/20 text-foreground",
            )}
          >
            {row.state}
          </span>
        </li>
      ))}
    </ul>
  );
}

function StaffScreen() {
  return (
    <div>
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
            className="flex items-center gap-2 rounded-sm bg-muted px-2 py-1.5"
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] font-medium text-foreground">
                {job.t}
              </span>
              <span className="block text-[9px] text-muted-foreground">
                {job.m}
              </span>
            </span>
            <span
              className={cn(
                "flex size-3.5 items-center justify-center rounded-full",
                job.done
                  ? "bg-success text-success-foreground"
                  : "border border-muted-foreground/40",
              )}
            >
              {job.done ? <Check className="size-2" aria-hidden="true" /> : null}
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
      <p className="text-[10px] text-muted-foreground">Your account</p>
      <p className="font-heading text-base font-semibold text-foreground">
        Next visit Thursday
      </p>
      <div className="mt-2 flex gap-2">
        <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-medium text-primary-foreground">
          Reschedule
        </span>
        <span className="rounded-full border border-border px-3 py-1 text-[10px] font-medium text-foreground">
          Pay invoice
        </span>
      </div>
      <ul className="mt-3 flex flex-col gap-1.5">
        {["Work order shared", "Invoice #1042 paid", "Message from Ana"].map(
          (row) => (
            <li
              key={row}
              className="rounded-sm bg-muted px-2 py-1.5 text-[10px] text-muted-foreground"
            >
              {row}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

const SCREENS = {
  owner: { Component: OwnerScreen, phone: false },
  manager: { Component: ManagerScreen, phone: false },
  staff: { Component: StaffScreen, phone: true },
  client: { Component: ClientScreen, phone: false },
} as const;

/**
 * Four views: a tab per role, each with the screen that role actually gets.
 * It advances on its own until a tab is clicked.
 */
export function ViewsSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    if (!inView || picked || reduceMotion) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % views.tabs.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(timer);
  }, [inView, picked, reduceMotion]);

  const tab = views.tabs[active];
  const screen = SCREENS[tab.id as keyof typeof SCREENS] ?? SCREENS.owner;

  return (
    <Section id="views">
      <div ref={ref}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Eyebrow>One system, four views</Eyebrow>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {views.title}
            </h2>
          </div>
          <p className="max-w-md text-base text-muted-foreground">
            {views.intro}
          </p>
        </div>

        <div
          role="group"
          aria-label="Choose a view"
          className="mt-8 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-card p-1 shadow-sm"
        >
          {views.tabs.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={active === index}
              onClick={() => {
                setActive(index);
                setPicked(true);
              }}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                active === index
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {tab.headline}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {tab.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-base text-muted-foreground">
                  <Check
                    className="mt-1 size-4 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-h-[300px] items-center lg:col-span-7">
            <ScreenFrame phone={screen.phone}>
              <screen.Component />
            </ScreenFrame>
          </div>
        </div>
      </div>
    </Section>
  );
}
