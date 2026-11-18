import type { Metadata } from "next";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { ChecklistTool } from "@/components/checklist/ChecklistTool";
import { PageClosing } from "@/components/shared/PageClosing";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { checklistHero, checklistMeta } from "@/content/checklist";

export const metadata: Metadata = {
  title: checklistMeta.title,
  description: checklistMeta.description,
  alternates: { canonical: "/checklist" },
  openGraph: {
    title: checklistMeta.title,
    description: checklistMeta.description,
    url: "/checklist",
    type: "website",
  },
};

export default function ChecklistPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <section className="relative overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-10 sm:px-6 md:pt-20 lg:px-8 lg:pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>{checklistHero.eyebrow}</Eyebrow>
              <h1 className="mt-6 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
                {checklistHero.title}
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
                {checklistHero.subhead}
              </p>
            </div>
          </div>
        </section>

        <ChecklistTool />

        <PageClosing
          title="Whatever the score, the next step is the same."
          body="Tell us what slows you down and we'll send a free Blueprint with milestones, a timeline and a fixed price. If tools are fine, we'll say so."
          primary={{ label: "Start a project", href: "/start" }}
          secondary={{ label: "Book a call", href: "/book-a-call" }}
        />
      </main>

      <SiteFooter />
    </>
  );
}
