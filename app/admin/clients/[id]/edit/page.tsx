import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ClientForm } from "@/components/admin/clients/ClientForm";
import { getClient } from "@/db/queries";
import { adminClients } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return adminClients.map((client) => ({ id: client.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Edit client ${id} | Elevosia Admin` };
}

async function EditClientLoader({ id }: { id: string }) {
  await connection();
  const client = await getClient(id);
  if (!client) notFound();

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title={`Edit ${client.name}`}
        meta="Clients"
        description="Change details, the assigned PM, the status and the client's time zone."
      />
      <div className="mt-6 max-w-3xl">
        <ClientForm mode="edit" client={client} />
      </div>
    </div>
  );
}

export default async function EditClientPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 h-96 max-w-3xl rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <EditClientLoader id={id} />
    </Suspense>
  );
}
