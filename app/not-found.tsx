import type { Metadata } from "next";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { NotFoundArt } from "@/components/shared/NotFoundArt";

export const metadata: Metadata = {
  title: "Page not found | Elevosia",
  description: "This page wandered off. Try the homepage or the live demo instead.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <section className="relative flex min-h-[70svh] items-center overflow-hidden py-20 md:py-28">
          <NotFoundArt />

          <div className="relative mx-auto w-full max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <Eyebrow>404</Eyebrow>
            <h1 className="mt-5 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              This page wandered off.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
              Unlike your data in an Elevosia dashboard, which always stays where
              you left it.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/">Go home</ButtonLink>
              <ButtonLink href="/demo" variant="outline">
                Try the live demo
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
