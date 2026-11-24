import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { PortalTicketDetail } from "@/components/portal/PortalTicketDetail";
import { listPortalTickets } from "@/db/queries";

export const instant = false;

type Params = Promise<{ id: string }>;

export const metadata: Metadata = {
  title: "Ticket | Elevosia client portal",
};

async function TicketLoader({ id }: { id: string }) {
  await connection();
  const tickets = await listPortalTickets();
  const ticket = tickets.find((item) => item.id === id);

  if (!ticket) {
    return (
      <div className="mx-auto w-full max-w-[1400px]">
        <Link
          href="/portal/tickets"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          All tickets
        </Link>
        <p className="mt-6 text-sm text-muted-foreground">
          That ticket does not exist yet.
        </p>
      </div>
    );
  }

  return <PortalTicketDetail initialTicket={ticket} />;
}

export default async function PortalTicketPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[900px]">
          <div className="h-3 w-24 rounded bg-secondary" />
          <div className="mt-4 h-64 rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <TicketLoader id={id} />
    </Suspense>
  );
}
