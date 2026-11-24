import { connection } from "next/server";
import { FileText } from "lucide-react";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { listContractTemplates } from "@/db/queries";

/** Contract templates from Postgres, read at request time. */
export async function TemplatesData() {
  await connection();
  const templates = await listContractTemplates();

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {templates.map((template) => (
        <SectionCard
          key={template.id}
          title={template.name}
          description={`${template.used} contracts · updated ${template.updated}`}
          action={<StatusBadge tone="neutral">Template</StatusBadge>}
        >
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
  );
}
