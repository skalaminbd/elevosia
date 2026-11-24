"use client";

import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";

type DeletionRequest = {
  id: string;
  client: string;
  contact: string;
  requested: string;
  reason: string;
  status: string;
};

export function DeletionRequests({
  requests,
}: {
  requests: DeletionRequest[];
}) {
  const [states, setStates] = useState<Record<string, "exported" | "purged">>({});
  const confirm = useConfirm();

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold">Deletion requests</h2>
        <p className="text-xs text-muted-foreground">
          Export first, then purge. Purged records stay in the archive for 30 days.
        </p>
      </div>
      <ul className="divide-y divide-border">
        {requests.map((request) => {
          const state = states[request.id];
          return (
            <li key={request.id} className="flex flex-wrap items-start gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{request.client}</p>
                <p className="text-xs text-muted-foreground">
                  {request.contact} · requested {request.requested} · {request.id}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{request.reason}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {state === "purged" ? (
                  <StatusBadge tone="danger">Purged</StatusBadge>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setStates((current) => ({ ...current, [request.id]: "exported" }))
                      }
                      disabled={state === "exported"}
                    >
                      <Download className="size-3.5" aria-hidden="true" />
                      {state === "exported" ? "Exported" : "Export data"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        const ok = await confirm({
                          icon: Trash2,
                          title: `Purge ${request.client}'s data?`,
                          subtitle:
                            "The record stays in the archive for 30 days, then it is gone.",
                          confirmLabel: "Purge record",
                          tone: "danger",
                        });
                        if (ok) {
                          setStates((current) => ({
                            ...current,
                            [request.id]: "purged",
                          }));
                        }
                      }}
                      disabled={state !== "exported"}
                      title={state !== "exported" ? "Export the data first" : undefined}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Purge
                    </Button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
