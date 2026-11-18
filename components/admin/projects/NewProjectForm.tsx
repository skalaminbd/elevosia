"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const MODULES = ["Scheduling", "Client CRM", "Care plans", "Invoicing", "Client portal", "Reports"];

export function NewProjectForm() {
  const [fromBlueprint, setFromBlueprint] = useState("BP-309");
  const [name, setName] = useState("Care dashboard and client portal");
  const [pm, setPm] = useState("Alamin");
  const [start, setStart] = useState("2026-11-24");
  const [modules, setModules] = useState<string[]>(["Scheduling", "Client CRM", "Invoicing", "Client portal"]);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-success/30 bg-card p-6 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-3 font-heading text-lg font-semibold">Project created</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {name} starts on {start}. The weekly board and milestones come from the
          approved Blueprint.
        </p>
        <Button asChild className="mt-4" size="sm">
          <Link href="/admin/projects">Back to projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      className="rounded-lg border border-border bg-card p-5 lg:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!name.trim()) return;
        setSaved(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="from" className="text-xs font-medium">Start from</Label>
          <select id="from" value={fromBlueprint} onChange={(e) => setFromBlueprint(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring">
            <option value="BP-309">BP-309 · Brightline Care · Approved · $16,000</option>
            <option value="internal">Internal project (no Blueprint)</option>
          </select>
          <p className="text-[11px] text-muted-foreground">
            Only approved Blueprints can become projects.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-name" className="text-xs font-medium">Project name</Label>
          <input id="p-name" value={name} onChange={(e) => setName(e.target.value)} required className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-pm" className="text-xs font-medium">Project manager</Label>
          <select id="p-pm" value={pm} onChange={(e) => setPm(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring">
            <option>Alamin</option>
            <option>Maya</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-start" className="text-xs font-medium">Start date</Label>
          <input id="p-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring" />
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-semibold">Modules in scope</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {MODULES.map((module) => {
            const on = modules.includes(module);
            return (
              <button
                key={module}
                type="button"
                onClick={() =>
                  setModules((current) =>
                    current.includes(module)
                      ? current.filter((item) => item !== module)
                      : [...current, module],
                  )
                }
                aria-pressed={on}
                className={on ? "h-8 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground" : "h-8 rounded-full bg-secondary px-3 text-xs font-medium text-muted-foreground hover:text-foreground"}
              >
                {module}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Button type="submit" disabled={!name.trim()}>Create project</Button>
        <Button asChild variant="outline">
          <Link href="/admin/projects">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
