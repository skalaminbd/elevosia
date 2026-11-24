import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { RequestsNewData } from "@/components/portal/RequestsNewData";

export const metadata: Metadata = {
  title: "Request new work | Elevosia client portal",
};

export default function NewRequestPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Request new work"
        meta="Care plan"
        description="Small additions and changes for retainer clients. Your PM replies with an estimate in hours."
      />

      <Suspense
        fallback={
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
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
        <RequestsNewData />
      </Suspense>
    </div>
  );
}
