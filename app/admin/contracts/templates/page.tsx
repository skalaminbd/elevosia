import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export const metadata: Metadata = { title: "Contract templates | Elevosia Admin" };

const TEMPLATES = [
  { id: "T-1", name: "Service agreement", used: 12, updated: "12 Oct 2026", body: "Scope, milestones, payments, ownership on final payment, liability limits." },
  { id: "T-2", name: "NDA", used: 4, updated: "2 Sep 2026", body: "Mutual confidentiality before requirements or files are shared." },
  { id: "T-3", name: "Change request", used: 6, updated: "18 Oct 2026", body: "New scope after approval, with price and timeline impact." },
  { id: "T-4", name: "Care plan agreement", used: 5, updated: "1 Nov 2026", body: "Hours, response time, billing on the 1st and cancellation terms." },
];

export default function TemplatesPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link href="/admin/contracts" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Contracts
      </Link>
      <PageHeader
        title="Contract templates"
        meta="Finance"
        description="The four documents every project uses. Edits need Admin approval."
        className="mt-3"
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {TEMPLATES.map((template) => (
          <SectionCard key={template.id} title={template.name} description={`${template.used} contracts · updated ${template.updated}`} action={<StatusBadge tone="neutral">Template</StatusBadge>}>
            <div className="p-5">
              <p className="text-sm text-muted-foreground">{template.body}</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <FileText className="size-3.5" aria-hidden="true" />
                {template.id} · PDF and e-sign version
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
