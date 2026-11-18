import type { Metadata } from "next";
import { CheckCircle2, Clock, ListChecks, Timer } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { TasksView } from "@/components/admin/tasks/TasksView";

export const metadata: Metadata = {
  title: "Tasks | Elevosia Admin",
};

export default function TasksPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Tasks"
        meta="Delivery"
        description="Your week first, then the whole board. Client-visible work updates the portal the moment it moves."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Open this week" value={6} note="Across 4 projects" icon={ListChecks} />
        <StatCard label="Due today" value={2} note="1 high priority" icon={Clock} tone="warning" />
        <StatCard label="Logged this week" value="18.5 h" note="Of 22 h estimated" icon={Timer} />
        <StatCard label="Done this week" value={2} note="Both client-visible" icon={CheckCircle2} tone="success" />
      </div>

      <div className="mt-4">
        <TasksView />
      </div>
    </div>
  );
}
