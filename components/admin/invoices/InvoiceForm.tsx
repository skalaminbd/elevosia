"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function InvoiceForm() {
  const [client, setClient] = useState("Brightline Care");
  const [kind, setKind] = useState("Milestone");
  const [amount, setAmount] = useState("4800");
  const [due, setDue] = useState("2026-12-02");
  const [send, setSend] = useState(true);
  const [created, setCreated] = useState(false);

  if (created) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-success/30 bg-card p-6 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-3 font-heading text-lg font-semibold">Invoice created</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {send
            ? `${client} has been sent the invoice in this sample.`
            : "Saved as a draft. Send it when you are ready."}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/invoices">All invoices</Link>
          </Button>
        </div>
      </div>
    );
  }

  const valid = Number(amount) > 0 && due;

  return (
    <form
      className="rounded-lg border border-border bg-card p-5 lg:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!valid) return;
        setCreated(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="inv-client" className="text-xs font-medium">Client</Label>
          <select id="inv-client" value={client} onChange={(e) => setClient(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring">
            {["Brightline Care", "Lumen Studio", "Northwind HVAC", "Harbor Therapy", "Ridgeline Cleaning", "Cedarbrook Schools"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="inv-kind" className="text-xs font-medium">Type</Label>
          <select id="inv-kind" value={kind} onChange={(e) => setKind(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring">
            {["Milestone", "Care plan", "Retainer", "Change request", "Custom"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="inv-amount" className="text-xs font-medium">Amount (USD)</Label>
          <input id="inv-amount" type="number" min={0} step={50} value={amount} onChange={(e) => setAmount(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 font-mono text-sm outline-none focus-visible:border-ring" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="inv-due" className="text-xs font-medium">Due date</Label>
          <input id="inv-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="inv-description" className="text-xs font-medium">Description</Label>
          <input id="inv-description" defaultValue="Milestone 3 of 3 · care dashboard" className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring" />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 border-t border-border pt-4">
        <Checkbox id="inv-send" checked={send} onCheckedChange={(value) => setSend(value === true)} />
        <div>
          <Label htmlFor="inv-send" className="text-sm font-medium">Send after creating</Label>
          <p className="text-xs text-muted-foreground">
            The client gets an email and sees it in the portal.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Button type="submit" disabled={!valid}>Create invoice</Button>
        <Button asChild variant="outline">
          <Link href="/admin/invoices">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
