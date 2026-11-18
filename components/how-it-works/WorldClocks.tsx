"use client";

import { useEffect, useState } from "react";
import { timeZones } from "@/content/how-it-works";

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
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0,
  );
  return hour * 60 + minute;
}

/**
 * Four real clocks and the overlap window, ticking against Dhaka time.
 */
export function WorldClocks() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
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
    <div className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-md">
      <div className="grid grid-cols-2 gap-4">
        {timeZones.clocks.map((clock) => (
          <div key={clock.id}>
            <p className="text-xs text-muted-foreground">{clock.label}</p>
            <p className="mt-1 font-mono text-lg font-semibold text-foreground">
              {now ? timeIn(clock.timeZone, now) : "--:--"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="relative h-2 rounded-full bg-muted">
          <div
            className="absolute inset-y-0 rounded-full bg-primary/25"
            style={{
              left: `${(OVERLAP_START_HOUR / 24) * 100}%`,
              width: `${((OVERLAP_END_HOUR - OVERLAP_START_HOUR) / 24) * 100}%`,
            }}
          />
          {now ? (
            <span
              aria-hidden="true"
              className="absolute -top-1 bottom-1 w-0.5 rounded-full bg-primary"
              style={{ left: `${position}%` }}
            >
              <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary" />
            </span>
          ) : null}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>12am</span>
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
          <span>12am</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        The lit window is when we are live for US mornings, in Dhaka time.
      </p>
    </div>
  );
}
