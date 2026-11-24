import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ClientsData } from "@/components/admin/clients/ClientsData";
import { NewClientDialog } from "@/components/admin/clients/NewClientDialog";

export const metadata: Metadata = {
  title: "Clients | Elevosia Admin",
};

export default function ClientsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Clients"
        description="Every company account, its projects, care plan and balance in one list."
      >
        <NewClientDialog />
      </PageHeader>

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
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="h-4 w-32 rounded bg-secondary" />
              <div className="mt-4 space-y-2">
                <div className="h-9 w-full rounded bg-secondary/60" />
                <div className="h-9 w-full rounded bg-secondary/60" />
                <div className="h-9 w-3/4 rounded bg-secondary/60" />
              </div>
            </div>
          </div>
        }
      >
        <ClientsData />
      </Suspense>
    </div>
  );
}
