import type { Metadata } from "next";
import { FileSignature, Inbox } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { RequirementsBuilder } from "@/components/portal/RequirementsBuilder";

export const metadata: Metadata = {
  title: "New requirements | Elevosia client portal",
};

export default function NewRequirementsPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Tell us what you need"
        meta="New project"
        description="Write it in plain words, section by section. Your PM turns it into a Blueprint with a fixed price."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Blueprint due" value="5 days" note="Business days" icon={Inbox} />
        <StatCard label="Your contact" value="Alamin" note="Project manager" icon={FileSignature} />
        <StatCard label="NDA" value="On request" note="Sign before we read it" icon={FileSignature} />
      </div>

      <div className="mt-4">
        <RequirementsBuilder />
      </div>
    </div>
  );
}
