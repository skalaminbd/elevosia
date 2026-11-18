"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BlueprintActions({ status }: { status: string }) {
  const [sent, setSent] = useState(false);
  const locked = status === "Approved" || status === "Expired";

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold">Next step</h2>
        <p className="text-xs text-muted-foreground">{status}</p>
      </div>
      <div className="space-y-3 p-5">
        {locked ? (
          <p className="text-xs text-muted-foreground">
            This version is locked. Create a new version to change the plan.
          </p>
        ) : sent ? (
          <p className="flex items-center gap-1.5 text-xs text-success">
            <Check className="size-3.5" aria-hidden="true" />
            Sent. The client sees it under Approvals.
          </p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              Sending locks the requirements and starts the client approval clock.
            </p>
            <Button className="w-full" onClick={() => setSent(true)}>
              <Send className="size-4" aria-hidden="true" />
              Send to client
            </Button>
          </>
        )}
        <p className="text-[11px] text-muted-foreground">
          Valid until the date shown. Expired Blueprints can be reissued as a new
          version.
        </p>
      </div>
    </div>
  );
}
