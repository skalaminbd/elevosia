import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export const metadata: Metadata = { title: "Onboarding templates | Elevosia Admin" };

const TEMPLATES = [
  {
    id: "field",
    name: "Field services",
    pm: "Alamin",
    days: "5 business days",
    steps: ["Invite sent", "Profile complete", "Requirements submitted", "Blueprint reviewed", "Contract signed", "Deposit paid", "Kickoff booked"],
  },
  {
    id: "care",
    name: "Care providers",
    pm: "Maya",
    days: "7 business days",
    steps: ["Invite sent", "Profile complete", "NDA signed", "HIPAA checklist", "Requirements submitted", "Blueprint approved", "Contract signed", "Deposit paid"],
  },
  {
    id: "agency",
    name: "Agencies",
    pm: "Maya",
    days: "5 business days",
    steps: ["Invite sent", "Profile complete", "NDA signed", "Requirements submitted", "Blueprint approved", "Contract signed", "Deposit paid"],
  },
];

export default function OnboardingTemplatesPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <Link href="/admin/onboarding" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Onboarding
      </Link>
      <PageHeader
        title="Onboarding templates"
        meta="Clients"
        description="One checklist per service type, with the default PM and due days."
        className="mt-3"
      />
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {TEMPLATES.map((template) => (
          <SectionCard key={template.id} title={template.name} description={`${template.steps.length} steps · ${template.days}`} action={<StatusBadge tone="neutral">PM · {template.pm}</StatusBadge>}>
            <ul className="divide-y divide-border">
              {template.steps.map((step, index) => (
                <li key={step} className="flex items-center gap-2.5 px-5 py-2.5 text-sm">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[9px] text-muted-foreground">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3.5" aria-hidden="true" />
        Website signups pick a template by service type, or round robin if none matches.
      </p>
    </div>
  );
}
