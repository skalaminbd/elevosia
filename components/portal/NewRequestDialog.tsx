"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Dialog } from "@/components/shared/Dialog";
import { NewRequestForm } from "./NewRequestForm";

export function NewRequestDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog
      trigger={children}
      icon={<Sparkles className="size-4" aria-hidden="true" />}
      title="Request new work"
      description="For care plan clients. Small additions use your monthly hours."
      size="lg"
    >
      {(close) => <NewRequestForm plain onDone={close} />}
    </Dialog>
  );
}
