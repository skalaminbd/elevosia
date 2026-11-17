"use client";

import { founder } from "@/content/home";
import { Reveal } from "@/components/home/Reveal";
import { Ripple } from "@/components/ui/ripple";
import { TextAnimate } from "@/components/ui/text-animate";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const QUOTED = `“${founder.quote}”`;

export function FounderSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="founder" className="relative py-15 md:py-20 lg:py-25">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <blockquote>
            <p className="font-heading text-2xl leading-snug font-medium tracking-tight text-pretty text-foreground sm:text-3xl lg:text-4xl">
              {reduceMotion ? (
                QUOTED
              ) : (
                <TextAnimate
                  as="span"
                  by="word"
                  animation="blurIn"
                  startOnView
                  once
                  duration={0.5}
                  className="inline"
                >
                  {QUOTED}
                </TextAnimate>
              )}
            </p>
          </blockquote>

          <Reveal delay={0.2}>
            <div className="mt-10 flex items-center gap-5">
              <div className="relative size-20 shrink-0">
                {!reduceMotion ? (
                  <Ripple
                    aria-hidden="true"
                    mainCircleSize={64}
                    numCircles={3}
                    mainCircleOpacity={0.16}
                    className="[mask-image:none]"
                  />
                ) : null}
                {/* Drop a real photo at public/founder/alamin.svg (or point founder.photo at a new file) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={founder.photo}
                  alt={founder.photoAlt}
                  width={320}
                  height={320}
                  className="relative size-20 rounded-full border border-border object-cover"
                />
              </div>

              <div>
                <p className="text-base font-semibold text-foreground">
                  {founder.name}
                </p>
                <p className="text-sm text-muted-foreground">{founder.role}</p>
                <a
                  href={founder.linkedin.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {founder.linkedin.label}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
