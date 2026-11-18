import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { InvoiceForm } from "@/components/admin/invoices/InvoiceForm";

export const metadata: Metadata = { title: "New invoice | Elevosia Admin" };

export default function NewInvoicePage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="New invoice"
        meta="Finance"
        description="One-time, milestone, care plan or change request. Payment terms come from the contract."
      />
      <div className="mt-6 max-w-3xl">
        <InvoiceForm />
      </div>
    </div>
  );
}
