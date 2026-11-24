import { connection } from "next/server";
import { FolderKanban, Layers, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { PortalProjectsList } from "@/components/portal/PortalProjectsList";
import { listPortalProjects } from "@/db/queries";
import { requirePortalClientId } from "@/lib/portal-session";

/** Client projects from Postgres, read at request time. */
export async function PortalProjectsData() {
  await connection();
  const clientId = await requirePortalClientId();
  const projects = await listPortalProjects(clientId);
  const active = projects.filter((project) => project.status === "Active").length;
  const complete = projects.filter(
    (project) => project.status === "Completed",
  ).length;
  const modules = projects.reduce((total, project) => total + project.modules, 0);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Projects"
          value={projects.length}
          note={`${active} active, ${complete} complete`}
          icon={FolderKanban}
        />
        <StatCard
          label="Modules live"
          value={modules}
          note="Across every project"
          icon={Layers}
        />
        <StatCard
          label="Warranty"
          value="30 days"
          note="On launched work"
          icon={ShieldCheck}
        />
      </div>

      <div className="mt-4">
        <PortalProjectsList projects={projects} />
      </div>
    </>
  );
}
