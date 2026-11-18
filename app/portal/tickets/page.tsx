import type { Metadata } from "next";
import { Clock, LifeBuoy, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { PortalTicketsView } from "@/components/portal/PortalTicketsView";

export const metadata: Metadata = {
  title: "Tickets | Elevosia client portal",
};

export default function PortalTicketsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Support tickets"
        meta="Support"
        description="Something broken or a small question. Your PM sees it right away."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Open" value={1} note="Invoice reminder" icon={LifeBuoy} />
        <StatCard label="Response target" value="1 day" note="Same-business-day care" icon={Clock} />
        <StatCard label="Under warranty" value={1} note="No charge" icon={ShieldCheck} tone="success" />
      </div>

      <div className="mt-4">
        <PortalTicketsView />
      </div>
    </div>
  );
}
