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
    <article className="grid gap-8 border-b border-border py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
      <div className={cn("lg:col-span-7", reversed && "lg:order-2")}>
        <p className="font-mono text-sm text-muted-foreground">
          {chapter.index}
        </p>
        <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {chapter.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          {chapter.body}
        </p>
      </div>

      <div
        ref={ref}
        className={cn("lg:col-span-5 lg:self-center", reversed && "lg:order-1")}
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
