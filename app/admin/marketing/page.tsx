import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { MarketingData } from "@/components/admin/marketing/MarketingData";

export const metadata: Metadata = {
  title: "Marketing | Elevosia Admin",
};

export default function MarketingPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Marketing"
        meta="Team & growth"
        description="Campaigns, content and the numbers behind them. Website work for clients is tracked separately."
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
        <MarketingData />
      </Suspense>
    </div>
  );
}
