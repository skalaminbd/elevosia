import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PortalReportsData } from "@/components/portal/PortalReportsData";

export const metadata: Metadata = {
  title: "Reports | Elevosia client portal",
};

export default function PortalReportsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Reports"
        meta="Support"
        description="Monthly project reports and the marketing reports your team published."
      />

      <Suspense
        fallback={
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-24 rounded-lg border border-border bg-card" />
              ))}
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-40 rounded-lg border border-border bg-card" />
              ))}
            </div>
          </div>
        }
      >
        <PortalReportsData />
      </Suspense>
    </div>
  );
}
