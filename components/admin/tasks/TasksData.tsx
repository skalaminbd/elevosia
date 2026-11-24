import { connection } from "next/server";
import { CheckCircle2, Clock, ListChecks, Timer } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { TasksView } from "@/components/admin/tasks/TasksView";
import { listTasks } from "@/db/queries";

/** Tasks from Postgres, read at request time. */
export async function TasksData() {
  await connection();
  const tasks = await listTasks();

  const openThisWeek = tasks.filter(
    (task) => task.week === "This week" && task.status !== "done",
  );
  const dueToday = tasks.filter(
    (task) => task.due === "Today" && task.status !== "done",
  );
  const logged = tasks.reduce((total, task) => total + task.logged, 0);
  const estimate = tasks.reduce((total, task) => total + task.estimate, 0);
  const doneThisWeek = tasks.filter(
    (task) => task.week === "This week" && task.status === "done",
  ).length;
  const projects = new Set(openThisWeek.map((task) => task.project)).size;

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Open this week"
          value={openThisWeek.length}
          note={`Across ${projects} projects`}
          icon={ListChecks}
        />
        <StatCard
          label="Due today"
          value={dueToday.length}
          note={`${dueToday.filter((task) => task.priority === "High").length} high priority`}
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="Logged this week"
          value={`${logged} h`}
          note={`Of ${estimate} h estimated`}
          icon={Timer}
        />
        <StatCard
          label="Done this week"
          value={doneThisWeek}
          note="Client-visible work updates the portal"
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      <div className="mt-4">
        <TasksView tasks={tasks} />
      </div>
    </>
  );
}
