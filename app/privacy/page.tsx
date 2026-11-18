import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy | Elevosia",
  description:
    "What the Elevosia website and client portal collect, why, how long it's kept, and how to ask for deletion.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={privacy.title}
      updated={privacy.updated}
      intro={privacy.intro}
      sections={privacy.sections}
    />
  );
}
