import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { RequestActions } from "@/components/admin/tickets/RequestActions";
import type { WorkRequest } from "@/lib/admin-data";

/** One work request from Postgres. */
export function WorkRequestDetail({ request }: { request: WorkRequest }) {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/tickets/requests"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Work requests
      </Link>
      <PageHeader
        title={request.title}
        meta={`${request.client} · ${request.id}`}
        description={`Submitted ${request.submitted} · ${request.pm} is the PM`}
        className="mt-3"
      >
        <StatusBadge tone={request.status === "Submitted" ? "info" : "success"}>
          {request.status}
        </StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Estimate"
          value={`${request.hours} h`}
          note="From care plan hours"
          icon={Clock}
        />
        <StatCard label="Client" value={request.client} note="Growth care" icon={Clock} />
        <StatCard
          label="Submitted"
          value={request.submitted}
          note="Oldest first"
          icon={Clock}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Scope"
          description="What the client asked for"
          className="xl:col-span-2"
          bodyClassName="p-5"
        >
          <p className="text-sm text-muted-foreground">{request.detail}</p>
        </SectionCard>
        <RequestActions status={request.status} />
      </div>
    </div>
  );
}
