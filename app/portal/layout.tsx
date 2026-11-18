import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata: Metadata = {
  title: "Client portal | Elevosia",
  description: "Your projects, approvals, invoices and files with Elevosia.",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
