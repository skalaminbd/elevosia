"use client";

import { useEffect, useState } from "react";
import { remote } from "@/content/home";

const OVERLAP_START_HOUR = 18;
const OVERLAP_END_HOUR = 22;

function timeIn(timeZone: string, now: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(now);
}

function minutesInDhaka(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

/**
 * Two real clocks plus a 24h bar where the overlap window is lit and a marker
 * tracks the current Dhaka minute. Ticks once a second, no rAF.
 */
export function RemoteClockBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Deferred one frame so the server and client first paint match, then ticks.
    const frame = window.requestAnimationFrame(() => setNow(new Date()));
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, []);

  const minutes = now ? minutesInDhaka(now) : null;
  const position = minutes === null ? 0 : (minutes / 1440) * 100;

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-6">
        {remote.clocks.map((clock) => (
          <div key={clock.id}>
            <p className="text-xs font-medium text-muted-foreground">
              {clock.label}
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold text-foreground">
              {now ? timeIn(clock.timeZone, now) : "--:--"}
            </p>
          </div>
        ))}

        <div className="text-right">
          <p className="text-xs font-medium text-muted-foreground">
            {remote.overlapLabel}
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-success">
            4h
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="relative h-2 rounded-full bg-muted">
          <div
            className="absolute inset-y-0 rounded-full bg-success/25"
            style={{
              left: `${(OVERLAP_START_HOUR / 24) * 100}%`,
              width: `${((OVERLAP_END_HOUR - OVERLAP_START_HOUR) / 24) * 100}%`,
            }}
          />
          {now ? (
            <span
              aria-hidden="true"
              className="absolute -top-1 bottom-1 w-0.5 rounded-full bg-highlight"
              style={{ left: `${position}%` }}
            >
              <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-highlight" />
            </span>
          ) : null}
        </div>

        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span className="font-mono">12am</span>
          <span className="font-mono">6am</span>
          <span className="font-mono">12pm</span>
          <span className="font-mono">6pm</span>
          <span className="font-mono">12am</span>
        </div>
      </div>
    </div>
  );
}
