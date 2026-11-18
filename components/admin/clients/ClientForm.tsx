"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { AdminClient } from "@/lib/admin-data";

export function ClientForm({
  mode,
  client,
  plain = false,
  onDone,
}: {
  mode: "new" | "edit";
  client?: AdminClient;
  plain?: boolean;
  onDone?: () => void;
}) {
  const [company, setCompany] = useState(client?.name ?? "");
  const [contact, setContact] = useState(client?.contact ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [industry, setIndustry] = useState(client?.industry ?? "Field services");
  const [status, setStatus] = useState<string>(client?.status ?? "Onboarding");
  const [pm, setPm] = useState(client?.pm ?? "Alamin");
  const [timezone, setTimezone] = useState(client?.timezone ?? "America/New_York");
  const [source, setSource] = useState(client?.source ?? "Website");
  const [hipaa, setHipaa] = useState(client?.industry === "Care");
  const [invite, setInvite] = useState(true);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-success/30 bg-card p-6 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-3 font-heading text-lg font-semibold">
          {mode === "new" ? "Client created" : "Changes saved"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "new"
            ? invite
              ? "A portal invite is on its way in this sample."
              : "No invite sent. You can invite them later."
            : "The profile is up to date in this sample."}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {onDone ? (
            <Button size="sm" onClick={onDone}>
              Done
            </Button>
          ) : null}
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/clients">Back to clients</Link>
          </Button>
          {mode === "edit" && client && !onDone ? (
            <Button asChild size="sm">
              <Link href={`/admin/clients/${client.id}`}>Open client</Link>
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  const valid = company.trim() && contact.trim() && email.includes("@");

  return (
    <form
      className={plain ? undefined : "rounded-lg border border-border bg-card p-5 lg:p-6"}
      onSubmit={(event) => {
        event.preventDefault();
        if (!valid) return;
        setSaved(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-xs font-medium">Company name</Label>
          <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact" className="text-xs font-medium">Main contact</Label>
          <input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} required className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium">Work email</Label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="industry" className="text-xs font-medium">Service type</Label>
          <select id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            {["Home care", "Field services", "Agency", "Nonprofit", "Care", "Cleaning", "Education", "Property"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status" className="text-xs font-medium">Status</Label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            {["Lead", "Onboarding", "Active", "Paused", "Former"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pm" className="text-xs font-medium">Assigned PM</Label>
          <select id="pm" value={pm} onChange={(e) => setPm(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            {["Alamin", "Maya"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="timezone" className="text-xs font-medium">Client time zone</Label>
          <select id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            <option value="America/New_York">US Eastern (ET)</option>
            <option value="America/Chicago">US Central (CT)</option>
            <option value="America/Denver">US Mountain (MT)</option>
            <option value="America/Los_Angeles">US Pacific (PT)</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="source" className="text-xs font-medium">Lead source</Label>
          <select id="source" value={source} onChange={(e) => setSource(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            {["Website", "Referral", "Google", "Event", "Outbound"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-border pt-4">
        <div className="flex items-start gap-2">
          <Checkbox id="hipaa" checked={hipaa} onCheckedChange={(value) => setHipaa(value === true)} />
          <div>
            <Label htmlFor="hipaa" className="text-sm font-medium">HIPAA mode</Label>
            <p className="text-xs text-muted-foreground">
              Turns AI off for this client and adds upload warnings.
            </p>
          </div>
        </div>
        {mode === "new" ? (
          <div className="flex items-start gap-2">
            <Checkbox id="invite" checked={invite} onCheckedChange={(value) => setInvite(value === true)} />
            <div>
              <Label htmlFor="invite" className="text-sm font-medium">Send a portal invite</Label>
              <p className="text-xs text-muted-foreground">
                The owner gets a set-password link that expires in 7 days.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={!valid}>
          {mode === "new" ? "Create client" : "Save changes"}
        </Button>
        <Button asChild variant="outline">
          <Link href={mode === "edit" && client ? `/admin/clients/${client.id}` : "/admin/clients"}>
            Cancel
          </Link>
        </Button>
      </div>
    </form>
  );
}
