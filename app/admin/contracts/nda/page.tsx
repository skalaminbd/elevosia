import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { NdaData } from "@/components/admin/contracts/NdaData";

export const metadata: Metadata = { title: "NDAs | Elevosia Admin" };

export default function NdaPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/contracts"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Contracts
      </Link>
      <PageHeader
        title="NDAs"
        meta="Finance"
        description="Signed before requirements. The client can request one from the portal."
        className="mt-3"
      />

      <Suspense
        fallback={
          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <div className="h-64 rounded-lg border border-border bg-card xl:col-span-2" />
            <div className="h-64 rounded-lg border border-border bg-card" />
          </div>
        }
      >
        <NdaData />
      </Suspense>
    </div>
  );
}
