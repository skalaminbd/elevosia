"use client";

import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { ClientDialogForm } from "@/components/admin/clients/ClientDialogForm";

export function NewClientDialog({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        children ?? (
          <Button>
            <Plus className="size-4" aria-hidden="true" />
            Add client
          </Button>
        )
      }
      size="lg"
    >
      <ClientDialogForm mode="new" onClose={() => setOpen(false)} />
    </AppDialog>
  );
}
