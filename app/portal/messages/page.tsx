import type { Metadata } from "next";
import { MessageSquare, MessagesSquare } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { PortalMessages } from "@/components/portal/PortalMessages";

export const metadata: Metadata = {
  title: "Messages | Elevosia client portal",
};

export default function PortalMessagesPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader
        title="Messages"
        meta="Support"
        description="Your project thread, billing and support. Files can go in the same thread."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Unread" value={2} note="Care dashboard" icon={MessageSquare} />
        <StatCard label="Threads" value={3} note="Project, billing, support" icon={MessagesSquare} />
        <StatCard label="Reply target" value="1 day" note="Business days" icon={MessageSquare} />
      </div>

      <div className="mt-4">
        <PortalMessages />
      </div>
    </div>
  );
}
