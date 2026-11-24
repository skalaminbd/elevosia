import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { ContractsData } from "@/components/admin/contracts/ContractsData";
import { NewContractDialog } from "@/components/admin/contracts/NewContractDialog";
import { NewTemplateDialog } from "@/components/admin/contracts/NewTemplateDialog";

export const metadata: Metadata = {
  title: "Contracts | Elevosia Admin",
};

export default function ContractsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Contracts"
        meta="Finance"
        description="Every contract by client and project, with the templates new ones start from."
      >
        <Button asChild variant="outline">
          <Link href="/admin/contracts/nda">NDAs</Link>
        </Button>
        <NewTemplateDialog />
        <NewContractDialog />
      </PageHeader>

      <Suspense
        fallback={
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-lg border border-border bg-card"
                />
              ))}
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="h-4 w-32 rounded bg-secondary" />
              <div className="mt-4 space-y-2">
                <div className="h-9 w-full rounded bg-secondary/60" />
                <div className="h-9 w-full rounded bg-secondary/60" />
                <div className="h-9 w-3/4 rounded bg-secondary/60" />
              </div>
            </div>
          </div>
        }
      >
        <ContractsData />
      </Suspense>
    </div>
  );
}
