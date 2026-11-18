import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { AdminProjectTabs } from "@/components/admin/projects/AdminProjectTabs";
import { adminClients, adminProjects } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return adminProjects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const project = adminProjects.find((item) => item.id === id);
  return project ? { title: `${project.name} | Elevosia Admin` } : {};
}

export default async function AdminProjectPage({ params }: { params: Params }) {
  const { id } = await params;
  const project = adminProjects.find((item) => item.id === id);
  if (!project) notFound();
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
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/clients/${client.id}`}>
              <Users className="size-4" aria-hidden="true" />
              Client
            </Link>
          </Button>
        ) : null}
        <Button asChild variant="outline" size="sm">
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
        <AdminProjectTabs projectId={project.id} />
      </div>
    </div>
  );
}
