import Link from "next/link";
import { connection } from "next/server";
import { ChevronRight } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/admin/ui/Table";
import { listTasks } from "@/db/queries";

/** Tasks assigned to the signed-in admin, from Postgres. */
export async function MyTasksData() {
  await connection();
  const tasks = await listTasks();
  const mine = tasks.filter((task) => task.assignee === "Alamin");

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Open"
          value={mine.filter((task) => task.status !== "done").length}
          note="Assigned to you"
        />
        <StatCard
          label="High priority"
          value={mine.filter((task) => task.priority === "High").length}
          note="Do these first"
          tone="warning"
        />
        <StatCard
          label="Logged"
          value={`${mine.reduce((sum, task) => sum + task.logged, 0)} h`}
          note="This week"
        />
      </div>

      <Table className="mt-4">
        <THead>
          <tr>
            <TH>Task</TH>
            <TH>Project</TH>
            <TH>Due</TH>
            <TH>Status</TH>
            <TH>Hours</TH>
            <TH className="w-10" />
          </tr>
        </THead>
        <TBody>
          {mine.map((task) => (
            <TR key={task.id}>
              <TD>
                <Link
                  href={`/admin/tasks/${task.id}`}
                  className="font-medium hover:underline"
                >
                  {task.title}
                </Link>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {task.id}
                </p>
              </TD>
              <TD className="text-xs text-muted-foreground">{task.project}</TD>
              <TD className="text-xs text-muted-foreground">{task.due}</TD>
              <TD>
                <StatusBadge
                  tone={
                    task.status === "done"
                      ? "success"
                      : task.status === "review"
                        ? "warning"
                        : task.status === "progress"
                          ? "accent"
                          : "neutral"
                  }
                >
                  {task.status === "todo"
                    ? "To do"
                    : task.status === "progress"
                      ? "In progress"
                      : task.status === "review"
                        ? "In review"
                        : "Done"}
                </StatusBadge>
              </TD>
              <TD className="font-mono text-xs">
                {task.logged}/{task.estimate} h
              </TD>
              <TD>
                <Link
                  href={`/admin/tasks/${task.id}`}
                  aria-label={`Open ${task.title}`}
                  className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
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
