import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { NewBlueprintDialog } from "@/components/admin/blueprints/NewBlueprintDialog";
import { BlueprintsData } from "@/components/admin/blueprints/BlueprintsData";

export const metadata: Metadata = {
  title: "Blueprints | Elevosia Admin",
};

export default function BlueprintsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Blueprints"
        meta="Clients"
        description="Every plan sent to a client, with its version, expiry and fixed price."
      >
        <NewBlueprintDialog />
      </PageHeader>

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
        <BlueprintsData />
      </Suspense>
    </div>
  );
}
