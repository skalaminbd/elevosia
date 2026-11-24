"use client";

import { useState, type ReactNode } from "react";
import { Pencil } from "lucide-react";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { ClientDialogForm } from "@/components/admin/clients/ClientDialogForm";
import type { AdminClient } from "@/lib/admin-data";

export function EditClientDialog({
  client,
  children,
}: {
  client: AdminClient;
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
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </Button>
        )
      }
      size="lg"
    >
      <ClientDialogForm
        mode="edit"
        client={client}
        onClose={() => setOpen(false)}
      />
    </AppDialog>
  );
}
