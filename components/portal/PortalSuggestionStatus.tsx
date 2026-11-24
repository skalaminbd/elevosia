"use client";

import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { BlueprintSuggestionRow } from "@/db/queries";

/** Suggestion status card in the client's task panel, including a decline reason. */
export function PortalSuggestionStatus({
  suggestion,
}: {
  suggestion: BlueprintSuggestionRow;
}) {
  return (
    <div className="rounded-md border border-border bg-secondary/40 p-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium">Your suggestion</p>
        <StatusBadge
          tone={
            suggestion.status === "approved"
              ? "success"
              : suggestion.status === "dismissed"
                ? "neutral"
                : "warning"
          }
        >
          {suggestion.status === "approved"
            ? "Approved"
            : suggestion.status === "dismissed"
              ? "Declined"
              : "Pending review"}
        </StatusBadge>
      </div>
      {suggestion.status === "dismissed" ? (
        <p className="mt-2 text-destructive">
          Declined by PM. Reason:{" "}
          {suggestion.decisionNote || "No reason was written."}
        </p>
      ) : (
        <>
          <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
            {suggestion.name} — {suggestion.description || "no description"} ·{" "}
            {suggestion.hours} h
          </p>
          {suggestion.status === "approved" ? (
            <p className="mt-2 text-success">
              Approved — your title and description are now live.
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
