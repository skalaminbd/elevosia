import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { TemplatesData } from "@/components/admin/contracts/TemplatesData";
import { NewTemplateDialog } from "@/components/admin/contracts/NewTemplateDialog";

export const metadata: Metadata = { title: "Contract templates | Elevosia Admin" };

export default function TemplatesPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/contracts"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Contracts
      </Link>
      <PageHeader
        title="Contract templates"
        meta="Finance"
        description="The documents every contract starts from. Templates are added, never edited."
        className="mt-3"
      >
        <NewTemplateDialog />
      </PageHeader>

      <Suspense
        fallback={
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 rounded-lg border border-border bg-card"
              />
            ))}
          </div>
        }
      >
        <TemplatesData />
      </Suspense>
    </div>
  );
}
