"use client";

import { ai } from "@/content/home";
import { DemoCard } from "@/components/home/DemoCard";
import { Reveal } from "@/components/home/Reveal";
import { AskDataDemo } from "@/components/home/demos/AskDataDemo";
import { BriefingDemo } from "@/components/home/demos/BriefingDemo";
import { LeadReplyDemo } from "@/components/home/demos/LeadReplyDemo";
import { ShiftMatchDemo } from "@/components/home/demos/ShiftMatchDemo";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function AiSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.1 });
  const demoActive = inView && !reduceMotion;

  return (
    <section id="ai" className="relative py-15 md:py-20 lg:py-25">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow>{ai.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.07}>
            <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
              {ai.title}
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">{ai.body}</p>
          </Reveal>
        </div>

        <div
          ref={ref}
          className="mt-10 grid gap-4 sm:gap-6 lg:mt-14 lg:grid-cols-6"
        >
          <Reveal delay={0.05} className="lg:col-span-4">
            <DemoCard title={ai.briefing.title} caption={ai.briefing.caption}>
              <BriefingDemo active={demoActive} reduceMotion={reduceMotion} />
            </DemoCard>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-2">
            <DemoCard title={ai.lead.title} caption={ai.lead.caption}>
              <LeadReplyDemo active={demoActive} reduceMotion={reduceMotion} />
            </DemoCard>
          </Reveal>

          <Reveal delay={0.19} className="lg:col-span-2">
            <DemoCard
              title={ai.scheduling.title}
              caption={ai.scheduling.caption}
            >
              <ShiftMatchDemo active={demoActive} reduceMotion={reduceMotion} />
            </DemoCard>
          </Reveal>

          <Reveal delay={0.26} className="lg:col-span-4">
            <DemoCard title={ai.data.title} caption={ai.data.caption}>
              <AskDataDemo active={demoActive} reduceMotion={reduceMotion} />
            </DemoCard>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <ButtonLink href={ai.cta.href}>{ai.cta.label}</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
