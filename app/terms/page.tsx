import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { terms } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms | Elevosia",
  description:
    "The rules for using the Elevosia website and client portal, and how quotes, payment, ownership and liability work.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title={terms.title}
      updated={terms.updated}
      intro={terms.intro}
      sections={terms.sections}
    />
  );
}
