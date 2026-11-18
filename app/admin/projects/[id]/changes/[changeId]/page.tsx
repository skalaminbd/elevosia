import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ChangeActions } from "@/components/admin/projects/ChangeActions";
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

export default async function ChangePage({ params }: { params: Params }) {
  const { id, changeId } = await params;
  const project = adminProjects.find((item) => item.id === id);
  if (!project) notFound();

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link
        href={`/admin/projects/${project.id}?tab=changes`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to {project.name}
      </Link>

      <PageHeader
        title="Family access additions"
        meta={`${project.client} · ${changeId}`}
        description="Second family contact with invoice visibility, without access to care notes."
        className="mt-3"
      >
        <StatusBadge tone="warning">Waiting for client</StatusBadge>
      </PageHeader>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Price impact" value="+$900" note="One-time" icon={DollarSign} />
        <StatCard label="Timeline impact" value="+3 days" note="Launch moves to 15 Dec" icon={Clock} />
        <StatCard label="Invoice" value="On approval" note="Change invoice" icon={DollarSign} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Scope" description="What changes" className="xl:col-span-2" bodyClassName="p-5">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Add a second family contact per client.</li>
            <li>• Billing role can see invoices, not care notes.</li>
            <li>• Owner approves every new family contact.</li>
            <li>• Existing family accounts stay as they are.</li>
          </ul>
          <div className="mt-4 rounded-md bg-secondary/60 p-3 text-xs text-muted-foreground">
            Requested after the week 3 review. The current plan stays in force until this
            is approved.
          </div>
        </SectionCard>
        <ChangeActions />
      </div>
    </div>
  );
}
