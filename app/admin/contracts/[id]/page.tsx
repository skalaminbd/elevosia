import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ContractActions } from "@/components/admin/contracts/ContractActions";
import { contracts } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return contracts.map((contract) => ({ id: contract.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const contract = contracts.find((item) => item.id === id);
  return contract ? { title: `${contract.type} · ${contract.client} | Elevosia Admin` } : {};
}

export default async function ContractDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const contract = contracts.find((item) => item.id === id);
  if (!contract) notFound();

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link href="/admin/contracts" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All contracts
      </Link>
      <PageHeader
        title={contract.type}
        meta={`${contract.client} · ${contract.id}`}
        description={contract.status === "Signed" ? `Signed ${contract.date}` : `Sent ${contract.date}`}
        className="mt-3"
      >
        <StatusBadge tone={contract.status === "Signed" ? "success" : contract.status === "Sent" ? "warning" : "neutral"}>
          {contract.status}
        </StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Type" value={contract.type} note="Template used" icon={FileText} />
        <StatCard label="Client" value={contract.client} note="Signer" icon={FileText} />
        <StatCard label="Date" value={contract.date} note={contract.status} icon={FileText} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Document" description="Read only after signing" className="xl:col-span-2" bodyClassName="p-5">
          <div className="rounded-md border border-border bg-background p-6">
            <p className="font-heading text-lg font-semibold">Elevosia · {contract.type}</p>
            <p className="mt-1 text-xs text-muted-foreground">{contract.client} · {contract.date}</p>
            <div className="mt-5 space-y-2">
              {[90, 100, 96, 100, 72, 100, 88, 60].map((width, index) => (
                <span key={index} className="block h-2 rounded-sm bg-secondary" style={{ width: `${width}%` }} />
              ))}
            </div>
            <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
              <p className="text-[10px] text-muted-foreground">Signature on file</p>
              <span className="font-heading text-lg italic">Sarah Whitfield</span>
            </div>
          </div>
        </SectionCard>
        <ContractActions status={contract.status} />
      </div>
    </div>
  );
}
