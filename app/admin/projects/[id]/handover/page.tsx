import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { HandoverDetail } from "@/components/admin/projects/HandoverDetail";
import {
  getProjectSummary,
  listHandoverItems,
  listProjectAccess,
} from "@/db/queries";
import { adminProjects } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return adminProjects.map((project) => ({ id: project.id }));
}

export const metadata: Metadata = { title: "Handover | Elevosia Admin" };

async function HandoverLoader({ id }: { id: string }) {
  await connection();
  const [project, accounts, items] = await Promise.all([
    getProjectSummary(id),
    listProjectAccess(id),
    listHandoverItems(),
  ]);
  if (!project) notFound();
  return (
    <HandoverDetail project={project} accounts={accounts} items={items} />
  );
}

export default async function HandoverPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-3 w-32 rounded bg-secondary" />
          <div className="mt-4 h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 h-64 rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <HandoverLoader id={id} />
    </Suspense>
  );
}
