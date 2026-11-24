"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ListPlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChangeActions({ projectId }: { projectId?: string }) {
  const [stage, setStage] = useState<"draft" | "sent" | "approved">("draft");

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-semibold">Actions</p>
      <div className="mt-3 space-y-2">
        {stage === "draft" ? (
          <Button className="w-full" onClick={() => setStage("sent")}>
            <Send className="size-4" aria-hidden="true" />
            Send to client
          </Button>
        ) : null}
        {stage === "sent" ? (
          <>
            <p className="text-xs text-muted-foreground">
              Waiting for the client to approve the scope and price.
            </p>
            <Button className="w-full" onClick={() => setStage("approved")}>
              <Check className="size-4" aria-hidden="true" />
              Mark approved (sample)
            </Button>
          </>
        ) : null}
        {stage === "approved" ? (
          <>
            <p className="flex items-center gap-1.5 text-xs text-success">
              <Check className="size-3.5" aria-hidden="true" />
              Approved. This adds {3} days and creates the change invoice.
            </p>
            {projectId ? (
              <Button asChild variant="outline" className="w-full">
                <Link
                  href={`/admin/projects/${projectId}?tab=milestones`}
                >
                  <ListPlus className="size-4" aria-hidden="true" />
                  Add it as a milestone
                </Link>
              </Button>
            ) : null}
          </>
        ) : null}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Scope changes never overwrite the approved Blueprint.
      </p>
    </div>
  );
}
