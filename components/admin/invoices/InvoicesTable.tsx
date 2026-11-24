"use client";

import { useMemo, useState } from "react";
import { FilterDisclosure } from "@/components/shared/FilterDisclosure";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import type { InvoiceStatus } from "@/lib/admin-data";

const STATUS_OPTIONS = [
  { id: "Due", label: "Due", icon: Clock },
  { id: "Overdue", label: "Overdue", icon: AlertTriangle },
  { id: "Paid", label: "Paid", icon: CheckCircle2 },
];

const TONE: Record<InvoiceStatus, BadgeTone> = {
  Paid: "success",
  Due: "neutral",
  Overdue: "danger",
};

export type DbInvoiceRow = {
  id: string;
  client: string;
  kind: string;
  amount: number;
  due: string;
  status: InvoiceStatus;
};

/** Invoice list with status filters, from Postgres. */
export function InvoicesTable({
  dbInvoices = [],
}: {
  dbInvoices?: DbInvoiceRow[];
}) {
  const [statuses, setStatuses] = useState<string[]>([]);

  const rows = useMemo(
    () =>
      dbInvoices.filter(
        (invoice) =>
          statuses.length === 0 || statuses.includes(invoice.status),
      ),
    [statuses, dbInvoices],
  );

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <FilterDisclosure
          label="Filter"
          values={statuses}
          options={STATUS_OPTIONS}
          onChange={setStatuses}
        />
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
            <TH className="w-10" />
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
                <TD className="font-mono text-xs">
                  <Link href={`/admin/invoices/${invoice.id}`} className="hover:underline">
                    {invoice.id}
                  </Link>
                </TD>
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
                <TD>
                  <Link href={`/admin/invoices/${invoice.id}`} aria-label={`Open ${invoice.id}`} className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary">
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </Link>
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );
}
