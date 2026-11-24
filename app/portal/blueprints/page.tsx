import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PortalBlueprintsData } from "@/components/portal/PortalBlueprintsData";

export const metadata: Metadata = {
  title: "Blueprints | Elevosia client portal",
};

export default function PortalBlueprintsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Blueprints"
        meta="Project"
        description="Every plan your PM shared, with milestones, payments and what is in scope."
      />

      <Suspense
        fallback={
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-lg border border-border bg-card"
                />
              ))}
            </div>
            <div className="h-64 rounded-lg border border-border bg-card" />
          </div>
        }
      >
        <PortalBlueprintsData />
      </Suspense>
    </div>
  );
}
