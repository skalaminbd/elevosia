import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PortalFilesData } from "@/components/portal/PortalFilesData";

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

      <Suspense
        fallback={
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-24 rounded-lg border border-border bg-card" />
              ))}
            </div>
            <div className="h-64 rounded-lg border border-border bg-card" />
          </div>
        }
      >
        <PortalFilesData />
      </Suspense>
    </div>
  );
}
