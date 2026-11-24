import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ProjectsData } from "@/components/admin/projects/ProjectsData";
import { NewProjectDialog } from "@/components/admin/projects/NewProjectDialog";

export const metadata: Metadata = {
  title: "Projects | Elevosia Admin",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Projects"
        meta="Delivery"
        description="Every build, its health and its budget. List, board or timeline."
      >
        <NewProjectDialog />
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
        <ProjectsData />
      </Suspense>
    </div>
  );
}
