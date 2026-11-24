import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PortalCallsData } from "@/components/portal/PortalCallsData";

export const metadata: Metadata = {
  title: "Calls | Elevosia client portal",
};

export default function PortalCallsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Calls"
        meta="Support"
        description="Your next call, the notes from past ones and the actions that came out of them."
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
        <PortalCallsData />
      </Suspense>
    </div>
  );
}
