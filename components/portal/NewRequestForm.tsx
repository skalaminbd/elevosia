"use client";

import { useState } from "react";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createWorkRequest } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";

type RetainerSummary = { plan: string; hours: number; used: number };

export function NewRequestForm({
  plain = false,
  onDone,
  retainer,
}: {
  plain?: boolean;
  onDone?: () => void;
  retainer: RetainerSummary;
}) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [project, setProject] = useState("Care dashboard and client portal");
  const [priority, setPriority] = useState("Normal");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-lg border border-success/30 bg-card p-6 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-3 font-heading text-lg font-semibold">Request sent</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your PM replies with an estimate in hours. Accepted work uses your care plan
          hours first.
        </p>
        {onDone ? (
          <Button type="button" onClick={onDone} className="mt-4">
            Done
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className={plain ? undefined : "rounded-lg border border-border bg-card p-5"}
      onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim() || !detail.trim() || saving) return;
        setSaving(true);
        void createWorkRequest({ title, detail }).then((result) => {
          setSaving(false);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          setSubmitted(true);
        });
      }}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="request-title" className="text-xs font-medium">
            Title
          </Label>
          <input
            id="request-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="A short name for the work"
            className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="request-project" className="text-xs font-medium">
              Project
            </Label>
            <NativeSelect
              id="request-project"
              value={project}
              onChange={(event) => setProject(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option>Care dashboard and client portal</option>
              <option>Online booking</option>
            </NativeSelect>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="request-priority" className="text-xs font-medium">
              Priority
            </Label>
            <NativeSelect
              id="request-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option>Normal</option>
              <option>Urgent</option>
              <option>Low</option>
            </NativeSelect>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="request-detail" className="text-xs font-medium">
            What do you need?
          </Label>
          <textarea
            id="request-detail"
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            rows={5}
            className="w-full resize-none rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Uses your {retainer.plan} hours first. {retainer.hours - retainer.used} h
          left this month.
        </p>
        <Button type="submit" disabled={!title.trim() || !detail.trim() || saving}>
          {saving ? "Sending…" : "Send request"}
        </Button>
      </div>
    </form>
  );
}
