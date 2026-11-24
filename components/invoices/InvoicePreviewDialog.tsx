"use client";

import { useState, type ReactNode } from "react";
import { Eye, Receipt } from "lucide-react";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import {
  InvoiceDocument,
  type InvoiceDoc,
} from "@/components/invoices/InvoiceDocument";
import { printInvoice } from "@/lib/invoice-file";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";

/** View, preview, download and print an invoice. */
export function InvoicePreviewDialog({
  invoice,
  children,
}: {
  invoice: InvoiceDoc;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        children ?? (
          <Button variant="outline">
            <Eye className="size-4" aria-hidden="true" />
            Preview
          </Button>
        )
      }
      size="lg"
    >
      <AppDialog.Header
        icon={Receipt}
        title={`Invoice ${invoice.id}`}
        subtitle={`${invoice.client} · ${invoice.kind}`}
      />
      <AppDialog.Body>
        <InvoiceDocument invoice={invoice} />
      </AppDialog.Body>
      <AppDialog.Footer
        secondary={{
          label: "Download",
          onClick: () => downloadInvoicePdf(invoice),
        }}
        primary={{
          label: "Print / Save PDF",
          onClick: () => printInvoice(invoice),
        }}
      />
    </AppDialog>
  );
}
