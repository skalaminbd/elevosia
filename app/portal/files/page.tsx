import type { Metadata } from "next";
import { FileCheck, FileText, Upload } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { PortalFilesView } from "@/components/portal/PortalFilesView";

export const metadata: Metadata = {
  title: "Files | Elevosia client portal",
};

export default function PortalFilesPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Files and contracts"
        meta="Project"
        description="Every file your team shared, the Blueprints and the agreements. Uploads go straight to your PM."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Shared files" value={5} note="Across 2 projects" icon={FileText} />
        <StatCard label="Signed" value={3} note="1 waiting for signature" icon={FileCheck} tone="success" />
        <StatCard label="This month" value={2} note="Uploaded by your team" icon={Upload} />
      </div>

      <div className="mt-4">
        <PortalFilesView />
      </div>
    </div>
  );
}
