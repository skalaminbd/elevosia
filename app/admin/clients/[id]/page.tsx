import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { ClientTabs } from "@/components/admin/clients/ClientTabs";
import { adminClients } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return adminClients.map((client) => ({ id: client.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const client = adminClients.find((item) => item.id === id);
  return client ? { title: `${client.name} | Elevosia Admin` } : {};
}

export default async function ClientDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const client = adminClients.find((item) => item.id === id);
  if (!client) notFound();

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All clients
      </Link>

      <PageHeader
        title={client.name}
        meta={`${client.industry} · client since ${client.since}`}
        description={`${client.contact} · ${client.email}`}
        className="mt-3"
      >
        <StatusBadge
          tone={
            client.status === "Active"
              ? "success"
              : client.status === "Onboarding"
                ? "info"
                : client.status === "Paused"
                  ? "warning"
                  : "neutral"
          }
        >
          {client.status}
        </StatusBadge>
        <Button asChild variant="outline">
          <Link href={`/admin/clients/${client.id}/edit`}>
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/admin/preview/${client.id}`}>
            <ExternalLink className="size-4" aria-hidden="true" />
            Preview portal
          </Link>
        </Button>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Projects" value={client.projects} note="Active" />
        <StatCard label="Plan" value={client.plan.split(" · ")[0]} note={client.plan.split(" · ")[1] ?? "Custom"} />
        <StatCard
          label="Balance due"
          value={`$${client.balance.toLocaleString("en-US")}`}
          note="Across invoices"
          tone={client.balance > 0 ? "warning" : "default"}
        />
        <StatCard label="Assigned PM" value={client.pm} note="Point of contact" />
        <StatCard label="Time zone" value={client.timezone.split("/").pop() ?? client.timezone} note={client.timezone} />
      </div>

      <div className="mt-4">
        <ClientTabs clientId={client.id} />
      </div>
    </div>
  );
}
