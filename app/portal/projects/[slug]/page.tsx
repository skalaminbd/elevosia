import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { PortalProjectDetail } from "@/components/portal/PortalProjectDetail";
import {
  getProjectDetail,
  listPortalCalls,
  listPortalFiles,
  listPortalInvoices,
  listPortalProjects,
  listTasks,
} from "@/db/queries";
import { adminProjects } from "@/lib/admin-data";
import { requirePortalClientId } from "@/lib/portal-session";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return adminProjects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} | Elevosia client portal` };
}

async function ProjectLoader({ slug }: { slug: string }) {
  await connection();
  const clientId = await requirePortalClientId();
  const [projects, tasks, files, invoices, calls, detail] = await Promise.all([
    listPortalProjects(clientId),
    listTasks(),
    listPortalFiles(clientId),
    listPortalInvoices(clientId),
    listPortalCalls(clientId),
    getProjectDetail(slug),
  ]);

  const project = projects.find((item) => item.id === slug);
  if (!project) notFound();

  const visibleTasks = tasks.filter(
    (task) => task.project === project.name && task.clientVisible,
  );
  const groups = new Map<
    string,
    { id: string; title: string; state: "done" | "progress" | "next" }[]
  >();
  for (const task of visibleTasks) {
    const label = task.week || "This week";
    const list = groups.get(label) ?? [];
    list.push({
      id: task.id,
      title: task.title,
      state:
        task.status === "done"
          ? "done"
          : task.status === "progress" || task.status === "review"
            ? "progress"
            : "next",
    });
    groups.set(label, list);
  }
  const order = ["This week", "Next week"];
  const boardWeeks = [...groups.entries()]
    .sort(([a], [b]) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    })
    .map(([label, groupTasks]) => ({
      id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label,
      dates: "",
      tasks: groupTasks,
    }));

  const milestones = detail
    ? detail.milestones.map((milestone, index) => {
        const done = milestone.tasks.filter((task) => task.done).length;
        return {
          id: milestone.id,
          label: milestone.title,
          due: milestone.dueOn ?? "",
          tasks: milestone.tasks.length,
          state:
            milestone.tasks.length > 0 && done === milestone.tasks.length
              ? ("done" as const)
              : index === 0
                ? ("current" as const)
                : ("next" as const),
        };
      })
    : [];

  const firstWord = project.name.split(" ")[0].toLowerCase();
  const projectFiles = files.filter((file) =>
    file.project.toLowerCase().startsWith(firstWord),
  );

  return (
    <PortalProjectDetail
      data={{
        project,
        boardWeeks,
        milestones,
        files: projectFiles.length > 0 ? projectFiles : files,
        invoices: invoices.filter(
          (invoice) =>
            invoice.project === project.name ||
            invoice.project.toLowerCase().startsWith(firstWord),
        ),
        calls,
      }}
    />
  );
}

export default async function PortalProjectPage({ params }: { params: Params }) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-3 w-24 rounded bg-secondary" />
          <div className="mt-4 h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 h-20 rounded-lg border border-border bg-card" />
          <div className="mt-4 h-64 rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <ProjectLoader slug={slug} />
    </Suspense>
  );
}
