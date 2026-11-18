import type { Metadata } from "next";
import { Clock, Gauge, Users, UsersRound } from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import { team, timesheet } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Team | Elevosia Admin",
};

export default function TeamPage() {
  const planned = team.reduce((sum, member) => sum + member.planned, 0);
  const capacity = team.reduce((sum, member) => sum + member.capacity, 0);

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Team & timesheets"
        meta="Team & growth"
        description="Who is on what, hours planned against capacity, and this week's logged time."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Team" value={team.length} note="Senior only" icon={UsersRound} />
        <StatCard label="Planned this week" value={`${planned} h`} note={`of ${capacity} h capacity`} icon={Clock} />
        <StatCard label="Utilisation" value={`${Math.round((planned / capacity) * 100)}%`} note="Target 75–85%" icon={Gauge} />
        <StatCard label="Over capacity" value={1} note="Sam at 41 h" icon={Users} tone="warning" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Workload this week"
          description="Planned hours against capacity"
          bodyClassName="divide-y divide-border"
        >
          {team.map((member) => {
            const ratio = Math.round((member.planned / member.capacity) * 100);
            return (
              <div key={member.id} className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={member.initials} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.role} · {member.projects} projects
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {member.planned} / {member.capacity} h
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <Progress
                    className="flex-1"
                    value={ratio}
                    tone={ratio > 100 ? "danger" : ratio > 90 ? "warning" : "primary"}
                  />
                  <span className="w-9 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                    {ratio}%
                  </span>
                </div>
              </div>
            );
          })}
        </SectionCard>

        <SectionCard
          title="This week's timesheet"
          description="Logged hours by task"
          bodyClassName="overflow-x-auto"
        >
          <Table minWidth={false} bare>
            <THead>
              <tr>
                <TH>Person</TH>
                <TH>Project</TH>
                <TH>Task</TH>
                <TH>Hours</TH>
              </tr>
            </THead>
            <TBody>
              {timesheet.map((row) => (
                <TR key={row.id}>
                  <TD className="font-medium">{row.member}</TD>
                  <TD className="text-xs text-muted-foreground">{row.project}</TD>
                  <TD className="text-xs">{row.task}</TD>
                  <TD className="font-mono text-xs tabular-nums">{row.hours} h</TD>
                </TR>
              ))}
            </TBody>
          </Table>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs">
            <span className="text-muted-foreground">Total logged</span>
            <StatusBadge tone="success">
              {timesheet.reduce((sum, row) => sum + row.hours, 0)} h
            </StatusBadge>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
