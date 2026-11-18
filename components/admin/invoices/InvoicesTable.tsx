"use client";

import { useMemo, useState } from "react";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import { adminInvoices, type InvoiceStatus } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const FILTERS: (InvoiceStatus | "All")[] = ["All", "Due", "Overdue", "Paid"];

const TONE: Record<InvoiceStatus, BadgeTone> = {
  Paid: "success",
  Due: "neutral",
  Overdue: "danger",
};

/** Invoice list with status filters. */
export function InvoicesTable() {
  const [filter, setFilter] = useState<InvoiceStatus | "All">("All");

  const rows = useMemo(
    () =>
      adminInvoices.filter(
        (invoice) => filter === "All" || invoice.status === filter,
      ),
    [filter],
  );

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={cn(
                "h-8 rounded-md px-3 text-xs font-medium transition-colors",
                filter === item
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {rows.length} invoices · sample data
        </p>
      </div>

      <Table minWidth bare>
        <THead>
          <tr>
            <TH>Invoice</TH>
            <TH>Client</TH>
            <TH>Type</TH>
            <TH>Amount</TH>
            <TH>Due</TH>
            <TH>Status</TH>
          </tr>
        </THead>
        <TBody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                Nothing here.
              </td>
            </tr>
          ) : (
            rows.map((invoice) => (
              <TR key={invoice.id}>
                <TD className="font-mono text-xs">{invoice.id}</TD>
                <TD className="font-medium">{invoice.client}</TD>
                <TD className="text-xs text-muted-foreground">{invoice.kind}</TD>
                <TD className="font-mono text-xs font-semibold tabular-nums">
                  ${invoice.amount.toLocaleString("en-US")}
                </TD>
                <TD className="text-xs text-muted-foreground">{invoice.due}</TD>
                <TD>
                  <StatusBadge tone={TONE[invoice.status]}>
                    {invoice.status}
                  </StatusBadge>
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );
}
