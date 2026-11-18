"use client";

import { useState } from "react";
import { Check, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RequestActions({ status }: { status: string }) {
  const [stage, setStage] = useState(status);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-semibold">Actions</p>
      <div className="mt-3 space-y-2">
        {stage === "Submitted" ? (
          <>
            <Button className="w-full" onClick={() => setStage("Accepted")}>
              <Check className="size-4" aria-hidden="true" />
              Accept as task
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setStage("Converted")}>
              <FileText className="size-4" aria-hidden="true" />
              Convert to requirements
            </Button>
            <Button variant="destructive" className="w-full" onClick={() => setStage("Declined")}>
              <X className="size-4" aria-hidden="true" />
              Decline
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {stage === "Accepted"
              ? "Accepted. It now uses care plan hours and shows as a task in the project."
              : stage === "Converted"
                ? "Converted to a new requirements submission."
                : "Declined. The client can see the PM's reason."}
          </p>
        )}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Work requests never bypass the Blueprint for new scope.
      </p>
    </div>
  );
}
