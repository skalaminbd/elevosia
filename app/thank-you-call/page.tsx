import type { Metadata } from "next";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { BookedArt } from "@/components/start/ThankYouArt";
import { booked } from "@/content/thank-you";

export const metadata: Metadata = {
  title: "You're booked | Elevosia",
  description:
    "Your 30-minute call is booked. We'll send a calendar invite and a few short questions before we talk.",
  robots: { index: false },
};

export default function ThankYouCallPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <section className="py-15 md:py-20 lg:py-25">
          <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <BookedArt />
            <div className="mt-8">
              <Eyebrow>{booked.eyebrow}</Eyebrow>
            </div>
            <h1 className="mt-5 font-heading text-[clamp(2.375rem,4.6vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
              {booked.title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              {booked.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href={booked.primary.href}>
                {booked.primary.label}
              </ButtonLink>
              <ButtonLink href={booked.secondary.href} variant="outline">
                {booked.secondary.label}
              </ButtonLink>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              {booked.note}{" "}
              <a
                href={booked.noteHref}
                className="font-medium text-primary hover:underline"
              >
                {booked.noteLabel}
              </a>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
