import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { TaskActions } from "@/components/admin/tasks/TaskActions";
import { adminTasks } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return adminTasks.map((task) => ({ id: task.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const task = adminTasks.find((item) => item.id === id);
  return task ? { title: `${task.title} | Elevosia Admin` } : {};
}

export default async function TaskDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const task = adminTasks.find((item) => item.id === id);
  if (!task) notFound();

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link href="/admin/tasks" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All tasks
      </Link>
      <PageHeader
        title={task.title}
        meta={`${task.project} · ${task.client} · ${task.id}`}
        description={`Assigned to ${task.assignee} · due ${task.due}`}
        className="mt-3"
      >
        <StatusBadge tone={task.priority === "High" ? "warning" : "neutral"}>
          {task.priority} priority
        </StatusBadge>
        <StatusBadge tone={task.clientVisible ? "accent" : "neutral"}>
          {task.clientVisible ? "Client-visible" : "Internal"}
        </StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Project" value={task.project.split(" ")[0]} note={task.project} />
        <StatCard label="Week" value={task.week} note={task.due} />
        <StatCard label="Estimate" value={`${task.estimate} h`} note={`Logged ${task.logged} h`} />
        <StatCard label="Assignee" value={task.assignee} note="Can edit status" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <SectionCard title="Description" description="What done looks like">
            <div className="space-y-2 p-5 text-sm text-muted-foreground">
              <p>
                Finish the implementation on this task and check it against the weekly
                board. Any change that touches money or clients goes through the PM first.
              </p>
              <p>
                Keep the client-visible switch on only for work that belongs on their
                board.
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Checklist" description="Internal only" bodyClassName="divide-y divide-border">
            {[
              ["Implementation finished", true],
              ["Checked against the Blueprint", true],
              ["PM reviewed the copy", false],
            ].map(([label, done]) => (
              <div key={String(label)} className="flex items-center gap-2.5 px-5 py-3">
                <span className={done ? "flex size-4 items-center justify-center rounded-full bg-success text-success-foreground" : "size-4 rounded-full border border-muted-foreground/40"}>
                  {done ? <Check className="size-2.5" strokeWidth={3} aria-hidden="true" /> : null}
                </span>
                <span className={done ? "text-sm text-muted-foreground line-through" : "text-sm"}>{label}</span>
              </div>
            ))}
            <p className="flex items-center gap-1.5 px-5 py-2.5 text-[10px] text-muted-foreground">
              <Lock className="size-3" aria-hidden="true" />
              Never shown to the client.
            </p>
          </SectionCard>

          <SectionCard title="Comments" description="Staff only" bodyClassName="divide-y divide-border">
            <div className="px-5 py-3.5">
              <p className="text-xs font-medium">Maya · 2 hrs ago</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Copy is approved. Sam, can you keep the export behind the PM role?
              </p>
            </div>
            <div className="px-5 py-3.5">
              <p className="text-xs font-medium">Sam · 1 hr ago</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Yes, done. Adding the test case now.
              </p>
            </div>
          </SectionCard>
        </div>

        <TaskActions
          status={task.status}
          visible={task.clientVisible}
          logged={task.logged}
          estimate={task.estimate}
        />
      </div>
    </div>
  );
}
