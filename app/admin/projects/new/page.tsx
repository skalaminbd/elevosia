import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { NewProjectForm } from "@/components/admin/projects/NewProjectForm";

export const metadata: Metadata = { title: "New project | Elevosia Admin" };

export default function NewProjectPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="New project"
        meta="Delivery"
        description="Projects start from an approved Blueprint, or from an internal template."
      />
      <div className="mt-6 max-w-3xl">
        <NewProjectForm />
      </div>
    </div>
  );
}
