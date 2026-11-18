import type { Metadata } from "next";
import { AlertTriangle, FolderKanban, ShieldCheck, Wrench } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ProjectsView } from "@/components/admin/projects/ProjectsView";
import { StatCard } from "@/components/admin/ui/StatCard";

export const metadata: Metadata = {
  title: "Projects | Elevosia Admin",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Projects"
        meta="Delivery"
        description="Every build, its health and its budget. List, board or timeline."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Active projects" value={4} note="2 building, 1 review" icon={FolderKanban} />
        <StatCard label="At risk" value={1} note="Lumen Studio · blocked" icon={AlertTriangle} tone="warning" />
        <StatCard label="Late" value={1} note="Ridgeline · on hold" icon={Wrench} tone="danger" />
        <StatCard label="In warranty" value={1} note="Harbor ends 18 Dec" icon={ShieldCheck} />
      </div>

      <div className="mt-4">
        <ProjectsView />
      </div>
    </div>
  );
}
