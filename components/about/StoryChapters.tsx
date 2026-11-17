"use client";

import { chapters } from "@/content/about";
import { BeamHub } from "@/components/about/items/BeamHub";
import { LeadInbox } from "@/components/about/items/LeadInbox";
import { ThreeOptions } from "@/components/about/items/ThreeOptions";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const ITEMS = [LeadInbox, ThreeOptions, BeamHub];

function ChapterRow({ index }: { index: number }) {
  const chapter = chapters[index];
  const Item = ITEMS[index];
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.25 });
  const reversed = index % 2 === 1;

  return (
    <article className="grid gap-8 border-b border-border py-12 lg:grid-cols-12 lg:gap-10 lg:py-16">
      <div className="lg:col-span-1">
        <p className="font-heading text-2xl font-semibold tabular-nums text-muted-foreground/70 lg:text-3xl">
          {chapter.index}
        </p>
      </div>

      <div className={cn("lg:col-span-6", reversed && "lg:order-3")}>
        <span aria-hidden="true" className="mb-5 block h-px w-12 bg-primary" />
        <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
          {chapter.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          {chapter.body}
        </p>
      </div>

      <div
        ref={ref}
        className={cn("lg:col-span-5 lg:self-start", reversed && "lg:order-2")}
      >
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <Item
            active={inView && !reduceMotion}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>
    </article>
  );
}

export function StoryChapters() {
  return (
    <Section id="story">
      <div className="border-t border-border">
        {chapters.map((chapter, index) => (
          <ChapterRow key={chapter.id} index={index} />
        ))}
      </div>
    </Section>
  );
}
