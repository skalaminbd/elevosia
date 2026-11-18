import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { BlueprintForm } from "@/components/admin/blueprints/BlueprintForm";

export const metadata: Metadata = { title: "New Blueprint | Elevosia Admin" };

export default function NewBlueprintPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="New Blueprint"
        meta="Clients"
        description="Turn a requirement into milestones, tasks and a fixed price. Nothing is sent until you choose."
      />
      <div className="mt-6 max-w-4xl">
        <BlueprintForm />
      </div>
    </div>
  );
}
