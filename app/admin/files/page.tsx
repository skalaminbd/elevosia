import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { FilesData } from "@/components/admin/files/FilesData";

export const metadata: Metadata = {
  title: "Files | Elevosia Admin",
};

export default function FilesPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Files"
        meta="Delivery"
        description="Folders, versions and client visibility. Internal by default; switch a file on to show it in the portal."
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
        <FilesData />
      </Suspense>
    </div>
  );
}
