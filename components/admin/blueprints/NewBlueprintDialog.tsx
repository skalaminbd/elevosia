"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Dialog } from "@/components/shared/Dialog";
import { Button } from "@/components/ui/button";
import { BlueprintForm } from "./BlueprintForm";

export function NewBlueprintDialog({
  requirementId,
  children,
}: {
  requirementId?: string;
  children?: ReactNode;
}) {
  return (
    <Dialog
      trigger={
        children ?? (
          <Button size="sm">
            <Plus className="size-4" aria-hidden="true" />
            New Blueprint
          </Button>
        )
      }
      title="New Blueprint"
      description="Milestones, tasks and a fixed price. Nothing is sent until you choose."
      size="xl"
    >
      {(close) => (
        <BlueprintForm requirementId={requirementId} plain onDone={close} />
      )}
    </Dialog>
  );
}
