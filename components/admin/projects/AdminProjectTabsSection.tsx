import { connection } from "next/server";
import {
  getProjectDetail,
  listActivities,
  listCalls,
  listFiles,
  listProjectAccess,
  listProjectChanges,
  listProjects,
  listTasks,
  listThreads,
  listTimesheets,
} from "@/db/queries";
import {
  AdminProjectTabs,
  type AdminProjectWorkspace,
} from "@/components/admin/projects/AdminProjectTabs";
import type { ProjectScope, StoredMilestone } from "@/lib/project-store";

/** Every project tab, fed from Postgres at request time. */
export async function AdminProjectTabsSection({
  projectId,
  scope,
}: {
  projectId: string;
  scope?: ProjectScope;
}) {
  await connection();

  const [
    detail,
    projects,
    tasks,
    filesData,
    threads,
    calls,
    changes,
    access,
    timesheets,
    activities,
  ] = await Promise.all([
    getProjectDetail(projectId),
    listProjects(),
    listTasks(),
    listFiles(),
    listThreads(),
    listCalls(),
    listProjectChanges(projectId),
    listProjectAccess(projectId),
    listTimesheets(),
    listActivities(),
  ]);

  const projectRow = projects.find((project) => project.id === projectId);
  const project = projectRow ??
    (detail
      ? {
          id: detail.id,
          client: detail.clientName,
          name: detail.name,
          status: detail.status,
          health: "On track" as const,
          progress: 0,
          due: detail.startDate ?? "",
          pm: detail.pm,
          price: 0,
          used: 0,
          modules: detail.milestones.length,
        }
      : {
          id: projectId,
          client: "",
          name: "",
          status: "Planning",
          health: "On track" as const,
          progress: 0,
          due: "",
          pm: "",
          price: 0,
          used: 0,
          modules: 0,
        });

  const clientName = project?.client ?? "";
  const projectName = project?.name ?? "";

  const projectTasks = tasks.filter((task) => task.project === project.name);
  const weekOrder = ["This week", "Next week"];
  const weekGroups = new Map<
    string,
    { id: string; title: string; state: string; owner: string; visible: boolean }[]
  >();
  for (const task of projectTasks) {
    const label = task.week || "This week";
    const list = weekGroups.get(label) ?? [];
    list.push({
      id: task.id,
      title: task.title,
      state:
        task.status === "done"
          ? "done"
          : task.status === "progress" || task.status === "review"
            ? "progress"
            : "next",
      owner: task.assignee,
      visible: task.clientVisible,
    });
    weekGroups.set(label, list);
  }
  const board = [...weekGroups.entries()]
    .sort(([a], [b]) => {
      const indexA = weekOrder.indexOf(a);
      const indexB = weekOrder.indexOf(b);
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    })
    .map(([label, groupTasks], index) => ({
      id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label,
      dates: "",
      current: index === 0,
      tasks: groupTasks,
    }));

  const storedMilestones: StoredMilestone[] | undefined = detail
    ? detail.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        due: milestone.dueOn ?? undefined,
        tasks: milestone.tasks.map((task) => ({
          id: task.id,
          name: task.name,
          description: task.description,
          hours: task.hours,
          visible: task.visible,
          done: task.done,
        })),
      }))
    : undefined;

  const workspace: AdminProjectWorkspace = {
    project,
    board,
    tasks: tasks.filter((task) => task.project === projectName),
    files: filesData.files.filter((file) => file.client === clientName),
    threads: threads.filter((thread) => thread.client === clientName),
    calls: calls.filter((call) => call.client === clientName),
    changes,
    access,
    time: timesheets.filter((row) => row.project === projectName),
    activity: activities.filter((item) => item.detail.includes(clientName)),
  };

  return (
    <AdminProjectTabs
      projectId={projectId}
      storedMilestones={storedMilestones}
      blueprintLabel={detail?.blueprintId ?? undefined}
      projectName={projectName}
      client={clientName}
      scope={scope}
      workspace={workspace}
    />
  );
}
