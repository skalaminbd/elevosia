import { connection } from "next/server";
import { CircleDollarSign, Receipt, Wallet } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { PortalInvoicesView } from "@/components/portal/PortalInvoicesView";
import { getPortalRetainer, listPortalInvoices } from "@/db/queries";
import { requirePortalClientId } from "@/lib/portal-session";

/** Client invoices from Postgres, read at request time. */
export async function PortalInvoicesData() {
  await connection();
  const clientId = await requirePortalClientId();
  const [invoices, plan] = await Promise.all([
    listPortalInvoices(clientId),
    getPortalRetainer(clientId),
  ]);
  const retainer = plan ?? {
    plan: "Care plan",
    price: 0,
    hours: 0,
    used: 0,
    next: "—",
    sla: "",
    work: [],
  };

  const due = invoices
    .filter((invoice) => invoice.status !== "Paid")
    .reduce((total, invoice) => total + invoice.amount, 0);
  const paid = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((total, invoice) => total + invoice.amount, 0);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Due now"
          value={`$${due.toLocaleString("en-US")}`}
          note={`${invoices.filter((invoice) => invoice.status !== "Paid").length} open invoices`}
          icon={Receipt}
          tone="warning"
        />
        <StatCard
          label="Paid this project"
          value={`$${paid.toLocaleString("en-US")}`}
          note={`${invoices.filter((invoice) => invoice.status === "Paid").length} paid`}
          icon={CircleDollarSign}
          tone="success"
        />
        <StatCard
          label="Care plan"
          value={`$${retainer.price}/mo`}
          note={`${retainer.plan} · ${retainer.hours} h a month`}
          icon={Wallet}
        />
      </div>

      <div className="mt-4">
        <PortalInvoicesView invoices={invoices} retainer={retainer} />
      </div>
    </>
  );
}
