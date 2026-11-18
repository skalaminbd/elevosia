import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { adminClients, adminInvoices, adminProjects } from "@/lib/admin-data";

type Params = Promise<{ clientId: string }>;

export function generateStaticParams() {
  return adminClients.map((client) => ({ clientId: client.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { clientId } = await params;
  const client = adminClients.find((item) => item.id === clientId);
  return client ? { title: `Preview ${client.name} | Elevosia Admin` } : {};
}

export default async function PreviewPage({ params }: { params: Params }) {
  const { clientId } = await params;
  const client = adminClients.find((item) => item.id === clientId);
  if (!client) notFound();

  const projects = adminProjects.filter((project) => project.client === client.name);
  const invoices = adminInvoices.filter((invoice) => invoice.client === client.name);

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href={`/admin/clients/${client.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to {client.name}
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-warning/30 bg-warning/5 px-4 py-2.5">
        <p className="flex items-center gap-2 text-xs text-warning">
          <Eye className="size-3.5" aria-hidden="true" />
          Read-only preview of the client portal for {client.name}
        </p>
        <Link href={`/admin/clients/${client.id}`} className="text-xs font-medium text-primary hover:underline">
          Exit preview
        </Link>
      </div>

      <PageHeader
        title={`Welcome back, ${client.contact.split(" ")[0]}`}
        meta={client.name}
        description={`${client.plan} · ${client.timezone}`}
        className="mt-5"
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {projects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No projects on this account yet.
            </div>
          ) : (
            projects.map((project) => (
              <SectionCard
                key={project.id}
                title={project.name}
                description={`${project.status} · due ${project.due}`}
                action={
                  <StatusBadge tone={project.health === "On track" ? "success" : "warning"}>
                    {project.health}
                  </StatusBadge>
                }
              >
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <Progress className="flex-1" value={project.progress} />
                    <span className="w-9 text-right font-mono text-[10px] text-muted-foreground">
                      {project.progress}%
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Next milestone in the weekly board.
                  </p>
                </div>
              </SectionCard>
            ))
          )}
        </div>

        <SectionCard title="Invoices" description="What the client sees" bodyClassName="divide-y divide-border">
          {invoices.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">No invoices yet.</p>
          ) : (
            invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{invoice.id}</p>
                  <p className="text-xs text-muted-foreground">{invoice.kind}</p>
                </div>
                <span className="font-mono text-xs">${invoice.amount.toLocaleString("en-US")}</span>
                <StatusBadge tone={invoice.status === "Paid" ? "success" : "warning"}>
                  {invoice.status}
                </StatusBadge>
              </div>
            ))
          )}
        </SectionCard>
      </div>
    </div>
  );
}
