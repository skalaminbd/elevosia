import Link from "next/link";
import { ArrowLeft, FolderKanban, FileText } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { ContractActions } from "@/components/admin/contracts/ContractActions";
import type { ContractRow } from "@/db/queries";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** One contract from Postgres. */
export function ContractDetail({ contract }: { contract: ContractRow }) {
  const project = contract.projectName;
  const date = contract.signedOn
    ? formatDate(contract.signedOn)
    : contract.status === "Draft"
      ? "—"
      : formatDate(contract.createdAt);

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/contracts"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All contracts
      </Link>
      <PageHeader
        title={contract.type}
        meta={`${contract.client} · ${contract.id}`}
        description={
          contract.status === "Signed"
            ? `Signed ${date}`
            : contract.status === "Sent"
              ? `Sent ${date}`
              : "Draft, not sent to the client yet"
        }
        className="mt-3"
      >
        <StatusBadge
          tone={
            contract.status === "Signed"
              ? "success"
              : contract.status === "Sent"
                ? "warning"
                : "neutral"
          }
        >
          {contract.status}
        </StatusBadge>
        {project && contract.projectId ? (
          <Button asChild variant="outline">
            <Link href={`/admin/projects/${contract.projectId}`}>
              <FolderKanban className="size-4" aria-hidden="true" />
              {project}
            </Link>
          </Button>
        ) : null}
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Type" value={contract.type} note="Template used" icon={FileText} />
        <StatCard label="Client" value={contract.client} note="Signer" icon={FileText} />
        <StatCard
          label="Project"
          value={project ?? "No project yet"}
          note={project ? "Contract covers this project" : "Pre-project document"}
          icon={FolderKanban}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Document"
          description="Read only after signing"
          className="xl:col-span-2"
          bodyClassName="p-5"
        >
          <div className="rounded-md border border-border bg-background p-6">
            <p className="font-heading text-lg font-semibold">
              Elevosia · {contract.type}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {contract.client} · {date}
            </p>
            <div className="mt-5 space-y-2">
              {[90, 100, 96, 100, 72, 100, 88, 60].map((width, index) => (
                <span
                  key={index}
                  className="block h-2 rounded-sm bg-secondary"
                  style={{ width: `${width}%` }}
                />
              ))}
            </div>
            <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
              <p className="text-[10px] text-muted-foreground">
                {contract.status === "Signed"
                  ? "Signature on file"
                  : "Awaiting signature"}
              </p>
              <span className="font-heading text-lg italic">{contract.client}</span>
            </div>
          </div>
        </SectionCard>
        <ContractActions id={contract.id} status={contract.status} />
      </div>
    </div>
  );
}
