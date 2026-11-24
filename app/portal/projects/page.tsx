import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PortalProjectsData } from "@/components/portal/PortalProjectsData";

export const metadata: Metadata = {
  title: "Projects | Elevosia client portal",
};

export default function PortalProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="My projects"
        meta="Projects"
        description="Every project, from the first week to the warranty. Open one to see its weekly board."
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
        <PortalProjectsData />
      </Suspense>
    </div>
  );
}
