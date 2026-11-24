import Link from "next/link";
import { ArrowLeft, Check, Lock, Ticket } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { TaskSidebar } from "@/components/admin/tasks/TaskSidebar";
import type { TaskDetailData } from "@/db/queries";

/** One task with its checklist and comments from Postgres. */
export function TaskDetail({ data }: { data: TaskDetailData }) {
  const { task, checklist, comments } = data;
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/tasks"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All tasks
      </Link>
      <PageHeader
        title={task.title}
        meta={`${task.project} · ${task.client}${task.milestone ? ` · ${task.milestone}` : ""} · ${task.id}`}
        description={`Due ${task.due} · ${task.estimate} h estimated`}
        className="mt-3"
      >
        <StatusBadge tone={task.priority === "High" ? "warning" : "neutral"}>
          {task.priority} priority
        </StatusBadge>
        <StatusBadge tone={task.clientVisible ? "accent" : "neutral"}>
          {task.clientVisible ? "Client-visible" : "Internal"}
        </StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          label="Project"
          value={task.project.split(" ")[0]}
          note={task.project}
        />
        <StatCard label="Week" value={task.week} note={task.due} />
        <StatCard
          label="Estimate"
          value={`${task.estimate} h`}
          note={`Logged ${task.logged} h`}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <SectionCard title="Description" description="What done looks like">
            <div className="space-y-2 p-5 text-sm text-muted-foreground">
              <p>
                Finish the implementation on this task and check it against the
                weekly board. Any change that touches money or clients goes
                through the PM first.
              </p>
              <p>
                Keep the client-visible switch on only for work that belongs on
                their board.
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Checklist"
            description="Internal only"
            bodyClassName="divide-y divide-border"
          >
            {checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2.5 px-5 py-3"
              >
                <span
                  className={
                    item.done
                      ? "flex size-4 items-center justify-center rounded-full bg-success text-success-foreground"
                      : "size-4 rounded-full border border-muted-foreground/40"
                  }
                >
                  {item.done ? (
                    <Check
                      className="size-2.5"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
                <span
                  className={
                    item.done
                      ? "text-sm text-muted-foreground line-through"
                      : "text-sm"
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
            <p className="flex items-center gap-1.5 px-5 py-2.5 text-[10px] text-muted-foreground">
              <Lock className="size-3" aria-hidden="true" />
              Never shown to the client.
            </p>
          </SectionCard>

          <SectionCard
            title="Context"
            description="Where this task came from"
            bodyClassName="divide-y divide-border"
          >
            <div className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
              <span className="text-muted-foreground">Milestone</span>
              <span>{task.milestone ?? "Not set"}</span>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
              <span className="text-muted-foreground">Week</span>
              <span>
                {task.week} · due {task.due}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
              <span className="text-muted-foreground">
                Linked ticket or request
              </span>
              {task.linked ? (
                <Link
                  href={
                    task.linked.type === "Ticket"
                      ? "/admin/tickets"
                      : "/admin/requirements"
                  }
                  className="flex min-w-0 items-center gap-1.5 font-medium hover:underline"
                >
                  <Ticket className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {task.linked.id} · {task.linked.title}
                  </span>
                </Link>
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Comments"
            description="Staff only"
            bodyClassName="divide-y divide-border"
          >
            {comments.length === 0 ? (
              <p className="px-5 py-4 text-sm text-muted-foreground">
                No comments yet.
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="px-5 py-3.5">
                  <p className="text-xs font-medium">
                    {comment.author} · {comment.at}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {comment.body}
                  </p>
                </div>
              ))
            )}
          </SectionCard>
        </div>

        <TaskSidebar
          status={task.status}
          visible={task.clientVisible}
          logged={task.logged}
          estimate={task.estimate}
          assignee={task.assignee}
          reviewer={task.reviewer ?? ""}
          project={task.project}
        />
      </div>
    </div>
  );
}
