"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Dialog } from "@/components/shared/Dialog";
import { Button } from "@/components/ui/button";
import { InvoiceForm } from "./InvoiceForm";

export function NewInvoiceDialog({ children }: { children?: ReactNode }) {
  return (
    <Dialog
      trigger={
        children ?? (
          <Button size="sm">
            <Plus className="size-4" aria-hidden="true" />
            New invoice
          </Button>
        )
      }
      title="New invoice"
      description="One-time, milestone, care plan or change request."
      size="lg"
    >
      {(close) => <InvoiceForm plain onDone={close} />}
    </Dialog>
  );
}
