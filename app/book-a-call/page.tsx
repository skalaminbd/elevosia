import type { Metadata } from "next";
import { SiteFooter } from "@/components/kit/watermelon/site-footer";
import { SiteHeader } from "@/components/kit/watermelon/site-header";
import { BookingForm } from "@/components/book-a-call/BookingForm";
import { BookingHero } from "@/components/book-a-call/BookingHero";
import { CoverSection } from "@/components/book-a-call/CoverSection";
import { PageClosing } from "@/components/shared/PageClosing";
import { bookingClosing, bookingMeta } from "@/content/book-a-call";

export const metadata: Metadata = {
  title: bookingMeta.title,
  description: bookingMeta.description,
  alternates: { canonical: "/book-a-call" },
  openGraph: {
    title: bookingMeta.title,
    description: bookingMeta.description,
    url: "/book-a-call",
    type: "website",
  },
};

export default function BookACallPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-x-clip">
        <BookingHero />
        <CoverSection />
        <BookingForm />
        <PageClosing
          title={bookingClosing.title}
          body={bookingClosing.body}
          primary={bookingClosing.primary}
          secondary={bookingClosing.secondary}
        />
      </main>

      <SiteFooter />
    </>
  );
}
