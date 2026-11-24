import { connection } from "next/server";
import { FileSignature, PenLine, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import {
  ContractsView,
  type ContractTemplateRow,
} from "@/components/admin/contracts/ContractsView";
import { listContracts, listContractTemplates } from "@/db/queries";
import type { Contract, ContractStatus } from "@/lib/admin-data";

const STATUSES: ContractStatus[] = ["Signed", "Sent", "Draft"];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Contracts and templates from Postgres, read at request time. */
export async function ContractsData() {
  await connection();
  const [rows, templates] = await Promise.all([
    listContracts(),
    listContractTemplates(),
  ]);

  const contracts: Contract[] = rows.map((row) => ({
    id: row.id,
    clientId: row.clientId,
    client: row.client,
    projectId: row.projectId,
    projectName: row.projectName,
    type: row.type,
    status: STATUSES.includes(row.status as ContractStatus)
      ? (row.status as ContractStatus)
      : "Draft",
    date:
      row.signedOn !== null
        ? formatDate(row.signedOn)
        : row.status === "Draft"
          ? "—"
          : formatDate(row.createdAt),
    createdAt: row.createdAt,
  }));

  const signed = contracts.filter((contract) => contract.status === "Signed");
  const sent = contracts.filter((contract) => contract.status === "Sent");
  const drafts = contracts.filter((contract) => contract.status === "Draft");
  const ndas = contracts.filter((contract) => contract.type === "NDA");

  const templateRows: ContractTemplateRow[] = templates;

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Signed"
          value={signed.length}
          note="Across all clients"
          icon={FileSignature}
          tone="success"
        />
        <StatCard
          label="Out for signature"
          value={sent.length}
          note={sent[0]?.client ?? "Nothing sent"}
          icon={PenLine}
          tone="warning"
        />
        <StatCard
          label="Drafts"
          value={drafts.length}
          note={drafts[0]?.client ?? "No drafts"}
          icon={FileSignature}
        />
        <StatCard
          label="NDAs"
          value={ndas.length}
          note="Signed before requirements"
          icon={ShieldCheck}
        />
      </div>

      <div className="mt-4">
        <ContractsView contracts={contracts} templates={templateRows} />
      </div>
    </>
  );
}
