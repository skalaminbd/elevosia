"use client";

import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Briefcase,
  CalendarDays,
  LayoutDashboard,
  Receipt,
  Settings,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ShineBorder } from "@/components/ui/shine-border";
import { LiveNumber } from "@/components/blocks/live-number";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Clients" },
  { icon: Briefcase, label: "Jobs" },
  { icon: Receipt, label: "Invoices" },
  { icon: BarChart3, label: "Reports" },
  { icon: CalendarDays, label: "Schedule" },
];

const STATS = [
  {
    label: "Revenue (30d)",
    live: { value: 48.2, prefix: "$", suffix: "k", decimals: 1, step: 0.3 },
    delta: "+12.4%",
    trend: "up" as const,
    note: "vs last month",
    spark: "M0 26 L10 22 L20 24 L30 18 L40 20 L50 14 L60 16 L70 10 L80 12 L90 6 L100 8",
  },
  {
    label: "Open jobs",
    live: { value: 28, step: 1, min: 24 },
    delta: "6 due today",
    trend: "flat" as const,
    note: "across 4 crews",
    spark: "M0 18 L10 20 L20 16 L30 18 L40 14 L50 16 L60 14 L70 15 L80 12 L90 14 L100 12",
  },
  {
    label: "Invoices due",
    live: { value: 12.6, prefix: "$", suffix: "k", decimals: 1, step: 0.2 },
    delta: "3 overdue",
    trend: "down" as const,
    note: "$4.8k past 30d",
    spark: "M0 10 L10 12 L20 9 L30 14 L40 12 L50 17 L60 15 L70 20 L80 18 L90 23 L100 21",
  },
  {
    label: "Team utilisation",
    live: { value: 87, suffix: "%", step: 1, min: 80, max: 96 },
    delta: "+4%",
    trend: "up" as const,
    note: "this week",
    spark: "M0 20 L10 18 L20 19 L30 15 L40 16 L50 12 L60 13 L70 9 L80 10 L90 7 L100 5",
  },
];

const REVENUE_MIX = [
  { label: "Services", value: "$25.1k", share: "52%", className: "bg-chart-2" },
  { label: "Retainers", value: "$13.5k", share: "28%", className: "bg-info" },
  { label: "Projects", value: "$9.6k", share: "20%", className: "bg-warning" },
];

const MINI_STATS = [
  { label: "New clients", live: { value: 6, prefix: "+", step: 1, min: 4 }, note: "this month" },
  { label: "Jobs completed", live: { value: 42, step: 1, min: 38 }, note: "this month" },
  { label: "Avg. invoice", live: { value: 1.8, prefix: "$", suffix: "k", decimals: 1, step: 0.1 }, note: "paid in 6 days" },
  { label: "Client rating", live: { value: 4.9, decimals: 1, step: 0.1, max: 5 }, note: "from 38 reviews" },
];

function Sparkline({ path, className }: { path: string; className: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      className="h-8 w-full"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={cn(className, "opacity-30")}
      />
      <motion.path
        d={path}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="22 78"
        className={className}
        animate={reduceMotion ? undefined : { strokeDashoffset: [124, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}

function Trend({
  trend,
  label,
}: {
  trend: "up" | "down" | "flat";
  label: string;
}) {
  if (trend === "flat") {
    return (
      <span className="flex items-center gap-1 text-xs text-white/50">
        {label}
      </span>
    );
  }

  const Icon = trend === "up" ? TrendingUp : TrendingDown;

  return (
    <span
      className={
        trend === "up"
          ? "flex items-center gap-1 text-xs text-success"
          : "flex items-center gap-1 text-xs text-warning"
      }
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

function AiSummary() {
  return (
    <div className="rounded-lg border border-highlight/30 bg-black/30 p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-highlight" aria-hidden="true" />
        <p className="text-xs font-semibold tracking-wide text-highlight uppercase">
          AI summary
        </p>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-white/70">
        Two jobs slipped past their deadline and $4.8k is overdue. Adding two
        crews on Thursday keeps the month on target.
      </p>
      <p className="mt-3 flex items-center gap-1 text-xs font-medium text-highlight">
        Open weekly plan
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
      </p>
    </div>
  );
}

export function DashboardMockup() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label="Preview of the Elevosia dashboard with revenue, jobs, invoices and an AI summary"
      className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-[var(--brand-forest)] text-white shadow-md"
    >
      <ShineBorder
        borderWidth={1}
        duration={24}
        shineColor={[
          "var(--highlight)",
          "var(--accent)",
          "var(--highlight)",
          "var(--success)",
          "var(--highlight)",
        ]}
      />

      <div className="flex">
        <aside className="flex w-52 shrink-0 flex-col gap-1 border-r border-white/10 bg-black/20 p-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-highlight font-heading text-base font-bold text-highlight-foreground">
              e
            </span>
            <span className="font-heading text-base font-semibold">
              elevosia
            </span>
          </div>

          <p className="px-2 pb-1 text-[11px] tracking-wide text-white/40 uppercase">
            Overview
          </p>

          {NAV.map((item) => (
            <div
              key={item.label}
              className={
                item.active
                  ? "flex items-center gap-2 rounded-lg bg-white/10 px-2.5 py-2 text-sm font-medium text-white"
                  : "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/60"
              }
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </div>
          ))}

          <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-3">
            <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/60">
              <Settings className="size-4" aria-hidden="true" />
              Settings
            </div>
            <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/60">
              <Bell className="size-4" aria-hidden="true" />
              Notifications
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-heading text-xl font-semibold">
                Business overview
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                <span className="relative flex size-1.5">
                  <span className="absolute inset-0 rounded-full bg-success" />
                  <motion.span
                    className="absolute inset-0 rounded-full bg-success"
                    animate={{ scale: [1, 2.6, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </span>
                Updated today, 9:42 AM · Demo data
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70">
                Feb 18 – Mar 18 · Monthly
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-highlight px-3 py-1.5 text-xs font-semibold text-highlight-foreground">
                Export
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs text-white/50">{stat.label}</p>
                <p className="mt-1 font-heading text-2xl font-semibold">
                  <LiveNumber {...stat.live} />
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Trend trend={stat.trend} label={stat.delta} />
                </div>
                <Sparkline
                  path={stat.spark}
                  className={stat.trend === "down" ? "stroke-warning" : "stroke-highlight"}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="relative rounded-lg border border-white/10 bg-white/5 p-4 col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">Revenue performance</p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                    +14.7% QTD
                  </span>
                  <span className="text-[11px] text-white/50">
                    Full analysis ↗
                  </span>
                </div>
              </div>

              <div className="relative mt-3">
                <svg
                  viewBox="0 0 600 200"
                  preserveAspectRatio="none"
                  className="h-52 w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--highlight)"
                        stopOpacity="0.35"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--highlight)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {[40, 80, 120, 160].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="600"
                      y2={y}
                      className="stroke-white/10"
                      strokeWidth="1"
                    />
                  ))}

                  <path
                    d="M0 152 C40 144 60 128 90 132 C120 136 150 104 180 108 C210 112 240 74 270 82 C300 90 330 116 360 102 C390 88 420 50 450 58 C480 66 510 44 540 34 C570 24 590 30 600 24 L600 200 L0 200 Z"
                    fill="url(#hero-area)"
                  />
                  <path
                    d="M0 152 C40 144 60 128 90 132 C120 136 150 104 180 108 C210 112 240 74 270 82 C300 90 330 116 360 102 C390 88 420 50 450 58 C480 66 510 44 540 34 C570 24 590 30 600 24"
                    fill="none"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="stroke-highlight"
                  />
                  <motion.path
                    d="M0 152 C40 144 60 128 90 132 C120 136 150 104 180 108 C210 112 240 74 270 82 C300 90 330 116 360 102 C390 88 420 50 450 58 C480 66 510 44 540 34 C570 24 590 30 600 24"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray="18 82"
                    className="stroke-white"
                    animate={reduceMotion ? undefined : { strokeDashoffset: [124, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                  <path
                    d="M0 168 C60 160 120 156 180 150 C240 144 300 140 360 134 C420 128 480 122 540 114 C560 112 580 110 600 108"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    className="stroke-info"
                  />
                </svg>

                <div className="mt-2 flex items-center gap-4 text-[11px] text-white/60">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-highlight" />
                    Your revenue
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-info" />
                    Target
                  </span>
                </div>
              </div>

              <div className="absolute right-4 bottom-4 w-60">
                <AiSummary />
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium">Revenue mix</p>

              <div className="mt-3 flex justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="size-40"
                  aria-hidden="true"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeWidth="14"
                    className="stroke-white/10"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeWidth="14"
                    transform="rotate(-90 50 50)"
                    className="stroke-chart-2"
                    animate={
                      reduceMotion
                        ? undefined
                        : { strokeDasharray: ["130.6 251.2", "118 251.2", "130.6 251.2"] }
                    }
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeWidth="14"
                    transform="rotate(97.2 50 50)"
                    className="stroke-info"
                    animate={
                      reduceMotion
                        ? undefined
                        : { strokeDasharray: ["70.3 251.2", "82 251.2", "70.3 251.2"] }
                    }
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeWidth="14"
                    transform="rotate(198 50 50)"
                    className="stroke-warning"
                    animate={
                      reduceMotion
                        ? undefined
                        : { strokeDasharray: ["50.2 251.2", "60 251.2", "50.2 251.2"] }
                    }
                    transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <text
                    x="50"
                    y="48"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white font-heading text-lg font-semibold"
                  >
                    3
                  </text>
                  <text
                    x="50"
                    y="62"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white/50 text-[8px]"
                  >
                    streams
                  </text>
                </svg>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {REVENUE_MIX.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2 text-white/70">
                      <span
                        className={cn(
                          "size-2 rounded-full animate-pulse-soft motion-reduce:animate-none",
                          item.className,
                        )}
                      />
                      {item.label}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-white">{item.value}</span>
                      <span className="w-8 text-right text-white/50">
                        {item.share}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-3">
            {MINI_STATS.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/5 p-3"
              >
                <p className="text-[11px] text-white/50">{item.label}</p>
                <p className="mt-1 font-heading text-lg font-semibold">
                  <LiveNumber {...item.live} />
                </p>
                <p className="text-[11px] text-white/40">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-highlight text-xs font-semibold text-highlight-foreground">
                SA
              </span>
              <div>
                <p className="text-xs font-medium">Sk Alamin</p>
                <p className="text-[11px] text-white/50">Owner</p>
              </div>
            </div>
            <span className="rounded-full bg-highlight/20 px-2 py-0.5 text-[11px] font-medium text-highlight">
              Pro
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
