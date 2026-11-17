"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { dhaka, dhakaFacts } from "@/content/about";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const TeamMap = dynamic(() => import("@/components/shared/TeamMap"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="aspect-[25/13] w-full rounded-lg bg-muted/60"
    />
  ),
});

export function DhakaSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({
    threshold: 0,
    rootMargin: "500px",
  });

  return (
    <Section id="why-dhaka">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <h2 className="font-heading text-4xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-5xl">
            {dhaka.title}
          </h2>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            {dhaka.body}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {dhakaFacts.map((fact) => (
              <li
                key={fact}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {fact}
              </li>
            ))}
          </ul>
          <Link
            href={dhaka.link.href}
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {dhaka.link.label}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div ref={ref} className="lg:col-span-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            {inView ? <TeamMap reduceMotion={reduceMotion} /> : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
