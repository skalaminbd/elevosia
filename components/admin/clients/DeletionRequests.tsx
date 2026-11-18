"use client";

import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

const REQUESTS = [
  {
    id: "DR-7",
    client: "Atlas Property",
    contact: "Ray Khan",
    requested: "14 Nov 2026",
    reason: "Closed the business, wants all data removed.",
  },
  {
    id: "DR-6",
    client: "Ridgeline Cleaning",
    contact: "Marco Reyes",
    requested: "9 Nov 2026",
    reason: "Moved to another provider, asks for an export first.",
  },
];

export function DeletionRequests() {
  const [states, setStates] = useState<Record<string, "exported" | "purged">>({});

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold">Deletion requests</h2>
        <p className="text-xs text-muted-foreground">
          Export first, then purge. Purged records stay in the archive for 30 days.
        </p>
      </div>
      <ul className="divide-y divide-border">
        {REQUESTS.map((request) => {
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
                    <button
                      type="button"
                      onClick={() =>
                        setStates((current) => ({ ...current, [request.id]: "exported" }))
                      }
                      disabled={state === "exported"}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-50"
                    >
                      <Download className="size-3.5" aria-hidden="true" />
                      {state === "exported" ? "Exported" : "Export data"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setStates((current) => ({ ...current, [request.id]: "purged" }))
                      }
                      disabled={state !== "exported"}
                      title={state !== "exported" ? "Export the data first" : undefined}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-destructive/30 px-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-40"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Purge
                    </button>
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
