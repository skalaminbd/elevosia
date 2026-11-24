import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { CallsData } from "@/components/admin/calls/CallsData";

export const metadata: Metadata = {
  title: "Calls | Elevosia Admin",
};

export default function CallsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Calls"
        meta="Delivery"
        description="Today's client calls, the week ahead and the notes that came out of each one."
      />

      <Suspense
        fallback={
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
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
        <CallsData />
      </Suspense>
    </div>
  );
}
