import { connection } from "next/server";
import { ShieldCheck } from "lucide-react";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { listContracts } from "@/db/queries";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** NDAs from Postgres, read at request time. */
export async function NdaData() {
  await connection();
  const contracts = await listContracts();
  const ndas = contracts.filter((contract) => contract.type === "NDA");

  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-3">
      <SectionCard
        title="NDA requests"
        description="All time"
        className="xl:col-span-2"
        bodyClassName="divide-y divide-border"
      >
        {ndas.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">
            No NDAs requested yet.
          </p>
        ) : (
          ndas.map((nda) => (
            <div key={nda.id} className="flex items-center gap-3 px-5 py-4">
              <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{nda.client}</p>
                <p className="text-xs text-muted-foreground">
                  {nda.id} · {formatDate(nda.signedOn ?? nda.createdAt)}
                </p>
              </div>
              <StatusBadge
                tone={
                  nda.status === "Signed"
                    ? "success"
                    : nda.status === "Sent"
                      ? "warning"
                      : "neutral"
                }
              >
                {nda.status}
              </StatusBadge>
            </div>
          ))
        )}
      </SectionCard>

      <SectionCard title="How it works" description="Before requirements">
        <div className="space-y-3 p-5 text-sm text-muted-foreground">
          <p>1. Client asks for an NDA from the portal.</p>
          <p>2. We send the template for e-signature.</p>
          <p>3. Requirements stay locked until it is signed.</p>
          <p>4. A signed copy is stored in Files and Contracts.</p>
        </div>
      </SectionCard>
    </div>
  );
}
