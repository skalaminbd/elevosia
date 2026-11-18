import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ClientForm } from "@/components/admin/clients/ClientForm";

export const metadata: Metadata = { title: "New client | Elevosia Admin" };

export default function NewClientPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Add a client"
        meta="Clients"
        description="Company, contact and portal access. You can add projects and billing after this."
      />
      <div className="mt-6 max-w-3xl">
        <ClientForm mode="new" />
      </div>
    </div>
  );
}
