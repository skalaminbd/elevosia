import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Progress } from "@/components/admin/ui/Progress";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ProjectTabs } from "@/components/portal/ProjectTabs";
import { portalCalls, portalFiles, portalProjects } from "@/lib/portal-data";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return portalProjects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = portalProjects.find((item) => item.id === slug);
  return project
    ? { title: `${project.name} | Elevosia client portal` }
    : {};
}

export default async function PortalProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = portalProjects.find((item) => item.id === slug);
  if (!project) notFound();

  const files = portalFiles.filter((file) =>
    file.project.toLowerCase().startsWith(project.name.split(" ")[0].toLowerCase()),
  );

  return (
    <div className="mx-auto w-full max-w-[1440px]">
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
        <StatusBadge tone={project.health === "On track" ? "success" : "warning"}>
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

      {project.id === "care-dashboard" ? (
        <div className="mt-4">
          <ProjectTabs />
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Launched" value="18 Sep" note="2026" icon={CheckCircle2} tone="success" />
            <StatCard label="Bookings, week one" value="107" note="Online" icon={CalendarClock} />
            <StatCard label="Warranty ends" value="18 Dec" note="30 days after launch" icon={ShieldCheck} />
            <StatCard label="Modules" value={project.modules} note="Booking, reminders" icon={FileText} />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <SectionCard title="Launch summary" description="What went live">
              <div className="space-y-3 p-5 text-sm text-muted-foreground">
                <p>Online booking, text reminders and a simple staff view of the day.</p>
                <p>The launch checklist and handover notes are in Files.</p>
              </div>
            </SectionCard>
            <SectionCard title="Files from this project" description="Client-visible" bodyClassName="divide-y divide-border">
              {files.length === 0 ? (
                <p className="px-5 py-6 text-sm text-muted-foreground">No files yet.</p>
              ) : (
                files.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 px-5 py-3">
                    <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{file.size}</span>
                  </div>
                ))
              )}
            </SectionCard>
          </div>

          <SectionCard title="Call notes" description="Client-visible notes" className="mt-4" bodyClassName="divide-y divide-border">
            {portalCalls.past.map((call) => (
              <div key={call.id} className="px-5 py-4">
                <p className="text-sm font-medium">{call.title}</p>
                <p className="text-xs text-muted-foreground">{call.when}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{call.notes}</p>
              </div>
            ))}
          </SectionCard>
        </>
      )}
    </div>
  );
}
