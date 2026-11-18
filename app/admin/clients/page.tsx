import type { Metadata } from "next";
import { CreditCard, Users, UserPlus, Wallet } from "lucide-react";
import { ClientsTable } from "@/components/admin/clients/ClientsTable";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";

export const metadata: Metadata = {
  title: "Clients | Elevosia Admin",
};

export default function ClientsPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="Clients"
        description="Every company account, its projects, care plan and balance in one list."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Active clients" value={4} note="1 onboarding this week" icon={Users} />
        <StatCard label="Leads" value={1} note="From the website" icon={UserPlus} />
        <StatCard label="Balance due" value="$13,500" note="2 invoices past due" icon={Wallet} tone="warning" />
        <StatCard label="Care plans" value={1} note="Growth plan" icon={CreditCard} />
      </div>

      <div className="mt-4">
        <ClientsTable />
      </div>
    </div>
  );
}
