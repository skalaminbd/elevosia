import type { Metadata } from "next";
import { FileSignature, PenLine, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import { contracts } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Contracts | Elevosia Admin",
};

const TONE: Record<string, BadgeTone> = {
  Signed: "success",
  Sent: "warning",
  Draft: "neutral",
};

const templates = [
  { id: "service", name: "Service agreement", note: "Every new project", updated: "12 Oct" },
  { id: "nda", name: "NDA", note: "Before requirements", updated: "2 Sep" },
  { id: "change", name: "Change request", note: "New scope after approval", updated: "18 Oct" },
  { id: "care", name: "Care plan agreement", note: "Essential, Growth, Partner", updated: "1 Nov" },
];

export default function ContractsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Contracts"
        meta="Finance"
        description="Templates, what is out for signature and the NDAs clients asked for first."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Signed" value={3} note="This month" icon={FileSignature} tone="success" />
        <StatCard label="Out for signature" value={1} note="Northwind HVAC" icon={PenLine} tone="warning" />
        <StatCard label="Drafts" value={1} note="Cedarbrook Schools" icon={FileSignature} />
        <StatCard label="NDAs" value={1} note="Clearwater Fund" icon={ShieldCheck} />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => (
          <div key={template.id} className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium">{template.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{template.note}</p>
            <p className="mt-3 font-mono text-[10px] text-muted-foreground">
              Updated {template.updated}
            </p>
          </div>
        ))}
      </div>

      <Table className="mt-4">
        <THead>
          <tr>
            <TH>Contract</TH>
            <TH>Client</TH>
            <TH>Type</TH>
            <TH>Status</TH>
            <TH>Date</TH>
          </tr>
        </THead>
        <TBody>
          {contracts.map((contract) => (
            <TR key={contract.id}>
              <TD className="font-mono text-xs">{contract.id}</TD>
              <TD className="font-medium">{contract.client}</TD>
              <TD className="text-xs text-muted-foreground">{contract.type}</TD>
              <TD>
                <StatusBadge tone={TONE[contract.status] ?? "neutral"}>
                  {contract.status}
                </StatusBadge>
              </TD>
              <TD className="text-xs text-muted-foreground">{contract.date}</TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <SectionCard
        title="NDA requests"
        description="Signed before requirements, as clients asked"
        className="mt-4"
        bodyClassName="divide-y divide-border"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-sm font-medium">Clearwater Fund</p>
            <p className="text-xs text-muted-foreground">Requested 14 Nov · signed same day</p>
          </div>
          <StatusBadge tone="success">Signed</StatusBadge>
        </div>
      </SectionCard>
    </div>
  );
}
