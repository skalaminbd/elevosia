"use client";

import dynamic from "next/dynamic";
import {
  Clock,
  FolderKey,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { remote } from "@/content/home";
import { RemoteClockBar } from "@/components/home/RemoteClockBar";
import { Reveal } from "@/components/home/Reveal";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ICONS = {
  overlap: Clock,
  ownership: FolderKey,
  nda: ShieldCheck,
  board: LayoutDashboard,
} as const;

type PointId = keyof typeof ICONS;

const isPointId = (value: string): value is PointId => value in ICONS;

// The dotted map renders thousands of nodes, so it never joins the server HTML.
const TeamMap = dynamic(() => import("@/components/shared/TeamMap"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="aspect-[25/13] w-full rounded-lg bg-muted/60 motion-safe:animate-pulse"
    />
  ),
});

export function RemoteTeamSection() {
  const reduceMotion = useReducedMotion();
  // The map is thousands of SVG nodes, so it only mounts when it is close.
  const { ref: mapRef, inView: mapNear } = useInViewLoop<HTMLDivElement>({
    threshold: 0,
    rootMargin: "500px",
  });

  return (
    <section id="remote-team" className="relative py-15 md:py-20 lg:py-25">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>{remote.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.07}>
            <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
              {remote.title}
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">{remote.body}</p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-6">
            <Reveal>
              <div
                ref={mapRef}
                className="rounded-lg border border-border bg-card p-6 shadow-sm"
              >
                {mapNear ? (
                  <TeamMap reduceMotion={reduceMotion} />
                ) : (
                  <div
                    aria-hidden="true"
                    className="aspect-[25/13] w-full rounded-lg bg-muted/60"
                  />
                )}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <RemoteClockBar />
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <ul className="flex h-full flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              {remote.points.map((point) => {
                const Icon = isPointId(point.id) ? ICONS[point.id] : Clock;

                return (
                  <li key={point.id} className="flex flex-1 items-start gap-4 p-6">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-base font-medium text-foreground">
                        {point.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {point.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
