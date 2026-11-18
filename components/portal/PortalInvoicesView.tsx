"use client";

import { useState } from "react";
import { Check, CreditCard, Landmark } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { portalInvoices, portalBlueprint, retainer } from "@/lib/portal-data";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function PortalInvoicesView() {
  const [paid, setPaid] = useState<Record<string, boolean>>({});
  const [paying, setPaying] = useState<string | null>(null);
  const [autoPay, setAutoPay] = useState(false);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const active = portalInvoices.find((invoice) => invoice.id === paying);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">Invoices</h2>
            <p className="text-xs text-muted-foreground">All projects</p>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            {portalInvoices.length} invoices
          </span>
        </div>
        <ul className="divide-y divide-border">
          {portalInvoices.map((invoice) => {
            const isPaid = paid[invoice.id] || invoice.status === "Paid";
            return (
              <li
                key={invoice.id}
                className="flex flex-wrap items-center gap-3 px-5 py-3.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{invoice.id}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {invoice.project} · {invoice.kind}
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold tabular-nums">
                  ${invoice.amount.toLocaleString("en-US")}
                </span>
                <span className="hidden text-xs text-muted-foreground sm:block">
                  {invoice.due}
                </span>
                {isPaid ? (
                  <StatusBadge tone="success">
                    <Check className="size-3" aria-hidden="true" />
                    Paid
                  </StatusBadge>
                ) : (
                  <div className="flex items-center gap-2">
                    <StatusBadge tone="warning">Due</StatusBadge>
                    <Button onClick={() => setPaying(invoice.id)}>
                      Pay now
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {active ? (
          <form
            className="border-t border-border bg-secondary/30 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              setPaid((current) => ({ ...current, [active.id]: true }));
              setConfirmed(active.id);
              setPaying(null);
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">
                  Pay {active.id} · ${active.amount.toLocaleString("en-US")}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Sample checkout. No payment is taken.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPaying(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <label className="flex flex-1 cursor-pointer items-center gap-2.5 rounded-lg border border-primary/40 bg-card px-3 py-2.5 text-sm">
                <input type="radio" name="method" defaultChecked className="sr-only" />
                <CreditCard className="size-4 text-primary" aria-hidden="true" />
                Card ending 4242
                <span className="ml-auto text-[10px] text-muted-foreground">Default</span>
              </label>
              <label className="flex flex-1 cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground">
                <input type="radio" name="method" className="sr-only" />
                <Landmark className="size-4" aria-hidden="true" />
                Bank transfer
              </label>
            </div>
            <Button type="submit" className="mt-3">
              Confirm payment
            </Button>
          </form>
        ) : null}

        {confirmed ? (
          <p className="flex items-center gap-1.5 border-t border-border px-5 py-3 text-xs text-success">
            <Check className="size-3.5" aria-hidden="true" />
            Paid {confirmed} in this sample. No money moved.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Payment plan</h2>
            <p className="text-xs text-muted-foreground">
              {portalBlueprint.title}
            </p>
          </div>
          <ul className="divide-y divide-border">
            {portalBlueprint.schedule.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.due}</p>
                </div>
                <span className="font-mono text-xs font-semibold">
                  ${item.amount.toLocaleString("en-US")}
                </span>
                <StatusBadge tone={item.state === "Paid" ? "success" : "neutral"}>
                  {item.state}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">{retainer.plan}</h2>
            <p className="text-xs text-muted-foreground">
              ${retainer.price}/mo · renews {retainer.next}
            </p>
          </div>
          <div className="p-5">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-2xl font-semibold tabular-nums">
                {retainer.used} h
              </p>
              <p className="text-xs text-muted-foreground">
                of {retainer.hours} h used
              </p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <span
                className="block h-full rounded-full bg-primary"
                style={{ width: `${(retainer.used / retainer.hours) * 100}%` }}
              />
            </div>
            <ul className="mt-4 space-y-2 border-t border-border pt-3">
              {retainer.work.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-xs">
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">
                    {item.title}
                  </span>
                  <span className="font-mono text-muted-foreground">{item.hours} h</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] text-muted-foreground">{retainer.sla}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-5 py-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="autopay"
            checked={autoPay}
            onCheckedChange={(value) => setAutoPay(value === true)}
            className="mt-0.5"
          />
          <div>
            <Label htmlFor="autopay" className="text-sm font-medium">
              Auto-pay future invoices
            </Label>
            <p className="text-xs text-muted-foreground">
              Uses the card ending 4242. You can turn it off any time.
            </p>
          </div>
        </div>
        <span
          className={cn(
            "text-[10px] font-medium",
            autoPay ? "text-success" : "text-muted-foreground",
          )}
        >
          {autoPay ? "On" : "Off"}
        </span>
      </div>
    </div>
  );
}
