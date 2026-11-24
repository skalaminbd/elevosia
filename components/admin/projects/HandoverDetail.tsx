import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { HandoverChecklist } from "@/components/admin/projects/HandoverChecklist";
import type { AccessRow, ProjectSummary } from "@/db/queries";

/** Handover accounts from Postgres. */
export function HandoverDetail({
  project,
  accounts,
  items,
}: {
  project: ProjectSummary;
  accounts: AccessRow[];
  items: { id: string; label: string }[];
}) {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href={`/admin/projects/${project.id}?tab=access`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to {project.name}
      </Link>
      <PageHeader
        title="Handover"
        meta={`${project.client} · ${project.name}`}
        description="Everything must be in the client's name before the project can close."
        className="mt-3"
      />
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Accounts"
          description="Ownership at a glance"
          className="xl:col-span-2"
          bodyClassName="divide-y divide-border"
        >
          {accounts.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">
              No accounts recorded yet.
            </p>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-3 px-5 py-3.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{account.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Owner: {account.owner}
                  </p>
                </div>
                <StatusBadge
                  tone={
                    account.status === "Handed over"
                      ? "success"
                      : account.status === "Pending"
                        ? "warning"
                        : "info"
                  }
                >
                  {account.status}
                </StatusBadge>
              </div>
            ))
          )}
        </SectionCard>
        <HandoverChecklist items={items} />
      </div>
    </div>
  );
}
