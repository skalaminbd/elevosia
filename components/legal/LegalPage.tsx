import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { Toc } from "@/components/shared/Toc";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { legalNote } from "@/content/legal";

type LegalPageProps = {
  title: string;
  updated: string;
  intro: string;
  sections: { id: string; title: string; body: string[] }[];
};

/** Shared layout for the two legal pages: sticky TOC, long-form text. */
export function LegalPage({ title, updated, intro, sections }: LegalPageProps) {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-15 sm:px-6 md:pt-20 lg:px-8 lg:pt-24">
          <div className="max-w-2xl">
            <Eyebrow>Legal</Eyebrow>
            <h1 className="mt-5 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {title}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {intro}
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {updated}
            </p>
          </div>

          <div className="mt-10 rounded-md border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-foreground">
            {legalNote}
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-3">
              <Toc
                sections={sections.map(({ id, title: heading }) => ({
                  id,
                  title: heading,
                }))}
              />
            </div>

            <div className="max-w-3xl lg:col-span-9">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 border-t border-border py-8 first:border-t-0 first:pt-0"
                >
                  <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-3">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-base text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
