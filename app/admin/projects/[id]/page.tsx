import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { AdminProjectTabsSection } from "@/components/admin/projects/AdminProjectTabsSection";
import { DbProjectPage } from "@/components/admin/projects/DbProjectPage";
import { adminClients, adminProjects } from "@/lib/admin-data";
import { getProjectDetail } from "@/db/queries";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return adminProjects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const project = adminProjects.find((item) => item.id === id);
  return project ? { title: `${project.name} | Elevosia Admin` } : {};
}

/** Projects not in the demo set: Postgres first, then the old browser store. */
async function DbProjectLoader({ id }: { id: string }) {
  await connection();
  const detail = await getProjectDetail(id);
  if (!detail) notFound();
  return <DbProjectPage detail={detail} />;
}

export default async function AdminProjectPage({ params }: { params: Params }) {
  const { id } = await params;
  const project = adminProjects.find((item) => item.id === id);
  // Projects converted from an approved Blueprint live in Postgres.
  if (!project) {
    return (
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-[1920px]">
            <div className="h-3 w-24 rounded bg-secondary" />
            <div className="mt-4 h-8 w-64 rounded bg-secondary" />
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-lg border border-border bg-card"
                />
              ))}
            </div>
          </div>
        }
      >
        <DbProjectLoader id={id} />
      </Suspense>
    );
  }
  const client = adminClients.find((item) => item.name === project.client);

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All projects
      </Link>

      <PageHeader
        title={project.name}
        meta={`${project.client} · ${project.modules} modules`}
        description={`Due ${project.due} · ${project.pm} is the PM`}
        className="mt-3"
      >
        <StatusBadge tone={project.status === "On hold" ? "warning" : "neutral"}>
          {project.status}
        </StatusBadge>
        <StatusBadge
          tone={
            project.health === "On track"
              ? "success"
              : project.health === "At risk"
                ? "warning"
                : "danger"
          }
        >
          {project.health}
        </StatusBadge>
        {client ? (
          <Button asChild variant="outline">
            <Link href={`/admin/clients/${client.id}`}>
              <Users className="size-4" aria-hidden="true" />
              Client
            </Link>
          </Button>
        ) : null}
        <Button asChild variant="outline">
          <Link href="/portal" target="_blank" rel="noreferrer">
            <ExternalLink className="size-4" aria-hidden="true" />
            Portal
          </Link>
        </Button>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Progress" value={`${project.progress}%`} note="Client-visible tasks" />
        <StatCard
          label="Budget used"
          value={`$${project.used.toLocaleString("en-US")}`}
          note={`of $${project.price.toLocaleString("en-US")}`}
        />
        <StatCard label="Due" value={project.due} note="Launch target" />
        <StatCard label="PM" value={project.pm} note="Point of contact" />
        <StatCard label="Modules" value={project.modules} note="In scope" />
      </div>

      <div className="mt-4">
        <Suspense
          fallback={
            <div className="h-96 rounded-lg border border-border bg-card" />
          }
        >
          <AdminProjectTabsSection projectId={project.id} />
        </Suspense>
      </div>
    </div>
  );
}
