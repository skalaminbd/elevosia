import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { CannedReplies } from "@/components/admin/tickets/CannedReplies";

export const metadata: Metadata = { title: "Canned replies | Elevosia Admin" };

export default function CannedRepliesPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Canned replies"
        meta="Support"
        description="Saved answers for the questions that come up every week. Copy, then edit before sending."
      />
      <div className="mt-6">
        <CannedReplies />
      </div>
    </div>
  );
}
