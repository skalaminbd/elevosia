"use client";

import { useEffect, useState } from "react";
import { industryTabs } from "@/content/industries";
import { AgenciesPreview } from "@/components/home/who-previews/AgenciesPreview";
import { CarePreview } from "@/components/home/who-previews/CarePreview";
import { FieldServicesPreview } from "@/components/home/who-previews/FieldServicesPreview";
import { NonprofitsPreview } from "@/components/home/who-previews/NonprofitsPreview";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const PREVIEWS = {
  "field-services": FieldServicesPreview,
  agencies: AgenciesPreview,
  nonprofits: NonprofitsPreview,
  care: CarePreview,
} as const;

type TabId = keyof typeof PREVIEWS;

const isTabId = (value: string): value is TabId => value in PREVIEWS;

/**
 * Industry tabs: each one carries its own copy and a live preview of the
 * dashboard that industry gets. Deep links like /industries#care work.
 */
export function IndustryTabs() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.15 });
  const [active, setActive] = useState<TabId>("field-services");
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const hash = window.location.hash.replace("#", "");
      if (isTabId(hash)) {
        setActive(hash);
        setPicked(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!inView || picked || reduceMotion) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        const index = industryTabs.findIndex((tab) => tab.id === current);
        return industryTabs[(index + 1) % industryTabs.length].id;
      });
    }, 6500);
    return () => window.clearInterval(timer);
  }, [inView, picked, reduceMotion]);

  const tab = industryTabs.find((item) => item.id === active) ?? industryTabs[0];
  const Preview = PREVIEWS[tab.id] ?? FieldServicesPreview;

  const select = (id: TabId) => {
    setActive(id);
    setPicked(true);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <Section id="industries" className="scroll-mt-24 bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div ref={ref}>
        <Eyebrow tone="inverse">Pick your industry</Eyebrow>

        <div
          role="group"
          aria-label="Choose an industry"
          className="mt-5 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-card p-1 shadow-sm"
        >
          {industryTabs.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={active === item.id}
              onClick={() => select(item.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                active === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-6">
            <p className="font-mono text-xs text-primary-foreground/70 dark:text-foreground/70">
              {tab.kicker}
            </p>
            <h2 className="mt-3 font-heading text-[1.75rem] leading-tight font-bold tracking-[-0.03em] text-balance sm:text-[2.25rem]">
              {tab.hook}
            </h2>
            <p className="mt-4 text-base text-primary-foreground/80 dark:text-foreground/80">{tab.story}</p>

            <div className="mt-6">
              <p className="text-xs font-medium text-primary-foreground/70 dark:text-foreground/70">
                Modules
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {tab.modules.map((module) => (
                  <li
                    key={module}
                    className="rounded-full border border-border bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground dark:bg-background/40 dark:text-foreground"
                  >
                    {module}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 text-sm text-primary-foreground/70 dark:text-foreground/70">
              <span className="font-medium text-primary-foreground dark:text-foreground">
                Numbers on your dashboard:
              </span>{" "}
              {tab.numbers.join(" · ")}
            </p>

            <p className="mt-3 text-sm text-primary-foreground/70 dark:text-foreground/70">
              <span className="font-medium text-primary-foreground dark:text-foreground">Where AI helps:</span>{" "}
              {tab.ai}
            </p>

            {"note" in tab && tab.note ? (
              <p className="mt-4 rounded-lg border border-border bg-highlight/10 p-3 text-xs text-highlight">
                {tab.note}
              </p>
            ) : null}

            <div className="mt-7">
              <ButtonLink href="/start" className="bg-background text-foreground hover:bg-background/90">{tab.cta}</ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                  What it could look like
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-success motion-safe:animate-[who-blink_1800ms_ease-in-out_infinite]" />
                  Live
                </span>
              </div>
              <Preview animated={inView && !reduceMotion} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
