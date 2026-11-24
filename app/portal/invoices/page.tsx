import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PortalInvoicesData } from "@/components/portal/PortalInvoicesData";

export const metadata: Metadata = {
  title: "Invoices | Elevosia client portal",
};

export default function PortalInvoicesPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Invoices and payments"
        meta="Billing"
        description="What is due, what is paid, and the care plan hours behind the work."
      />

      <Suspense
        fallback={
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-24 rounded-lg border border-border bg-card" />
              ))}
            </div>
            <div className="h-64 rounded-lg border border-border bg-card" />
          </div>
        }
      >
        <PortalInvoicesData />
      </Suspense>
    </div>
  );
}
