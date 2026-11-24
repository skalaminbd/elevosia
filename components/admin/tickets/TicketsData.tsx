import { connection } from "next/server";
import { TicketsQueue } from "@/components/admin/tickets/TicketsQueue";
import { listTickets } from "@/db/queries";

/** Ticket queue from Postgres, read at request time. */
export async function TicketsData() {
  await connection();
  const tickets = await listTickets();
  return <TicketsQueue tickets={tickets} />;
}
