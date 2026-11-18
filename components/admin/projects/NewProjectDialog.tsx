"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Dialog } from "@/components/shared/Dialog";
import { Button } from "@/components/ui/button";
import { NewProjectForm } from "./NewProjectForm";

export function NewProjectDialog({ children }: { children?: ReactNode }) {
  return (
    <Dialog
      trigger={
        children ?? (
          <Button size="sm">
            <Plus className="size-4" aria-hidden="true" />
            New project
          </Button>
        )
      }
      title="New project"
      description="Start from an approved Blueprint, or from an internal template."
      size="lg"
    >
      {(close) => <NewProjectForm plain onDone={close} />}
    </Dialog>
  );
}
