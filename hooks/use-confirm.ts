"use client";

import { createContext, useContext } from "react";
import type { LucideIcon } from "lucide-react";

export type ConfirmOptions = {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
};

export const ConfirmContext = createContext<
  ((options: ConfirmOptions) => Promise<boolean>) | null
>(null);

/** Promise-based confirmation, rendered by ConfirmProvider in the root layout. */
export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error("useConfirm must be used inside ConfirmProvider");
  }
  return confirm;
}
