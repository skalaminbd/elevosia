import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { TicketWorkspace } from "@/components/admin/tickets/TicketWorkspace";
import { getTicket } from "@/db/queries";
import { ticketRecords } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return ticketRecords.map((ticket) => ({ id: ticket.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} | Elevosia Admin` };
}

async function TicketLoader({ id }: { id: string }) {
  await connection();
  const ticket = await getTicket(id);
  if (!ticket) {
    return (
      <div className="mx-auto w-full max-w-[1400px]">
        <Link
          href="/admin/tickets"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Back to tickets
        </Link>
        <p className="mt-6 text-sm text-muted-foreground">
          That ticket does not exist yet.
        </p>
      </div>
    );
  }
  return <TicketWorkspace initialTicket={ticket} />;
}

export default async function TicketDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-96 rounded-lg border border-border bg-card" />
            <div className="hidden h-96 rounded-lg border border-border bg-card lg:block" />
          </div>
        </div>
      }
    >
      <TicketLoader id={id} />
    </Suspense>
  );
}
