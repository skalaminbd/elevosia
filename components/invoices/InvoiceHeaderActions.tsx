"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoicePreviewDialog } from "@/components/invoices/InvoicePreviewDialog";
import type { InvoiceDoc } from "@/components/invoices/InvoiceDocument";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";

export function InvoiceHeaderActions({ invoice }: { invoice: InvoiceDoc }) {
  return (
    <>
      <InvoicePreviewDialog invoice={invoice} />
      <Button variant="outline" onClick={() => downloadInvoicePdf(invoice)}>
        <Download className="size-4" aria-hidden="true" />
        Download
      </Button>
    </>
  );
}
