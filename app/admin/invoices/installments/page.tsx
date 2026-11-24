import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  InstallmentsData,
  InstallmentsHeader,
} from "@/components/admin/invoices/InstallmentsData";

export const metadata: Metadata = { title: "Installment plans | Elevosia Admin" };

export default function InstallmentsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <InstallmentsHeader />
      <PageHeader
        title="Installment plans"
        meta="Finance"
        description="Every plan, what is paid, what is next and any missed payment."
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
            <div className="h-64 rounded-lg border border-border bg-card" />
          </div>
        }
      >
        <InstallmentsData />
      </Suspense>
    </div>
  );
}
