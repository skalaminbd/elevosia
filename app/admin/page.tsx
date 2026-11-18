import { ArrowUpRight, Clock, LifeBuoy, Users } from "lucide-react";
import { getSidebarCounts } from "@/lib/admin/sidebar-counts";

const WAITING = [
  { client: "Brightline Care", item: "Week 3 approval", days: "2 days waiting" },
  { client: "Lumen Studio", item: "Change request", days: "1 day waiting" },
  { client: "Clearwater Fund", item: "Blueprint review", days: "Due Friday" },
  { client: "Northwind HVAC", item: "Contract signature", days: "3 days waiting" },
];

const TODAY = [
  { time: "9:30 am", title: "Brightline weekly", meta: "Sarah · care dashboard" },
  { time: "11:00 am", title: "Northwind launch", meta: "Dale · final checks" },
  { time: "2:00 pm", title: "Clearwater discovery", meta: "Tom · requirements" },
  { time: "4:30 pm", title: "Team review", meta: "Maya · weekly board" },
];

export default function AdminDashboardPage() {
  const counts = getSidebarCounts("admin");

  const stats = [
    {
      id: "projects",
      label: "Active projects",
      value: counts.projectsActive,
      note: "3 on schedule this week",
      icon: Users,
    },
    {
      id: "waiting",
      label: "Waiting on clients",
      value: WAITING.length,
      note: "Blueprints and approvals",
      icon: Clock,
    },
    {
      id: "tickets",
      label: "Open tickets",
      value: counts.ticketsOpen,
      note: `${counts.ticketsNearSla} near SLA`,
      icon: LifeBuoy,
    },
    {
      id: "revenue",
      label: "Revenue this month",
      value: 42800,
      note: "3 invoices overdue",
      icon: ArrowUpRight,
      money: true,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Wednesday 19 November</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Good morning, Alamin
          </h1>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
          Sample workspace
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold tabular-nums">
                {stat.money
                  ? `$${stat.value.toLocaleString("en-US")}`
                  : stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.note}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <section className="rounded-lg border border-border bg-card xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Waiting on clients</h2>
              <p className="text-xs text-muted-foreground">
                Blueprints, approvals and contracts with no answer yet
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">4</span>
          </div>
          <ul>
            {WAITING.map((row, index) => (
              <li
                key={row.client}
                className={`flex items-center gap-4 px-5 py-3.5 ${
                  index > 0 ? "border-t border-border" : ""
                }`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[10px] font-semibold text-muted-foreground">
                  {row.client
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{row.client}</p>
                  <p className="text-xs text-muted-foreground">{row.item}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {row.days}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Today</h2>
            <span className="font-mono text-xs text-muted-foreground">
              4 calls
            </span>
          </div>
          <ul className="p-2">
            {TODAY.map((call) => (
              <li
                key={call.time}
                className="flex gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-secondary/60"
              >
                <span className="w-14 shrink-0 font-mono text-[11px] text-muted-foreground">
                  {call.time}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{call.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {call.meta}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
