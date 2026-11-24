import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ClientDetail } from "@/components/admin/clients/ClientDetail";
import {
  getClient,
  listActivities,
  listInvoices,
  listProjects,
  listRequirements,
  listTickets,
} from "@/db/queries";
import type { AdminInvoice, Requirement, Ticket } from "@/lib/admin-data";
import { adminClients } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return adminClients.map((client) => ({ id: client.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Client ${id} | Elevosia Admin` };
}

async function ClientLoader({ id }: { id: string }) {
  await connection();
  const [client, projects, requirements, invoices, tickets, activity] =
    await Promise.all([
      getClient(id),
      listProjects(),
      listRequirements(),
      listInvoices(),
      listTickets(),
      listActivities(),
    ]);
  if (!client) notFound();

  const companyNames = new Set(client.companies.map((company) => company.name));
  const clientProjects = projects.filter((project) =>
    companyNames.has(project.client),
  );
  const clientRequirements: Requirement[] = requirements.filter(
    (requirement) => requirement.client === client.name,
  );
  const clientInvoices: AdminInvoice[] = invoices
    .filter((invoice) => invoice.client === client.name)
    .map((invoice) => ({
      id: invoice.id,
      client: invoice.client,
      kind: (
        [
          "Milestone",
          "Care plan",
          "Retainer",
          "Change request",
          "Custom",
        ].includes(invoice.kind)
          ? invoice.kind
          : "Change request"
      ) as AdminInvoice["kind"],
      amount: invoice.amount,
      due: invoice.due,
      status:
        invoice.status === "Paid" || invoice.status === "Overdue"
          ? invoice.status
          : "Due",
    }));
  const clientTickets: Ticket[] = tickets
    .filter((ticket) => ticket.client.company === client.name)
    .map((ticket) => ({
      id: ticket.id,
      subject: ticket.subject,
      client: ticket.client.company,
      priority: ticket.priority,
      sla: "SLA tracked",
      status:
        ticket.status === "Open" ||
        ticket.status === "Waiting on client" ||
        ticket.status === "Resolved"
          ? ticket.status
          : "New",
      care: ticket.client.carePlan,
      warranty: ticket.warranty,
      assignee: ticket.assignee,
    }));

  return (
    <ClientDetail
      client={client}
      projects={clientProjects}
      requirements={clientRequirements}
      invoices={clientInvoices}
      tickets={clientTickets}
      activity={activity.filter((item) =>
        item.detail.includes(client.name),
      )}
    />
  );
}

export default async function ClientDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-3 w-24 rounded bg-secondary" />
          <div className="mt-4 h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-24 rounded-lg border border-border bg-card"
              />
            ))}
          </div>
        </div>
      }
    >
      <ClientLoader id={id} />
    </Suspense>
  );
}
