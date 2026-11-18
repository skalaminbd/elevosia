"use client";

import type { ReactNode } from "react";
import { Dialog } from "@/components/shared/Dialog";
import { NewRequestForm } from "./NewRequestForm";

export function NewRequestDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog
      trigger={children}
      title="Request new work"
      description="For care plan clients. Small additions use your monthly hours."
      size="lg"
    >
      {(close) => <NewRequestForm plain onDone={close} />}
    </Dialog>
  );
}
