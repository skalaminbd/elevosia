import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { DeletionRequests } from "@/components/admin/clients/DeletionRequests";

export const metadata: Metadata = { title: "Deletion requests | Elevosia Admin" };

export default function DeletionRequestsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Deletion requests"
        meta="Clients"
        description="Client owners can ask for their data. Export before purging; only Admins can handle this."
      />
      <div className="mt-6">
        <DeletionRequests />
      </div>
    </div>
  );
}
