import type { Metadata } from "next";
import { AlertTriangle, ArrowUp, FileCheck2, Inbox } from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge, type BadgeTone } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import { requirements, type RequirementStatus } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Requirements | Elevosia Admin",
};

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

export default function RequirementsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Requirements"
        meta="Clients"
        description="Submissions waiting for a Blueprint, sorted by the oldest due date first."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="New submissions" value={1} note="Submitted this week" icon={Inbox} />
        <StatCard label="In review" value={1} note="Cedarbrook Schools" icon={FileCheck2} />
        <StatCard label="Changes needed" value={1} note="Waiting on the client" icon={AlertTriangle} tone="warning" />
        <StatCard label="Overdue Blueprints" value={1} note="Lumen Studio · 3 days" icon={AlertTriangle} tone="danger" />
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
                <p className="font-medium">{requirement.title}</p>
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
              <TD className="font-mono text-xs tabular-nums">{requirement.points}</TD>
              <TD className="text-xs text-muted-foreground">{requirement.budget}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
