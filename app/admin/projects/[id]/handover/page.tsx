import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { HandoverChecklist } from "@/components/admin/projects/HandoverChecklist";
import { adminProjects } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return adminProjects.map((project) => ({ id: project.id }));
}

export const metadata: Metadata = { title: "Handover | Elevosia Admin" };

export default async function HandoverPage({ params }: { params: Params }) {
  const { id } = await params;
  const project = adminProjects.find((item) => item.id === id);
  if (!project) notFound();

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href={`/admin/projects/${project.id}?tab=access`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to {project.name}
      </Link>
      <PageHeader
        title="Handover"
        meta={`${project.client} · ${project.name}`}
        description="Everything must be in the client's name before the project can close."
        className="mt-3"
      />
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Accounts" description="Ownership at a glance" className="xl:col-span-2" bodyClassName="divide-y divide-border">
          {[
            ["Hosting", "Client", "Handed over"],
            ["Domain", "Client", "Handed over"],
            ["Repository", "Client", "Invite sent"],
            ["Database", "Client", "Pending"],
            ["Email delivery", "Client", "Handed over"],
          ].map(([name, owner, status]) => (
            <div key={name} className="flex items-center gap-3 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">Owner: {owner}</p>
              </div>
              <StatusBadge tone={status === "Handed over" ? "success" : status === "Pending" ? "warning" : "info"}>
                {status}
              </StatusBadge>
            </div>
          ))}
        </SectionCard>
        <HandoverChecklist />
      </div>
    </div>
  );
}
