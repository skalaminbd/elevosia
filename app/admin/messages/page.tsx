import type { Metadata } from "next";
import { MessageSquare, MessagesSquare, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { MessagesView } from "@/components/admin/messages/MessagesView";

export const metadata: Metadata = {
  title: "Messages | Elevosia Admin",
};

export default function MessagesPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Messages"
        meta="Support"
        description="Client threads stay in the portal. Internal notes never leave the team."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Unread" value={2} note="Brightline Care" icon={MessageSquare} />
        <StatCard label="Open threads" value={4} note="Across 4 clients" icon={MessagesSquare} />
        <StatCard label="Avg reply today" value="38 min" note="Inside care plan" icon={Users} />
      </div>

      <div className="mt-4">
        <MessagesView />
      </div>
    </div>
  );
}
