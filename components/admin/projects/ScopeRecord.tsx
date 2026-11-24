"use client";

import Link from "next/link";
import { ClipboardCheck, Receipt } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { SendScopeInvoiceDialog } from "@/components/admin/projects/SendScopeInvoiceDialog";
import type { ProjectScope, ProjectScopePoint } from "@/lib/project-store";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Approved requirement scope recorded on the converted project. */
export function ScopeRecord({
  scope,
  projectId,
  projectName,
  client,
}: {
  scope: ProjectScope;
  projectId: string;
  projectName: string;
  client: string;
}) {
  const groups: { title: string; points: ProjectScopePoint[] }[] = [];
  for (const point of scope.points) {
    const group = groups.find((item) => item.title === point.milestoneTitle);
    if (group) {
      group.points.push(point);
    } else {
      groups.push({ title: point.milestoneTitle, points: [point] });
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <ClipboardCheck
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            Approved requirement scope
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {scope.requirementId} · {scope.requirementTitle} · approved{" "}
            {formatDate(scope.approvedAt)} from {scope.blueprintId}
          </p>
        </div>
        {scope.invoiceId ? (
          <StatusBadge tone="success">Invoiced</StatusBadge>
        ) : (
          <StatusBadge tone="neutral">Not invoiced</StatusBadge>
        )}
      </div>

      <div className="divide-y divide-border">
        {groups.map((group) => (
          <div key={group.title} className="px-5 py-3">
            <p className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              {group.title}
            </p>
            <ul className="mt-1.5 space-y-1.5">
              {group.points.map((point, index) => (
                <li
                  key={`${group.title}-${index}`}
                  className="flex items-start gap-2.5"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />
                  <span className="min-w-0 flex-1 text-sm">{point.text}</span>
                  <StatusBadge tone={point.must ? "accent" : "neutral"}>
                    {point.must ? "Must-have" : "Nice-to-have"}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
        {scope.invoiceId ? (
          <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Receipt className="size-3.5" aria-hidden="true" />
            {scope.invoiceId}
            {scope.invoiceAmount
              ? ` · $${scope.invoiceAmount.toLocaleString("en-US")}`
              : ""}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            This scope is not billed yet. Send a custom invoice for it when the
            work starts.
          </p>
        )}
        {scope.invoiceId ? (
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/invoices">View invoices</Link>
          </Button>
        ) : (
          <SendScopeInvoiceDialog
            scope={scope}
            projectId={projectId}
            projectName={projectName}
            client={client}
          />
        )}
      </div>
    </section>
  );
}
