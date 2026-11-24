import type { Metadata } from "next";
import { Check } from "lucide-react";

import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { StartProjectForm } from "@/components/start-project/StartProjectForm";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";

export const metadata: Metadata = {
  title: "Start a Project | Elevosia",
  description:
    "Tell us what your business needs, pick the modules and services that fit, and get a free Blueprint with a fixed price in 5 business days.",
  alternates: { canonical: "/start-project" },
  openGraph: {
    title: "Start a Project | Elevosia",
    description:
      "Pick your modules, add-ons and services, describe the project, and get a free Blueprint with a fixed price in 5 business days.",
    url: "/start-project",
    type: "website",
  },
};

const trust = [
  "Free Blueprint",
  "Fixed price before we build",
  "You own the code and data",
  "NDA on request",
];

const steps = [
  {
    title: "Tell us what you need",
    body: "Pick a starting point, then the modules, functions and add-ons that fit your business.",
  },
  {
    title: "We read it within a day",
    body: "Your project manager asks questions beside your answers, and we agree the scope with you.",
  },
  {
    title: "Your Blueprint arrives",
    body: "Milestones, a timeline and a fixed price within 5 business days. Nothing is charged until you approve.",
  },
];

export default function StartProjectPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <section className="relative overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-12 sm:px-6 md:pt-20 md:pb-16 lg:px-8 lg:pt-24">
            <div className="mx-auto max-w-5xl text-center">
              <Eyebrow>Start a project</Eyebrow>
              <h1 className="mt-6 font-heading text-[clamp(2.5rem,5.6vw,5rem)] leading-[0.96] font-bold tracking-[-0.04em] text-balance">
                Tell us what slows you down. We&apos;ll send back a plan.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
                Answer a few questions about your business, pick the parts you
                need, and describe what should change. Your free Blueprint comes
                back with a fixed price in 5 business days.
              </p>
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                {trust.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-success" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-4xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl">
                Three steps. No surprises.
              </h2>
              <p className="mt-4 max-w-md text-base text-primary-foreground/70 dark:text-foreground/70">
                The form takes about 15 minutes. You can stop and come back when
                you have the answers.
              </p>
            </div>
            <ol className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-lg border border-border p-5"
                >
                  <span className="font-mono text-xs text-highlight">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-primary-foreground/70 dark:text-foreground/70">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        <Section id="intake-form">
          <StartProjectForm />
        </Section>

        <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="text-4xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl">
                Rather talk it through first?
              </h2>
              <p className="mt-4 max-w-xl text-base text-primary-foreground/70 dark:text-foreground/70">
                Book 30 minutes. We ask questions, look at your tools and give an
                honest take, even if the answer is that you do not need us yet.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <ButtonLink
                href="/book-a-call"
                className="bg-background text-foreground hover:bg-background/90"
              >
                Book a call
              </ButtonLink>
              <ButtonLink
                href="/custom-dashboards"
                variant="outline"
                className="border-border bg-transparent text-primary-foreground hover:bg-primary-foreground/10 dark:text-foreground dark:hover:bg-foreground/10"
              >
                See what we build
              </ButtonLink>
            </div>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
