import type { Metadata } from "next";
import { CircleDollarSign, Receipt, Wallet } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { PortalInvoicesView } from "@/components/portal/PortalInvoicesView";

export const metadata: Metadata = {
  title: "Invoices | Elevosia client portal",
};

export default function PortalInvoicesPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="Invoices and payments"
        meta="Billing"
        description="What is due, what is paid, and the care plan hours behind the work."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Due now" value="$4,800" note="INV-1048 · 2 Dec" icon={Receipt} tone="warning" />
        <StatCard label="Paid this project" value="$11,200" note="2 of 3 milestones" icon={CircleDollarSign} tone="success" />
        <StatCard label="Care plan" value="$699/mo" note="Growth · 6 h a month" icon={Wallet} />
      </div>

      <div className="mt-4">
        <PortalInvoicesView />
      </div>
    </div>
  );
}
