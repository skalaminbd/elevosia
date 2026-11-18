"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ITEMS = [
  "All accounts are in the client's name",
  "Credentials handed over and rotated",
  "Final files shared in the portal",
  "Final invoice paid",
  "All milestones approved",
];

export function HandoverChecklist() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [complete, setComplete] = useState(false);
  const remaining = ITEMS.filter((_, index) => !done[index]).length;

  if (complete) {
    return (
      <div className="rounded-lg border border-success/30 bg-card p-6 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-3 font-heading text-lg font-semibold">Handover complete</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The project can now be closed. Data stays available in the portal.
        </p>
        <Link href="/admin/projects/brightline-portal" className="mt-4 inline-flex text-xs font-medium text-primary hover:underline">
          Back to project
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">Handover checklist</p>
        <span className="font-mono text-[10px] text-muted-foreground">
          {ITEMS.length - remaining}/{ITEMS.length}
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {ITEMS.map((item, index) => (
          <li key={item} className="flex items-start gap-2.5">
            <Checkbox
              id={`handover-${index}`}
              checked={Boolean(done[index])}
              onCheckedChange={(value) =>
                setDone((current) => ({ ...current, [index]: value === true }))
              }
              className="mt-0.5"
            />
            <Label htmlFor={`handover-${index}`} className="text-sm font-normal">
              {item}
            </Label>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={remaining > 0}
        onClick={() => setComplete(true)}
        className="mt-5 h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground disabled:opacity-40"
      >
        Complete handover
      </button>
      <p className="mt-2 text-[11px] text-muted-foreground">
        {remaining > 0
          ? `${remaining} item${remaining > 1 ? "s" : ""} left.`
          : "Everything checked. You can complete the handover."}
      </p>
    </div>
  );
}
