import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { RequestsData } from "@/components/admin/tickets/RequestsData";

export const metadata: Metadata = { title: "Work requests | Elevosia Admin" };

export default function WorkRequestsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Work requests"
        meta="Support"
        description="Small additions from care plan and retainer clients. Accept as a task or turn them into requirements."
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
        <RequestsData />
      </Suspense>
    </div>
  );
}
