import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { RequirementsData } from "@/components/admin/requirements/RequirementsData";

export const metadata: Metadata = {
  title: "Requirements | Elevosia Admin",
};

export default function RequirementsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Requirements"
        meta="Clients"
        description="Submissions waiting for a Blueprint, sorted by the oldest due date first."
      />

      <Suspense
        fallback={
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
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
        <RequirementsData />
      </Suspense>
    </div>
  );
}
