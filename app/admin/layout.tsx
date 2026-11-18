import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/admin/sidebar/Sidebar";
import type { SidebarRole } from "@/components/admin/sidebar/nav-config";
import { getSidebarCounts } from "@/lib/admin/sidebar-counts";

export const metadata: Metadata = {
  title: "Admin | Elevosia",
  description: "Elevosia client management admin panel.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Auth lands in a later phase. Until then the panel renders as Admin.
  const role: SidebarRole = "admin";
  const counts = getSidebarCounts(role);

  return (
    <Sidebar role={role} initialCounts={counts}>
      {children}
    </Sidebar>
  );
}
