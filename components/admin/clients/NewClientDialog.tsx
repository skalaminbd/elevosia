"use client";

import type { ReactNode } from "react";
import { Plus, UserPlus } from "lucide-react";
import { Dialog } from "@/components/shared/Dialog";
import { Button } from "@/components/ui/button";
import { ClientForm } from "./ClientForm";

export function NewClientDialog({ children }: { children?: ReactNode }) {
  return (
    <Dialog
      trigger={
        children ?? (
          <Button size="sm">
            <Plus className="size-4" aria-hidden="true" />
            Add client
          </Button>
        )
      }
      icon={<UserPlus className="size-4" aria-hidden="true" />}
      title="Add a client"
      description="Company, contact and portal access. Projects and billing come after."
      size="lg"
    >
      {(close) => <ClientForm mode="new" plain onDone={close} />}
    </Dialog>
  );
}
