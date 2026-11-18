"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { retainer } from "@/lib/portal-data";

export function NewRequestForm({
  plain = false,
  onDone,
}: { plain?: boolean; onDone?: () => void } = {}) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [project, setProject] = useState("Care dashboard and client portal");
  const [priority, setPriority] = useState("Normal");
  const [submitted, setSubmitted] = useState(false);

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
          <button
            type="button"
            onClick={onDone}
            className="mt-4 h-9 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground"
          >
            Done
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className={plain ? undefined : "rounded-lg border border-border bg-card p-5"}
      onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim() || !detail.trim()) return;
        setSubmitted(true);
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
            <select
              id="request-project"
              value={project}
              onChange={(event) => setProject(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option>Care dashboard and client portal</option>
              <option>Online booking</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="request-priority" className="text-xs font-medium">
              Priority
            </Label>
            <select
              id="request-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option>Normal</option>
              <option>Urgent</option>
              <option>Low</option>
            </select>
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
        <button
          type="submit"
          disabled={!title.trim() || !detail.trim()}
          className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-40"
        >
          Send request
        </button>
      </div>
    </form>
  );
}
