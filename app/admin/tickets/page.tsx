import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { TicketsData } from "@/components/admin/tickets/TicketsData";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tickets | Elevosia Admin",
};

export default function TicketsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Tickets"
        description="Support requests with SLA timers. Claim one or open it to reply."
      >
        <Button asChild variant="outline">
          <Link href="/admin/tickets/canned-replies">Canned replies</Link>
        </Button>
      </PageHeader>

      <div className="mt-6">
        <Suspense
          fallback={
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="h-8 w-1/2 rounded bg-secondary" />
              <div className="mt-4 space-y-2">
                <div className="h-10 w-full rounded bg-secondary/60" />
                <div className="h-10 w-full rounded bg-secondary/60" />
                <div className="h-10 w-3/4 rounded bg-secondary/60" />
              </div>
            </div>
          }
        >
          <TicketsData />
        </Suspense>
      </div>
    </div>
  );
}
