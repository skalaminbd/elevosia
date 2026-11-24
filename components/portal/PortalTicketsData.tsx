import { connection } from "next/server";
import { Clock, LifeBuoy, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { PortalTicketsView } from "@/components/portal/PortalTicketsView";
import { listPortalTickets } from "@/db/queries";
import { requirePortalClientId } from "@/lib/portal-session";

/** Client tickets from Postgres, read at request time. */
export async function PortalTicketsData() {
  await connection();
  const clientId = await requirePortalClientId();
  const tickets = await listPortalTickets(clientId);
  const open = tickets.filter((ticket) => ticket.status !== "Resolved").length;
  const warranty = tickets.filter((ticket) => ticket.warranty).length;

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Open"
          value={open}
          note="Your PM replies within a day"
          icon={LifeBuoy}
        />
        <StatCard
          label="Response target"
          value="1 day"
          note="Same-business-day care"
          icon={Clock}
        />
        <StatCard
          label="Under warranty"
          value={warranty}
          note="No charge"
          icon={ShieldCheck}
          tone="success"
        />
      </div>

      <div className="mt-4">
        <PortalTicketsView tickets={tickets} />
      </div>
    </>
  );
}
