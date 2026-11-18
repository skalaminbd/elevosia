"use client";

import { useState } from "react";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { Clock, Eye } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function TaskActions({
  status,
  visible,
  logged,
  estimate,
}: {
  status: string;
  visible: boolean;
  logged: number;
  estimate: number;
}) {
  const [value, setValue] = useState(status);
  const [clientVisible, setClientVisible] = useState(visible);
  const [hours, setHours] = useState(logged);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5">
        <p className="text-xs font-semibold">Status</p>
        <NativeSelect
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="Task status"
          className="mt-2 h-9 w-full rounded-md border border-input bg-card px-2.5 text-xs outline-none focus-visible:border-ring"
        >
          <option value="todo">To do</option>
          <option value="progress">In progress</option>
          <option value="review">In review</option>
          <option value="done">Done</option>
        </NativeSelect>
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
          <span className="font-mono text-[10px] text-muted-foreground">{hours}/{estimate} h</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <span
            className="block h-full rounded-full bg-primary"
            style={{ width: `${Math.min(100, (hours / Math.max(1, estimate)) * 100)}%` }}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => setHours((current) => Math.min(estimate, current + 0.5))}
        >
          <Clock className="size-3.5" aria-hidden="true" />
          Log 0.5 h
        </Button>
        <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Eye className="size-3" aria-hidden="true" />
          Client never sees internal checks or comments.
        </p>
      </div>
    </div>
  );
}
