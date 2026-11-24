import { connection } from "next/server";
import {
  CalendarClock,
  CircleDollarSign,
  Receipt,
  TriangleAlert,
} from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import {
  InvoicesTable,
  type DbInvoiceRow,
} from "@/components/admin/invoices/InvoicesTable";
import { listInvoices, listRetainers } from "@/db/queries";
import type { InvoiceStatus } from "@/lib/admin-data";

const STATUSES: InvoiceStatus[] = ["Paid", "Due", "Overdue"];

/** Invoices and their totals, read from Postgres. */
export async function InvoicesData() {
  await connection();
  const [rows, retainers] = await Promise.all([
    listInvoices(),
    listRetainers(),
  ]);

  const dbInvoices: DbInvoiceRow[] = rows.map((row) => ({
    ...row,
    status: STATUSES.includes(row.status as InvoiceStatus)
      ? (row.status as InvoiceStatus)
      : "Due",
  }));

  const paid = dbInvoices.filter((invoice) => invoice.status === "Paid");
  const due = dbInvoices.filter((invoice) => invoice.status === "Due");
  const overdue = dbInvoices.filter((invoice) => invoice.status === "Overdue");
  const paidTotal = paid.reduce((total, invoice) => total + invoice.amount, 0);
  const dueTotal = due.reduce((total, invoice) => total + invoice.amount, 0);
  const overdueTotal = overdue.reduce(
    (total, invoice) => total + invoice.amount,
    0,
  );
  const activePlans = retainers.filter(
    (plan) => plan.status === "Active" && plan.amount > 0,
  );
  const monthly = activePlans.reduce((total, plan) => total + plan.amount, 0);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Paid this month"
          value={`$${paidTotal.toLocaleString("en-US")}`}
          note={`${paid.length} ${paid.length === 1 ? "invoice" : "invoices"}`}
          icon={Receipt}
          tone="success"
        />
        <StatCard
          label="Due"
          value={`$${dueTotal.toLocaleString("en-US")}`}
          note={`${due.length} ${due.length === 1 ? "invoice" : "invoices"} open`}
          icon={CalendarClock}
        />
        <StatCard
          label="Overdue"
          value={`$${overdueTotal.toLocaleString("en-US")}`}
          note={overdue[0]?.client ?? "Nothing overdue"}
          icon={TriangleAlert}
          tone="danger"
        />
        <StatCard
          label="Monthly care plans"
          value={`$${monthly.toLocaleString("en-US")}`}
          note={`${activePlans.length} active plans`}
          icon={CircleDollarSign}
        />
      </div>

      <div className="mt-4">
        <InvoicesTable dbInvoices={dbInvoices} />
      </div>
    </>
  );
}
