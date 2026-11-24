import { connection } from "next/server";
import { AlertTriangle, FolderKanban, ShieldCheck, Wrench } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { ProjectsView } from "@/components/admin/projects/ProjectsView";
import { listProjects } from "@/db/queries";

/** Projects from Postgres, read at request time. */
export async function ProjectsData() {
  await connection();
  const projects = await listProjects();

  const active = projects.filter(
    (project) =>
      !project.status.includes("warranty") && project.status !== "On hold",
  ).length;
  const atRisk = projects.filter(
    (project) => project.health === "At risk",
  ).length;
  const late = projects.filter((project) => project.health === "Late").length;
  const warranty = projects.filter((project) =>
    project.status.includes("warranty"),
  ).length;

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Active projects"
          value={active}
          note={`${projects.filter((project) => project.status === "Building").length} building, ${projects.filter((project) => project.status === "Review").length} in review`}
          icon={FolderKanban}
        />
        <StatCard
          label="At risk"
          value={atRisk}
          note={atRisk > 0 ? "Needs a PM check-in" : "Nothing blocked"}
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard
          label="Late"
          value={late}
          note={late > 0 ? "Past the launch target" : "All on target"}
          icon={Wrench}
          tone="danger"
        />
        <StatCard
          label="In warranty"
          value={warranty}
          note="Covered after launch"
          icon={ShieldCheck}
        />
      </div>

      <div className="mt-4">
        <ProjectsView projects={projects} />
      </div>
    </>
  );
}
