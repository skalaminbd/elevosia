"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Dialog } from "@/components/shared/Dialog";
import { RequirementsBuilder } from "./RequirementsBuilder";

export function NewRequirementDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog
      trigger={children}
      icon={<Sparkles className="size-4" aria-hidden="true" />}
      title="Start a new project"
      description="Tell us what you need in plain words. Your PM turns it into a fixed-price Blueprint."
      size="xl"
    >
      {(close) => <RequirementsBuilder onDone={close} />}
    </Dialog>
  );
}
