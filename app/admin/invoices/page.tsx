import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { InvoicesData } from "@/components/admin/invoices/InvoicesData";
import { InvoicePlansData } from "@/components/admin/invoices/InvoicePlansData";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { NewInvoiceDialog } from "@/components/admin/invoices/NewInvoiceDialog";

export const metadata: Metadata = {
  title: "Invoices | Elevosia Admin",
};

export default function InvoicesPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Invoices"
        meta="Finance"
        description="What came in, what is due and what needs a nudge. Care plans invoice themselves on the 1st."
      >
        <Button asChild variant="outline">
          <Link href="/admin/invoices/installments">Installments</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/invoices/retainers">Retainers</Link>
        </Button>
        <NewInvoiceDialog />
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
            <div className="h-64 rounded-lg border border-border bg-card" />
          </div>
        }
      >
        <InvoicesData />
      </Suspense>

      <Suspense
        fallback={
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <div className="h-64 rounded-lg border border-border bg-card" />
            <div className="h-64 rounded-lg border border-border bg-card" />
          </div>
        }
      >
        <InvoicePlansData />
      </Suspense>
    </div>
  );
}
