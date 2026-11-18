import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { contracts } from "@/lib/admin-data";

export const metadata: Metadata = { title: "NDAs | Elevosia Admin" };

export default function NdaPage() {
  const ndas = contracts.filter((contract) => contract.type === "NDA");

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link href="/admin/contracts" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Contracts
      </Link>
      <PageHeader
        title="NDAs"
        meta="Finance"
        description="Signed before requirements. The client can request one from the portal."
        className="mt-3"
      />
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <SectionCard title="NDA requests" description="All time" className="xl:col-span-2" bodyClassName="divide-y divide-border">
          {(ndas.length > 0 ? ndas : [{ id: "CT-44", client: "Clearwater Fund", status: "Signed", date: "14 Nov 2026" }]).map((nda) => (
            <div key={nda.id} className="flex items-center gap-3 px-5 py-4">
              <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{nda.client}</p>
                <p className="text-xs text-muted-foreground">{nda.id} · {nda.date}</p>
              </div>
              <StatusBadge tone={nda.status === "Signed" ? "success" : nda.status === "Sent" ? "warning" : "neutral"}>
                {nda.status}
              </StatusBadge>
            </div>
          ))}
          <div className="flex items-center gap-3 px-5 py-4">
            <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Cedarbrook Schools</p>
              <p className="text-xs text-muted-foreground">Requested 18 Nov · not sent yet</p>
            </div>
            <StatusBadge tone="warning">Draft</StatusBadge>
          </div>
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
    </div>
  );
}
