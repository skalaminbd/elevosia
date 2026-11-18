import type { Metadata } from "next";
import { AlertTriangle, LifeBuoy, ShieldCheck, Timer } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { TicketsQueue } from "@/components/admin/tickets/TicketsQueue";

export const metadata: Metadata = {
  title: "Tickets | Elevosia Admin",
};

export default function TicketsPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="Tickets"
        meta="Support"
        description="Support queue with SLA timers, care plan and warranty flags. Claim unassigned work or escalate it as a task."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Open" value={6} note="Across 4 clients" icon={LifeBuoy} />
        <StatCard label="Near SLA" value={2} note="Under 1 hour" icon={Timer} tone="warning" />
        <StatCard label="Breached" value={1} note="Northwind · homepage form" icon={AlertTriangle} tone="danger" />
        <StatCard label="Under warranty" value={2} note="No charge to the client" icon={ShieldCheck} tone="success" />
      </div>

      <div className="mt-4">
        <TicketsQueue />
      </div>
    </div>
  );
}
