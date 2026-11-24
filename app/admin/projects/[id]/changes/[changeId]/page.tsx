import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ProjectChangeDetail } from "@/components/admin/projects/ProjectChangeDetail";
import { getProjectChange, getProjectSummary } from "@/db/queries";
import { adminProjects } from "@/lib/admin-data";

type Params = Promise<{ id: string; changeId: string }>;

export function generateStaticParams() {
  return adminProjects.map((project) => ({
    id: project.id,
    changeId: "CH-18",
  }));
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Change request | Elevosia Admin" };
}

async function ChangeLoader({
  id,
  changeId,
}: {
  id: string;
  changeId: string;
}) {
  await connection();
  const [project, change] = await Promise.all([
    getProjectSummary(id),
    getProjectChange(id, changeId),
  ]);
  if (!project || !change) notFound();
  return <ProjectChangeDetail project={project} change={change} />;
}

export default async function ChangePage({ params }: { params: Params }) {
  const { id, changeId } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-3 w-32 rounded bg-secondary" />
          <div className="mt-4 h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 h-12 rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <ChangeLoader id={id} changeId={changeId} />
    </Suspense>
  );
}
