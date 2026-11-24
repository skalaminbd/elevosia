import { connection } from "next/server";
import { CheckCircle2, Clock, FileEdit } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { ApprovalsList } from "@/components/portal/ApprovalsList";
import {
  listPortalApprovalHistory,
  listPortalApprovals,
} from "@/db/queries";
import { requirePortalClientId } from "@/lib/portal-session";

/** Client approvals from Postgres, read at request time. */
export async function PortalApprovalsData() {
  await connection();
  const clientId = await requirePortalClientId();
  const [approvals, history] = await Promise.all([
    listPortalApprovals(clientId),
    listPortalApprovalHistory(clientId),
  ]);
  const changes = approvals.filter(
    (approval) => approval.type === "Change request",
  );

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Waiting for you"
          value={approvals.length}
          note="Oldest first"
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="Approved this month"
          value={history.length}
          note="All on time"
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Change requests"
          value={changes.length}
          note={
            changes[0]
              ? `${changes[0].title}${changes[0].amount ? ` · $${changes[0].amount}` : ""}`
              : "None waiting"
          }
          icon={FileEdit}
        />
      </div>

      <div className="mt-4">
        <ApprovalsList approvals={approvals} history={history} />
      </div>
    </>
  );
}
