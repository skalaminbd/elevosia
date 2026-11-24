import Link from "next/link";
import { connection } from "next/server";
import { AlertTriangle, ArrowUp, ChevronRight, FileCheck2, Inbox } from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import { listRequirements } from "@/db/queries";
import type { RequirementStatus } from "@/lib/admin-data";

const TONE: Record<RequirementStatus, BadgeTone> = {
  Submitted: "info",
  "In review": "warning",
  "Changes needed": "danger",
  Converted: "success",
  Declined: "neutral",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

/** Requirements inbox from Postgres, read at request time. */
export async function RequirementsData() {
  await connection();
  const requirements = await listRequirements();
  const submitted = requirements.filter(
    (requirement) => requirement.status === "Submitted",
  );
  const review = requirements.filter(
    (requirement) => requirement.status === "In review",
  );
  const changes = requirements.filter(
    (requirement) => requirement.status === "Changes needed",
  );
  const overdue = requirements.filter((requirement) => requirement.overdue);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="New submissions"
          value={submitted.length}
          note={submitted[0]?.client ?? "Nothing new"}
          icon={Inbox}
        />
        <StatCard
          label="In review"
          value={review.length}
          note={review[0]?.client ?? "Nothing open"}
          icon={FileCheck2}
        />
        <StatCard
          label="Changes needed"
          value={changes.length}
          note="Waiting on the client"
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard
          label="Overdue Blueprints"
          value={overdue.length}
          note={overdue[0] ? `${overdue[0].client} · ${overdue[0].due}` : "All on time"}
          icon={AlertTriangle}
          tone="danger"
        />
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowUp className="size-3.5" aria-hidden="true" />
        Sorted by Blueprint due date
      </div>

      <Table className="mt-2">
        <THead>
          <tr>
            <TH>Client</TH>
            <TH>Request</TH>
            <TH>Submitted</TH>
            <TH>Blueprint due</TH>
            <TH>Status</TH>
            <TH>Points</TH>
            <TH>Budget</TH>
            <TH className="w-10" />
          </tr>
        </THead>
        <TBody>
          {requirements.map((requirement) => (
            <TR key={requirement.id}>
              <TD>
                <div className="flex items-center gap-2.5">
                  <Avatar initials={initials(requirement.client)} />
                  <span className="font-medium">{requirement.client}</span>
                </div>
              </TD>
              <TD>
                <Link
                  href={`/admin/requirements/${requirement.id}`}
                  className="font-medium hover:underline"
                >
                  {requirement.title}
                </Link>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {requirement.id} · {requirement.points} points
                </p>
              </TD>
              <TD className="text-muted-foreground">{requirement.submitted}</TD>
              <TD>
                <span
                  className={
                    requirement.overdue
                      ? "font-medium text-destructive"
                      : "text-muted-foreground"
                  }
                >
                  {requirement.due}
                  {requirement.overdue ? " · overdue" : ""}
                </span>
              </TD>
              <TD>
                <StatusBadge tone={TONE[requirement.status]}>
                  {requirement.status}
                </StatusBadge>
              </TD>
              <TD className="font-mono text-xs tabular-nums">
                {requirement.points}
              </TD>
              <TD className="text-xs text-muted-foreground">
                {requirement.budget}
              </TD>
              <TD>
                <Link
                  href={`/admin/requirements/${requirement.id}`}
                  aria-label={`Open ${requirement.client} requirements`}
                  className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </>
  );
}
