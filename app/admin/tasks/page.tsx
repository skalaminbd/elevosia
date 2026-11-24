import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { TasksData } from "@/components/admin/tasks/TasksData";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tasks | Elevosia Admin",
};

export default function TasksPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Tasks"
        meta="Delivery"
        description="Your week first, then the whole board. Client-visible work updates the portal the moment it moves."
      >
        <Button asChild variant="outline">
          <Link href="/admin/tasks/mine">My tasks</Link>
        </Button>
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
        <TasksData />
      </Suspense>
    </div>
  );
}
