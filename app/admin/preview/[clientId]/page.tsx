import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { PortalPreview } from "@/components/admin/clients/PortalPreview";
import {
  getClient,
  listInvoices,
  listProjects,
} from "@/db/queries";
import { adminClients } from "@/lib/admin-data";
import type { AdminInvoice } from "@/lib/admin-data";

type Params = Promise<{ clientId: string }>;

export function generateStaticParams() {
  return adminClients.map((client) => ({ clientId: client.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { clientId } = await params;
  return { title: `Preview ${clientId} | Elevosia Admin` };
}

async function PreviewLoader({ id }: { id: string }) {
  await connection();
  const [client, projects, invoices] = await Promise.all([
    getClient(id),
    listProjects(),
    listInvoices(),
  ]);
  if (!client) notFound();

  const clientInvoices: AdminInvoice[] = invoices
    .filter((invoice) => invoice.client === client.name)
    .map((invoice) => ({
      id: invoice.id,
      client: invoice.client,
      kind: (
        ["Milestone", "Care plan", "Retainer", "Change request", "Custom"].includes(
          invoice.kind,
        )
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

  return (
    <PortalPreview
      client={client}
      projects={projects.filter((project) => project.client === client.name)}
      invoices={clientInvoices}
    />
  );
}

export default async function PreviewPage({ params }: { params: Params }) {
  const { clientId } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-3 w-24 rounded bg-secondary" />
          <div className="mt-4 h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 h-64 rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <PreviewLoader id={clientId} />
    </Suspense>
  );
}
