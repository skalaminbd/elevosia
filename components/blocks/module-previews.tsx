"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BadgeCheck,
  CalendarCheck,
  CircleCheck,
  Mail,
  MapPin,
  RefreshCw,
  Send,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PREVIEW_WIDTH = 400;
const PREVIEW_HEIGHT = 300;

function PreviewFrame({ children }: { children: React.ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new ResizeObserver(() => {
      setScale(Math.min(1, frame.clientWidth / PREVIEW_WIDTH));
    });

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className="relative mx-auto aspect-4/3 w-full max-w-100 overflow-hidden rounded-lg"
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Scene({
  children,
  floating,
}: {
  children: React.ReactNode;
  floating: React.ReactNode;
}) {
  return (
    <div className="relative h-75 w-100 p-4">
      <div className="h-full rounded-lg bg-card p-4 shadow-sm">{children}</div>
      <div className="absolute right-2 bottom-2">{floating}</div>
    </div>
  );
}

function FloatingCard({
  icon: Icon,
  title,
  meta,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  meta: string;
  tone: string;
}) {
  return (
    <div className="flex w-45 items-center gap-2 rounded-lg bg-card p-2.5 shadow-md">
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          tone,
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium">{title}</p>
        <p className="truncate text-[10px] text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

function StaffPreview() {
  return (
    <Scene
      floating={
        <FloatingCard
          icon={CircleCheck}
          title="Shift swap approved"
          meta="Jake ↔ Emily, Thu"
          tone="bg-success/15 text-success"
        />
      }
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium">This week</p>
        <span className="rounded-full bg-module-staff/15 px-2 py-0.5 text-[10px] text-module-staff">
          Mon to Fri
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {[
          {
            name: "Emily",
            bar: "Front desk",
            span: "col-start-1 col-span-2",
            color: "bg-module-staff text-white",
          },
          {
            name: "Jake",
            bar: "Field job",
            span: "col-start-2 col-span-2",
            color: "bg-module-bookings text-white",
          },
          {
            name: "Marcus",
            bar: "Install",
            span: "col-start-3 col-span-2",
            color: "bg-module-ai text-white",
          },
        ].map(({ name, bar, span, color }) => (
          <div key={name} className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-[10px] text-muted-foreground">
              {name}
            </span>
            <div className="grid flex-1 grid-cols-5 gap-1">
              <span
                className={cn(
                  "flex h-5 items-center rounded-full px-2 text-[10px] font-medium",
                  span,
                  color,
                )}
              >
                {bar}
              </span>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-[10px] text-muted-foreground">
            Sarah
          </span>
          <div className="grid flex-1 grid-cols-5 gap-1">
            <span className="col-span-4 flex h-5 items-center rounded-full bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_3px,var(--border)_3px,var(--border)_6px)] px-2 text-[10px] text-muted-foreground">
              Time off
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <span className="rounded-full bg-module-staff/10 px-2 py-1 text-[10px] text-module-staff">
          <CircleCheck className="mr-1 inline size-3" aria-hidden="true" />
          12 tasks today
        </span>
        <span className="rounded-full bg-module-staff/10 px-2 py-1 text-[10px] text-module-staff">
          9 on shift
        </span>
      </div>
    </Scene>
  );
}

function BookingsPreview() {
  return (
    <Scene
      floating={
        <FloatingCard
          icon={CalendarCheck}
          title="New booking"
          meta="Olivia Carter, 10:30 AM"
          tone="bg-module-bookings/15 text-module-bookings"
        />
      }
    >
      <p className="text-xs font-medium">Thu, Nov 19</p>

      <div className="mt-3 rounded-lg border border-border p-3">
        <p className="text-[10px] font-medium">AC Tune-Up</p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          60 min · $129
        </p>

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <span className="rounded-md border border-border px-2 py-1.5 text-center text-[10px]">
            9:00 AM
          </span>
          <span className="rounded-md bg-module-bookings px-2 py-1.5 text-center text-[10px] font-medium text-white">
            10:30 AM
          </span>
          <span className="rounded-md border border-border px-2 py-1.5 text-center text-[10px]">
            1:00 PM
          </span>
          <span className="rounded-md bg-muted px-2 py-1.5 text-center text-[10px] text-muted-foreground line-through">
            3:30 PM
          </span>
        </div>
      </div>
    </Scene>
  );
}

function ClientsPreview() {
  const clients = [
    { name: "Olivia Carter", status: "Active", tone: "bg-success/15 text-success" },
    { name: "Ryan Brooks", status: "Lead", tone: "bg-warning/15 text-warning" },
    { name: "Megan Hayes", status: "Active", tone: "bg-success/15 text-success" },
    { name: "Tyler Reed", status: "Lead", tone: "bg-warning/15 text-warning" },
  ];

  return (
    <Scene
      floating={
        <FloatingCard
          icon={Bell}
          title="3 follow-ups due today"
          meta="Olivia, Ryan, Tyler"
          tone="bg-module-clients/15 text-module-clients"
        />
      }
    >
      <p className="text-xs font-medium">Clients</p>

      <div className="mt-3 space-y-2">
        {clients.map(({ name, status, tone }) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-lg border border-border px-2.5 py-1.5"
          >
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-module-clients/15 text-[10px] font-medium text-module-clients">
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <span className="text-[10px]">{name}</span>
            </div>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px]", tone)}>
              {status}
            </span>
          </div>
        ))}
      </div>
    </Scene>
  );
}

function InvoicesPreview() {
  return (
    <Scene
      floating={
        <FloatingCard
          icon={RefreshCw}
          title="Synced to QuickBooks"
          meta="Just now"
          tone="bg-module-invoices/15 text-module-invoices"
        />
      }
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium">INV-1042</p>
        <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
          Paid
        </span>
      </div>

      <p className="mt-1 text-[10px] text-muted-foreground">
        Brooks Plumbing Co.
      </p>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span>Water heater install</span>
          <span>$980.00</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span>Parts and fittings</span>
          <span>$300.00</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
        <span className="text-[10px] text-muted-foreground">Total</span>
        <span className="text-xs font-semibold">$1,280</span>
      </div>

      <p className="mt-2 text-[10px] text-muted-foreground">
        Paid Nov 12 by card
      </p>
    </Scene>
  );
}

function ReportsPreview() {
  const bars = [40, 62, 48, 76, 58, 88];

  return (
    <Scene
      floating={
        <FloatingCard
          icon={Mail}
          title="Weekly report emailed"
          meta="Mon, 8:00 AM"
          tone="bg-module-reports/15 text-module-reports"
        />
      }
    >
      <p className="text-[10px] text-muted-foreground">Revenue this month</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-lg font-semibold">$48,200</p>
        <span className="text-[10px] font-medium text-success">+12%</span>
      </div>

      <div className="mt-3 flex h-16 items-end gap-2">
        {bars.map((height, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-sm bg-module-reports/80"
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-1 flex gap-2">
        {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((month) => (
          <span
            key={month}
            className="flex-1 text-center text-[8px] text-muted-foreground"
          >
            {month}
          </span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="rounded-md border border-border px-2 py-1.5">
          <p className="text-[10px] text-muted-foreground">Jobs done</p>
          <p className="text-[10px] font-medium">214</p>
        </div>
        <div className="rounded-md border border-border px-2 py-1.5">
          <p className="text-[10px] text-muted-foreground">Avg ticket</p>
          <p className="text-[10px] font-medium">$225</p>
        </div>
      </div>
    </Scene>
  );
}

function PortalPreview() {
  return (
    <Scene
      floating={
        <FloatingCard
          icon={BadgeCheck}
          title="Quote approved"
          meta="Megan Hayes, $860"
          tone="bg-module-portal/15 text-module-portal"
        />
      }
    >
      <div className="mx-auto flex h-full w-44 flex-col rounded-lg border border-border p-2.5">
        <p className="text-[10px] font-medium">Hi, Megan</p>

        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {["Book", "Pay", "Approve", "Message"].map((action) => (
            <span
              key={action}
              className="rounded-md bg-module-portal/10 px-2 py-2 text-center text-[10px] font-medium text-module-portal"
            >
              {action}
            </span>
          ))}
        </div>

        <p className="mt-auto text-[10px] text-muted-foreground">
          Next visit · Fri, 9:00 AM
        </p>
      </div>
    </Scene>
  );
}

function OperationsPreview() {
  const items = [
    { name: "HVAC filters", level: 18, low: true },
    { name: "Copper fittings", level: 72, low: false },
    { name: "Thermostats", level: 54, low: false },
  ];

  return (
    <Scene
      floating={
        <FloatingCard
          icon={Truck}
          title="Reorder sent to vendor"
          meta="Ferguson Supply"
          tone="bg-module-operations/15 text-module-operations"
        />
      }
    >
      <p className="text-xs font-medium">Inventory</p>

      <div className="mt-3 space-y-2.5">
        {items.map(({ name, level, low }) => (
          <div key={name}>
            <div className="flex items-center justify-between text-[10px]">
              <span>{name}</span>
              <span className={low ? "text-destructive" : "text-muted-foreground"}>
                {low ? "Low" : "OK"}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full",
                  low ? "bg-destructive" : "bg-success",
                )}
                style={{ width: `${level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <MapPin className="size-3" aria-hidden="true" />3 locations
      </div>
    </Scene>
  );
}

function AiPreview() {
  return (
    <Scene
      floating={
        <FloatingCard
          icon={Send}
          title="Reminders sent to 4 clients"
          meta="Just now"
          tone="bg-module-ai/15 text-module-ai"
        />
      }
    >
      <div className="flex h-full flex-col gap-2">
        <div className="ml-auto max-w-[75%] rounded-lg rounded-br-sm bg-module-ai px-2.5 py-2 text-[10px] text-white">
          Who hasn&apos;t paid this month?
        </div>

        <div className="max-w-[85%] rounded-lg rounded-bl-sm bg-muted px-2.5 py-2">
          <p className="text-[10px]">
            4 clients owe $3,240. Send reminders?
          </p>
          <div className="mt-1.5 flex gap-1.5">
            <span className="rounded-md bg-module-ai px-2 py-1 text-[10px] font-medium text-white">
              Send
            </span>
            <span className="rounded-md border border-border bg-card px-2 py-1 text-[10px]">
              Show list
            </span>
          </div>
        </div>
      </div>
    </Scene>
  );
}

const PREVIEWS: Record<string, () => React.JSX.Element> = {
  staff: StaffPreview,
  bookings: BookingsPreview,
  clients: ClientsPreview,
  invoices: InvoicesPreview,
  reports: ReportsPreview,
  portal: PortalPreview,
  operations: OperationsPreview,
  ai: AiPreview,
};

export function ModulePreview({ module }: { module: string }) {
  const Preview = PREVIEWS[module];

  if (!Preview) return null;

  return (
    <PreviewFrame>
      <Preview />
    </PreviewFrame>
  );
}
