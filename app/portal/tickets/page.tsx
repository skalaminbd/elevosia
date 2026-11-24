import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PortalTicketsData } from "@/components/portal/PortalTicketsData";

export const metadata: Metadata = {
  title: "Tickets | Elevosia client portal",
};

export default function PortalTicketsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Support tickets"
        meta="Support"
        description="Something broken or a small question. Your PM sees it right away."
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
        <PortalTicketsData />
      </Suspense>
    </div>
  );
}
