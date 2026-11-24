import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { DeletionRequestsData } from "@/components/admin/clients/DeletionRequestsData";

export const metadata: Metadata = {
  title: "Deletion requests | Elevosia Admin",
};

export default function DeletionRequestsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Clients
      </Link>
      <PageHeader
        title="Deletion requests"
        meta="Clients"
        description="Export first, then purge. Purged records stay in the archive for 30 days."
        className="mt-3"
      />

      <div className="mt-6">
        <Suspense
          fallback={
            <div className="h-64 rounded-lg border border-border bg-card" />
          }
        >
          <DeletionRequestsData />
        </Suspense>
      </div>
    </div>
  );
}
