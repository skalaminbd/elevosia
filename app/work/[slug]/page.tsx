import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Quote } from "lucide-react";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { PageClosing } from "@/components/shared/PageClosing";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import {
  caseStudies,
  caseStudyMeta,
  getCaseStudy,
} from "@/content/case-studies";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  // Cache Components needs at least one param to validate the route. The
  // placeholder resolves to notFound(), so no case study page is published
  // until a real study is added to content/case-studies.ts.
  if (caseStudies.length === 0) return [{ slug: "not-published" }];
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: `${study.name}: ${study.resultLine} | Elevosia`,
    description: `${study.industry}, ${study.teamSize}. ${study.before}`,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      title: `${study.name}: ${study.resultLine}`,
      description: `${study.industry} · ${study.teamSize} · ${study.location}`,
      url: `/work/${study.slug}`,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${study.name}: ${study.resultLine}`,
    description: study.before,
    about: study.industry,
    author: { "@type": "Organization", name: "Elevosia" },
    publisher: { "@type": "Organization", name: "Elevosia" },
    mainEntityOfPage: `https://elevosia.com/work/${study.slug}`,
  };

  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <section className="relative overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-12 sm:px-6 md:pt-20 lg:px-8 lg:pt-24">
            <div className="max-w-3xl">
              <Eyebrow>{caseStudyMeta.eyebrow}</Eyebrow>
              <h1 className="mt-5 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
                {study.name}: {study.resultLine}
              </h1>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
              {[
                ["Industry", study.industry],
                ["Team", study.teamSize],
                ["Location", study.location],
                ["Timeline", study.timeline],
                ["Modules", String(study.modules.length)],
              ].map(([label, value]) => (
                <div key={label} className="bg-card p-4">
                  <dt className="text-[10px] text-muted-foreground">{label}</dt>
                  <dd className="mt-1 text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>

            {study.screenshots?.length ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {study.screenshots.map((shot) => (
                  <figure key={shot.src}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      className="w-full rounded-lg border border-border"
                    />
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      {shot.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <Section className="pt-0">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                {caseStudyMeta.labels.before}
              </h2>
              <p className="mt-4 text-base text-muted-foreground">{study.before}</p>
              {study.beforeQuote ? (
                <blockquote className="mt-5 rounded-lg border border-border bg-card p-5">
                  <Quote className="size-4 text-primary" aria-hidden="true" />
                  <p className="mt-2 text-sm">{study.beforeQuote.text}</p>
                  <footer className="mt-3 text-xs text-muted-foreground">
                    {study.beforeQuote.author}, {study.beforeQuote.role}
                  </footer>
                </blockquote>
              ) : null}
            </div>

            <div className="lg:col-span-4">
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                {caseStudyMeta.labels.requirements}
              </h2>
              <ul className="mt-4 space-y-2">
                {study.requirements.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                {caseStudyMeta.labels.built}
              </h2>
              <div className="mt-4 space-y-4 rounded-lg border border-border bg-card p-5">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {caseStudyMeta.labels.portal}
                  </p>
                  <p className="mt-1 text-sm">{study.built.portal}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {caseStudyMeta.labels.integrations}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {study.built.integrations.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-secondary px-2.5 py-0.5 text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {caseStudyMeta.labels.ai}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {study.built.ai.map((item) => (
                      <li key={item} className="text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Modules
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {study.modules.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border px-2.5 py-0.5 text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {study.weeklyBoard?.length ? (
          <Section className="bg-secondary/50 dark:bg-card">
            <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[2.75rem]">
              {caseStudyMeta.labels.build}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {study.weeklyBoard.map((week) => (
                <div key={week.week} className="rounded-lg border border-border bg-card p-5">
                  <p className="font-mono text-xs text-muted-foreground">
                    {week.week}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {week.done.map((task) => (
                      <li key={task} className="flex items-start gap-2 text-sm">
                        <Check
                          className="mt-0.5 size-3.5 shrink-0 text-success"
                          aria-hidden="true"
                        />
                        {task}
                      </li>
                    ))}
                    {week.next.map((task) => (
                      <li
                        key={task}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 size-2 shrink-0 rounded-full border border-muted-foreground/50" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        <Section>
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[2.75rem]">
            {caseStudyMeta.labels.results}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {study.results.map((result) => (
              <div
                key={result.label}
                className="rounded-lg border border-border bg-card p-6"
              >
                <p className="font-mono text-3xl font-semibold tabular-nums">
                  {result.value}
                </p>
                <p className="mt-2 text-sm font-medium">{result.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{result.note}</p>
              </div>
            ))}
          </div>

          {study.quote ? (
            <blockquote className="mt-10 max-w-3xl border-l-2 border-primary pl-6">
              <p className="font-heading text-xl font-medium tracking-tight sm:text-2xl">
                “{study.quote.text}”
              </p>
              <footer className="mt-4 flex items-center gap-3">
                {study.quote.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={study.quote.photo}
                    alt=""
                    className="size-10 rounded-full"
                  />
                ) : null}
                <div>
                  <p className="text-sm font-medium">{study.quote.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {study.quote.role}
                  </p>
                </div>
              </footer>
            </blockquote>
          ) : null}
        </Section>

        {study.next ? (
          <Section className="pt-0">
            <a
              href={`/work/${study.next.slug}`}
              className="group flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div>
                <p className="text-xs text-muted-foreground">
                  {caseStudyMeta.labels.next}
                </p>
                <p className="mt-1 text-lg font-semibold">{study.next.name}</p>
              </div>
              <span className="text-sm font-medium text-primary group-hover:underline">
                Read the story
              </span>
            </a>
          </Section>
        ) : null}

        <PageClosing
          title={caseStudyMeta.closing.title}
          body={caseStudyMeta.closing.body}
          primary={caseStudyMeta.closing.primary}
          secondary={caseStudyMeta.closing.secondary}
        />
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
