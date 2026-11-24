import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { MyTasksData } from "@/components/admin/tasks/MyTasksData";

export const metadata: Metadata = { title: "My tasks | Elevosia Admin" };

export default function MyTasksPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="My tasks"
        meta="Delivery"
        description="Everything assigned to you, this week first."
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
        <MyTasksData />
      </Suspense>
    </div>
  );
}
