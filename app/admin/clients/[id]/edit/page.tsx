import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ClientForm } from "@/components/admin/clients/ClientForm";
import { adminClients } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return adminClients.map((client) => ({ id: client.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const client = adminClients.find((item) => item.id === id);
  return client ? { title: `Edit ${client.name} | Elevosia Admin` } : {};
}

export default async function EditClientPage({ params }: { params: Params }) {
  const { id } = await params;
  const client = adminClients.find((item) => item.id === id);
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
