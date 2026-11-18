import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, LifeBuoy, ShieldCheck, Timer } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { TicketsQueue } from "@/components/admin/tickets/TicketsQueue";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tickets | Elevosia Admin",
};

export default function TicketsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Tickets"
        meta="Support"
        description="Support queue with SLA timers, care plan and warranty flags. Claim unassigned work or escalate it as a task."
      >
        <Button asChild variant="outline">
          <Link href="/admin/tickets/canned-replies">Canned replies</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/tickets/requests">Work requests</Link>
        </Button>
      </PageHeader>

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
