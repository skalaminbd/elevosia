import type { Metadata } from "next";
import { CheckCircle2, Clock, FileEdit } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { ApprovalsList } from "@/components/portal/ApprovalsList";
import { portalApprovals, approvalHistory } from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Approvals | Elevosia client portal",
};

export default function PortalApprovalsPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="Approvals"
        meta="Project"
        description="Plans, designs and change requests that need your answer. Approving unlocks the next step."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Waiting for you" value={portalApprovals.length} note="Oldest: today" icon={Clock} tone="warning" />
        <StatCard label="Approved this month" value={approvalHistory.length} note="All on time" icon={CheckCircle2} tone="success" />
        <StatCard label="Change requests" value={1} note="Family access · $900" icon={FileEdit} />
      </div>

      <div className="mt-4">
        <ApprovalsList />
      </div>
    </div>
  );
}
