import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PortalApprovalsData } from "@/components/portal/PortalApprovalsData";

export const metadata: Metadata = {
  title: "Approvals | Elevosia client portal",
};

export default function PortalApprovalsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Approvals"
        meta="Project"
        description="Plans, designs and change requests that need your answer. Approving unlocks the next step."
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
        <PortalApprovalsData />
      </Suspense>
    </div>
  );
}
