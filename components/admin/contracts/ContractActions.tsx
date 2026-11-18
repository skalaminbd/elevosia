"use client";

import { useState } from "react";
import { Bell, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContractActions({ status }: { status: string }) {
  const [stage, setStage] = useState(status);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-semibold">Actions</p>
      <p className="mt-1 text-xs text-muted-foreground">Status: {stage}</p>
      <div className="mt-3 space-y-2">
        {stage === "Draft" ? (
          <Button className="w-full" onClick={() => setStage("Sent")}>
            <Send className="size-4" aria-hidden="true" />
            Send for signature
          </Button>
        ) : null}
        {stage === "Sent" ? (
          <>
            <Button variant="outline" className="w-full">
              <Bell className="size-4" aria-hidden="true" />
              Send reminder
            </Button>
            <Button className="w-full" onClick={() => setStage("Signed")}>
              <Check className="size-4" aria-hidden="true" />
              Mark signed (sample)
            </Button>
          </>
        ) : null}
        {stage === "Signed" ? (
          <p className="flex items-center gap-1.5 text-xs text-success">
            <Check className="size-3.5" aria-hidden="true" />
            Signed and stored with the project files.
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        E-signature links expire after 7 days. Signed files are read only.
      </p>
    </div>
  );
}
