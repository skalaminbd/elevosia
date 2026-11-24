"use client";

import { useEffect, useState } from "react";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { Clock, Eye, Play, Square } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function TaskActions({
  status,
  visible,
  logged,
  estimate,
  assignee,
  onTake,
  onStatusChange,
}: {
  status: string;
  visible: boolean;
  logged: number;
  estimate: number;
  assignee: string;
  onTake: () => void;
  onStatusChange?: (status: string) => void;
}) {
  const [value, setValue] = useState(status);
  const [clientVisible, setClientVisible] = useState(visible);
  const [hours, setHours] = useState(logged);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setElapsed((current) => current + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  function toggleTimer() {
    if (!running) {
      setElapsed(0);
      setRunning(true);
      return;
    }
    const added = Math.max(0.1, Math.round((elapsed / 3600) * 10) / 10);
    setHours((current) => Math.min(estimate, Number((current + added).toFixed(1))));
    setRunning(false);
    setElapsed(0);
  }

  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(
    elapsed % 60,
  ).padStart(2, "0")}`;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5">
        <p className="text-xs font-semibold">Status</p>
        <NativeSelect
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            onStatusChange?.(event.target.value);
          }}
          aria-label="Task status"
          className="mt-2 h-9 w-full rounded-md border border-input bg-card px-2.5 text-xs outline-none focus-visible:border-ring"
        >
          <option value="todo">To do</option>
          <option value="progress" disabled={!assignee}>
            In progress
          </option>
          <option value="review">In review</option>
          <option value="done">Done</option>
        </NativeSelect>
        {!assignee ? (
          <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-secondary/60 px-2 py-1.5">
            <span className="text-[11px] text-muted-foreground">
              Assign an owner before starting.
            </span>
            <Button variant="outline" size="sm" onClick={onTake}>
              Take task
            </Button>
          </div>
        ) : null}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Client board</span>
          <StatusBadge tone={clientVisible ? "accent" : "neutral"}>
            {value === "todo" ? "Not shown" : clientVisible ? "Shows when started" : "Hidden"}
          </StatusBadge>
        </div>

        <div className="mt-4 flex items-start gap-2 border-t border-border pt-3">
          <Checkbox
            id="client-visible"
            checked={clientVisible}
            onCheckedChange={(checked) => setClientVisible(checked === true)}
          />
          <div>
            <Label htmlFor="client-visible" className="text-xs font-medium">
              Client-visible
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Shows on the client&apos;s weekly board once started.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">Time</p>
          <span
            className={
              running
                ? "font-mono text-[10px] tabular-nums text-success"
                : "font-mono text-[10px] text-muted-foreground"
            }
          >
            {running ? `Running ${clock}` : `${hours}/${estimate} h`}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <span
            className="block h-full rounded-full bg-primary"
            style={{ width: `${Math.min(100, (hours / Math.max(1, estimate)) * 100)}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button variant={running ? "default" : "outline"} size="sm" onClick={toggleTimer}>
            {running ? (
              <Square className="size-3.5" aria-hidden="true" />
            ) : (
              <Play className="size-3.5" aria-hidden="true" />
            )}
            {running ? "Stop and log" : "Start timer"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHours((current) => Math.min(estimate, current + 0.5))}
          >
            <Clock className="size-3.5" aria-hidden="true" />
            Log 0.5 h
          </Button>
        </div>
        <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Eye className="size-3" aria-hidden="true" />
          Client never sees internal checks or comments.
        </p>
      </div>
    </div>
  );
}
