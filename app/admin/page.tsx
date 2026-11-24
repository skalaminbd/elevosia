import type { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { CreateNewMenu } from "@/components/admin/dashboard/CreateNewMenu";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { DashboardData } from "@/components/admin/dashboard/DashboardData";

export const metadata: Metadata = {
  title: "Overview | Elevosia Admin",
};

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Good morning, Alamin"
        meta="US Eastern"
        description="What is waiting on you today, pulled live from the workspace."
      >
        <CreateNewMenu />
      </PageHeader>

      <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">AI briefing</p>
            <p className="mt-1 max-w-3xl text-sm text-foreground/80">
              Two Blueprints are waiting for a client answer, and Lumen Studio
              has been waiting a day on a change request. Northwind launches
              this week — the checklist is still unsent. Nothing else needs you
              before the 9:30 call.
            </p>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-lg border border-border bg-card"
                />
              ))}
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              <div className="h-64 rounded-lg border border-border bg-card xl:col-span-2" />
              <div className="h-64 rounded-lg border border-border bg-card" />
            </div>
          </div>
        }
      >
        <DashboardData />
      </Suspense>
    </div>
  );
}
