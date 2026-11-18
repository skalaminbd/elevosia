"use client";

import { useState } from "react";
import { Bell, Check, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InvoiceActions({ status }: { status: string }) {
  const [stage, setStage] = useState(status);
  const [reminded, setReminded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-semibold">Actions</p>
      <p className="mt-1 text-xs text-muted-foreground">Status: {stage}</p>
      <div className="mt-3 space-y-2">
        {stage !== "Paid" ? (
          <>
            <Button className="w-full" onClick={() => setStage("Paid")}>
              <Check className="size-4" aria-hidden="true" />
              Record payment
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={reminded}
              onClick={() => setReminded(true)}
            >
              <Bell className="size-4" aria-hidden="true" />
              {reminded ? "Reminder sent" : "Send reminder now"}
            </Button>
          </>
        ) : (
          <>
            <p className="flex items-center gap-1.5 text-xs text-success">
              <Check className="size-3.5" aria-hidden="true" />
              Paid in this sample.
            </p>
            <Button variant="outline" className="w-full" onClick={() => setStage("Refunded")}>
              <Undo2 className="size-4" aria-hidden="true" />
              Refund
            </Button>
          </>
        )}
        {stage === "Refunded" ? (
          <p className="text-xs text-muted-foreground">Refund queued. Stripe handles the timing.</p>
        ) : null}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Manual payments cover checks and wires. Everything is logged.
      </p>
    </div>
  );
}
