import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { ThankYouArt } from "@/components/start/ThankYouArt";
import { ThankYouTitle } from "@/components/start/ThankYouTitle";
import { thankYou } from "@/content/thank-you";

export const metadata: Metadata = {
  title: "Thanks | Elevosia",
  description:
    "Your request is in. Check your inbox for your client portal login and write your requirements whenever you're ready.",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <section className="py-15 md:py-20 lg:py-25">
          <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <ThankYouArt />
            <div className="mt-8">
              <Eyebrow>{thankYou.eyebrow}</Eyebrow>
            </div>
            <h1 className="mt-5 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              <Suspense fallback={thankYou.titleFallback}>
                <ThankYouTitle fallback={thankYou.titleFallback} />
              </Suspense>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              {thankYou.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href={thankYou.primary.href}>
                {thankYou.primary.label}
              </ButtonLink>
              <ButtonLink href={thankYou.secondary.href} variant="outline">
                {thankYou.secondary.label}
              </ButtonLink>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              {thankYou.note}{" "}
              <a
                href={thankYou.noteHref}
                className="font-medium text-primary hover:underline"
              >
                {thankYou.noteLabel}
              </a>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
