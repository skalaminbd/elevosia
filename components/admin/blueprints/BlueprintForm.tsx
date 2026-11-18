"use client";

import { useEffect, useState } from "react";
import { NativeSelect } from "@/components/shared/NativeSelect";
import Link from "next/link";
import { Check, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function BlueprintForm({
  requirementId: initialRequirement,
  plain = false,
  onDone,
}: {
  requirementId?: string;
  plain?: boolean;
  onDone?: () => void;
} = {}) {
  const [requirementId, setRequirementId] = useState<string | null>(initialRequirement ?? null);
  const [client, setClient] = useState("Clearwater Fund");
  const [title, setTitle] = useState(initialRequirement ? "Donor CRM and impact reporting" : "");
  const [price, setPrice] = useState("28000");
  const [terms, setTerms] = useState("Service agreement");
  const [validUntil, setValidUntil] = useState("2026-12-19");
  const [milestones, setMilestones] = useState(["Foundation", "Donors and members", "Applications", "Reporting", "Launch"]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialRequirement) return;
    const wanted = new URLSearchParams(window.location.search).get("requirement");
    if (!wanted) return;
    const frame = window.requestAnimationFrame(() => {
      setRequirementId(wanted);
      setTitle((current) => current || "Donor CRM and impact reporting");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialRequirement]);

  if (saved) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-success/30 bg-card p-6 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-3 font-heading text-lg font-semibold">Draft Blueprint created</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {title || "The Blueprint"} for {client} is a draft. Review the margin, then send
          it to the client.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {onDone ? (
            <Button onClick={onDone}>
              Done
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link href="/admin/blueprints">All Blueprints</Link>
          </Button>
          {!onDone ? (
            <Button asChild>
              <Link href="/admin/blueprints/BP-311">Open a Blueprint</Link>
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  const valid = title.trim() && Number(price) > 0;

  return (
    <form
      className={plain ? undefined : "rounded-lg border border-border bg-card p-5 lg:p-6"}
      onSubmit={(event) => {
        event.preventDefault();
        if (!valid) return;
        setSaved(true);
      }}
    >
      {requirementId ? (
        <p className="mb-4 rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
          Created from {requirementId}. Every point is copied into the tasks below.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="bp-client" className="text-xs font-medium">Client</Label>
          <NativeSelect id="bp-client" value={client} onChange={(e) => setClient(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring">
            {["Clearwater Fund", "Cedarbrook Schools", "Lumen Studio", "Brightline Care", "Northwind HVAC"].map((item) => <option key={item}>{item}</option>)}
          </NativeSelect>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bp-title" className="text-xs font-medium">Project name</Label>
          <input id="bp-title" value={title} onChange={(e) => setTitle(e.target.value)} required className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bp-price" className="text-xs font-medium">Fixed price (USD)</Label>
          <input id="bp-price" type="number" min={0} step={500} value={price} onChange={(e) => setPrice(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 font-mono text-sm outline-none focus-visible:border-ring" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bp-terms" className="text-xs font-medium">Terms template</Label>
          <NativeSelect id="bp-terms" value={terms} onChange={(e) => setTerms(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring">
            {["Service agreement", "Retainer agreement", "Custom"].map((item) => <option key={item}>{item}</option>)}
          </NativeSelect>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bp-valid" className="text-xs font-medium">Valid until</Label>
          <input id="bp-valid" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bp-deposit" className="text-xs font-medium">Payment schedule</Label>
          <NativeSelect id="bp-deposit" className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring">
            <option>40% deposit, 30% demo, 30% launch</option>
            <option>Monthly installments</option>
            <option>Paid in full</option>
          </NativeSelect>
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">Milestones</p>
          <button
            type="button"
            onClick={() => setMilestones((current) => [...current, `Milestone ${current.length + 1}`])}
            className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-primary hover:bg-primary/5"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Add milestone
          </button>
        </div>
        <ul className="mt-2 space-y-2">
          {milestones.map((milestone, index) => (
            <li key={`${milestone}-${index}`} className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[10px] text-muted-foreground">
                {index + 1}
              </span>
              <input
                value={milestone}
                onChange={(event) =>
                  setMilestones((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)),
                  )
                }
                aria-label={`Milestone ${index + 1}`}
                className="h-9 min-w-0 flex-1 rounded-md border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring"
              />
              <button
                type="button"
                onClick={() => setMilestones((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                aria-label={`Remove milestone ${index + 1}`}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={!valid}>Save as draft</Button>
        <Button asChild variant="outline">
          <Link href="/admin/blueprints">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
