import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ProjectTabs } from "@/components/portal/ProjectTabs";

type BoardState = "done" | "progress" | "carried" | "next";

export type PortalProjectDetailData = {
  project: {
    id: string;
    name: string;
    status: string;
    progress: number;
    start: string;
    end: string;
    health: string;
    phase: string;
    nextMilestone: string;
    modules: number;
  };
  boardWeeks: {
    id: string;
    label: string;
    dates: string;
    tasks: { id: string; title: string; state: BoardState }[];
  }[];
  milestones: {
    id: string;
    label: string;
    due: string;
    state: "done" | "current" | "next";
    tasks: number;
  }[];
  files: {
    id: string;
    name: string;
    folder: string;
    project: string;
    size: string;
    updated: string;
    version: string;
  }[];
  invoices: {
    id: string;
    project: string;
    kind: string;
    amount: number;
    due: string;
    status: string;
  }[];
  calls: {
    upcoming: {
      id: string;
      title: string;
      when: string;
      with: string;
      join: string;
    } | null;
    past: {
      id: string;
      title: string;
      when: string;
      notes: string;
      actions: string[];
    }[];
  };
};

/** One client project, rendered from Postgres rows. */
export function PortalProjectDetail({
  data,
}: {
  data: PortalProjectDetailData;
}) {
  const { project, boardWeeks, milestones, files, invoices, calls } = data;
  const active = project.status !== "Completed";

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/portal/projects"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All projects
      </Link>

      <PageHeader
        title={project.name}
        meta={project.phase}
        description={`${project.start} → ${project.end} · ${project.modules} modules`}
        className="mt-3"
      >
        <StatusBadge
          tone={project.health === "On track" ? "success" : "warning"}
        >
          {project.health}
        </StatusBadge>
        <StatusBadge tone={project.status === "Active" ? "accent" : "success"}>
          {project.status}
        </StatusBadge>
      </PageHeader>

      <div className="mt-5 rounded-lg border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>Overall progress · client-visible tasks</span>
          <span className="font-mono">{project.progress}%</span>
        </div>
        <div className="mt-2">
          <Progress
            value={project.progress}
            tone={project.progress === 100 ? "success" : "primary"}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Next milestone: {project.nextMilestone}
        </p>
      </div>

      {active ? (
        <div className="mt-4">
          <ProjectTabs
            boardWeeks={boardWeeks}
            milestones={milestones}
            files={files}
            invoices={invoices}
            calls={calls}
          />
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Progress"
              value={`${project.progress}%`}
              note="Client-visible"
              icon={CheckCircle2}
              tone="success"
            />
            <StatCard
              label="Closed"
              value={project.end}
              note="Warranty ended"
              icon={CalendarClock}
            />
            <StatCard
              label="Warranty"
              value="30 days"
              note="After launch"
              icon={ShieldCheck}
            />
            <StatCard
              label="Modules"
              value={project.modules}
              note="Delivered"
              icon={FileText}
            />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <SectionCard title="Launch summary" description="What went live">
              <div className="space-y-3 p-5 text-sm text-muted-foreground">
                <p>
                  Every module in scope is live and the handover checklist is
                  complete.
                </p>
                <p>The launch checklist and handover notes are in Files.</p>
              </div>
            </SectionCard>
            <SectionCard
              title="Files from this project"
              description="Client-visible"
              bodyClassName="divide-y divide-border"
            >
              {files.length === 0 ? (
                <p className="px-5 py-6 text-sm text-muted-foreground">
                  No files yet.
                </p>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <FileText
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {file.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {file.size}
                    </span>
                  </div>
                ))
              )}
            </SectionCard>
          </div>

          <SectionCard
            title="Call notes"
            description="Client-visible notes"
            className="mt-4"
            bodyClassName="divide-y divide-border"
          >
            {calls.past.map((call) => (
              <div key={call.id} className="px-5 py-4">
                <p className="text-sm font-medium">{call.title}</p>
                <p className="text-xs text-muted-foreground">{call.when}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {call.notes}
                </p>
              </div>
            ))}
          </SectionCard>
        </>
      )}
    </div>
  );
}
