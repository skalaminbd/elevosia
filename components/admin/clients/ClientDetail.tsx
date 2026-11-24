import Link from "next/link";
import { ArrowLeft, Building2, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { ClientTabs } from "@/components/admin/clients/ClientTabs";
import { EditClientDialog } from "@/components/admin/clients/EditClientDialog";
import type {
  AdminClient,
  AdminProject,
  AdminInvoice,
  Requirement,
  Ticket,
} from "@/lib/admin-data";

type ClientDetailProps = {
  client: AdminClient;
  projects: AdminProject[];
  requirements: Requirement[];
  invoices: AdminInvoice[];
  tickets: Ticket[];
  activity: { id: string; title: string; detail: string; time: string }[];
};

/** One client from Postgres. */
export function ClientDetail({
  client,
  projects,
  requirements,
  invoices,
  tickets,
  activity,
}: ClientDetailProps) {
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
        title={client.contact}
        description={client.email}
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
        <EditClientDialog client={client} />
        <Button asChild variant="outline">
          <Link href={`/admin/preview/${client.id}`}>
            <ExternalLink className="size-4" aria-hidden="true" />
            Preview portal
          </Link>
        </Button>
      </PageHeader>

      <SectionCard
        title="Companies"
        description={`${client.companies.length} ${client.companies.length === 1 ? "company" : "companies"} under this client`}
        className="mt-6"
        bodyClassName="p-5"
      >
        <ul className="flex flex-wrap gap-2">
          {client.companies.map((company, index) => (
            <li
              key={company.name}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium"
            >
              <Building2
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              {company.name}
              <span className="font-normal text-muted-foreground">
                {company.city}
                {index === 0 ? " · Primary" : ""}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Projects" value={client.projects} note="Active" />
        <StatCard
          label="Plan"
          value={client.plan.split(" · ")[0]}
          note={client.plan.split(" · ")[1] ?? "Custom"}
        />
        <StatCard
          label="Balance due"
          value={`$${client.balance.toLocaleString("en-US")}`}
          note="Across invoices"
          tone={client.balance > 0 ? "warning" : "default"}
        />
      </div>

      <div className="mt-4">
        <ClientTabs
          client={client}
          projects={projects}
          requirements={requirements}
          invoices={invoices}
          tickets={tickets}
          activity={activity}
        />
      </div>
    </div>
  );
}
