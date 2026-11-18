import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { ScrollProgress } from "@/components/blog/ScrollProgress";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Toc } from "@/components/shared/Toc";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  inlineCta,
  postEndCta,
  posts,
  publishedPosts,
} from "@/content/blog";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return publishedPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug && item.published);
  if (!post) return {};

  return {
    title: `${post.title} | Elevosia`,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}`,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug && item.published);
  if (!post || !post.body) notFound();

  const sections = post.body;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: "2026-11-18",
    dateModified: "2026-11-18",
    author: {
      "@type": "Person",
      name: "Alamin",
      jobTitle: "Founder, Elevosia",
      url: "https://elevosia.com/about",
    },
    publisher: { "@type": "Organization", name: "Elevosia" },
    mainEntityOfPage: `https://elevosia.com/blog/${post.slug}`,
  };

  const faqLd = post.faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <>
      <SiteHeader />
      <ScrollProgress />

      <main className="relative overflow-x-clip">
        <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-15 sm:px-6 md:pt-20 lg:px-8 lg:pt-24">
          <header className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                {post.category}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {post.date} · {post.readingTime}
              </span>
            </div>

            <h1 className="mt-5 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {post.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {post.summary}
            </p>

            <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/founder/alamin.svg"
                alt=""
                className="size-9 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">Alamin</p>
                <p className="text-xs text-muted-foreground">
                  Founder, Elevosia
                </p>
              </div>
            </div>
          </header>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <aside className="hidden lg:col-span-3 lg:block">
              <Toc
                sections={sections.map(({ id, title }) => ({ id, title }))}
              />
            </aside>

            <article className="max-w-3xl lg:col-span-9">
              {post.takeaways?.length ? (
                <div className="mb-8 rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    What you&apos;ll take away
                  </p>
                  <ul className="mt-3 space-y-2">
                    {post.takeaways.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 border-t border-border py-8 first:border-t-0 first:pt-0"
                >
                  <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base leading-relaxed text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {post.pullQuote &&
                  post.pullQuote.afterSection === section.id ? (
                    <blockquote className="mt-6 border-l-2 border-primary pl-5">
                      <p className="font-heading text-xl font-medium tracking-tight text-foreground">
                        “{post.pullQuote.text}”
                      </p>
                    </blockquote>
                  ) : null}

                  {index === 3 ? <InlineCta /> : null}
                </section>
              ))}

              {post.faq ? (
                <section className="mt-6 border-t border-border pt-8">
                  <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                    Questions
                  </h2>
                  <Accordion type="single" collapsible className="mt-4">
                    {post.faq.map((item, index) => (
                      <AccordionItem key={item.question} value={`faq-${index}`}>
                        <AccordionTrigger className="cursor-pointer gap-4 py-5 text-base font-medium hover:no-underline [&_[data-slot=accordion-trigger-icon]]:hidden">
                          <span>{item.question}</span>
                          <Plus
                            aria-hidden="true"
                            className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none group-aria-expanded/accordion-trigger:rotate-45"
                          />
                        </AccordionTrigger>
                        <AccordionContent
                          forceMount
                          className="grid h-auto grid-rows-[0fr] overflow-hidden pb-0 text-base text-muted-foreground transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none [[data-state=open]_&]:grid-rows-[1fr]"
                        >
                          <div className="min-h-0 overflow-hidden">
                            <div className="pb-5">{item.answer}</div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              ) : null}

              <section className="mt-10 rounded-lg border border-border bg-card p-6 lg:p-8">
                <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                  {postEndCta.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  {postEndCta.body}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <ButtonLink href={postEndCta.primary.href}>
                    {postEndCta.primary.label}
                  </ButtonLink>
                  <ButtonLink href={postEndCta.secondary.href} variant="outline">
                    {postEndCta.secondary.label}
                  </ButtonLink>
                </div>
              </section>

              <section className="mt-8 flex items-start gap-4 rounded-lg border border-border bg-card p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/founder/alamin.svg"
                  alt=""
                  className="size-12 shrink-0 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">Alamin</p>
                  <p className="text-xs text-muted-foreground">
                    Founder, Elevosia
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Writes about the operating problems behind growing service
                    businesses, and what we learn building for them.
                  </p>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
    </>
  );
}

function InlineCta() {
  return (
    <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-5">
      <p className="text-lg font-semibold">{inlineCta.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{inlineCta.body}</p>
      <div className="mt-4">
        <ButtonLink href={inlineCta.cta.href} variant="outline">
          {inlineCta.cta.label}
        </ButtonLink>
      </div>
    </div>
  );
}
