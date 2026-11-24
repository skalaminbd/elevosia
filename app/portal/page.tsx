import type { Metadata } from "next";
import { Suspense } from "react";
import { PortalHomeData } from "@/components/portal/PortalHomeData";

export const metadata: Metadata = {
  title: "Home | Elevosia client portal",
};

export default function PortalHomePage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="h-8 w-64 rounded bg-secondary" />
            <div className="grid gap-4 xl:grid-cols-3">
              <div className="h-72 rounded-lg border border-border bg-card xl:col-span-2" />
              <div className="h-72 rounded-lg border border-border bg-card" />
            </div>
          </div>
        }
      >
        <PortalHomeData />
      </Suspense>
    </div>
  );
}
