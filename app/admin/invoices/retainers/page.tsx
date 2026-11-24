import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { RetainersData } from "@/components/admin/invoices/RetainersData";

export const metadata: Metadata = { title: "Retainers and care plans | Elevosia Admin" };

export default function RetainersPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/invoices"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Invoices
      </Link>
      <PageHeader
        title="Retainers and care plans"
        meta="Finance"
        description="Monthly plans, their hours bucket and the next automatic invoice."
        className="mt-3"
      />

      <Suspense
        fallback={
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-lg border border-border bg-card"
                />
              ))}
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-40 rounded-lg border border-border bg-card"
                />
              ))}
            </div>
          </div>
        }
      >
        <RetainersData />
      </Suspense>
    </div>
  );
}
