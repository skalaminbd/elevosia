import type { Metadata } from "next";
import { FolderKanban, Layers, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { PortalProjectsList } from "@/components/portal/PortalProjectsList";
import { portalProjects } from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Projects | Elevosia client portal",
};

export default function PortalProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="My projects"
        meta="Projects"
        description="Every project, from the first week to the warranty. Open one to see its weekly board."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Projects" value={portalProjects.length} note="1 active, 1 complete" icon={FolderKanban} />
        <StatCard label="Modules live" value={8} note="Across both projects" icon={Layers} />
        <StatCard label="Warranty" value="30 days" note="To 18 Dec on booking" icon={ShieldCheck} />
      </div>

      <div className="mt-4">
        <PortalProjectsList />
      </div>
    </div>
  );
}
