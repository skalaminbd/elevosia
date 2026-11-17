"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { comparison, type ComparisonOptionId } from "@/content/home";
import { ContinuousTabs } from "@/components/kit/watermelon/continuous-tabs";
import { BorderBeam } from "@/components/ui/border-beam";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/home/Reveal";
import { useInViewLoop, useLoopStep } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useTokenColor } from "@/hooks/use-token-color";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type BandBox = { top: number; height: number };

const isComparisonOptionId = (value: string): value is ComparisonOptionId =>
  comparison.options.some((option) => option.id === value);

export function ComparisonSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.1 });
  const gridColor = useTokenColor("--foreground");

  const [hovered, setHovered] = useState(false);
  const [mobileOption, setMobileOption] = useState<ComparisonOptionId>("saas");
  const [bands, setBands] = useState<BandBox[]>([]);

  const activeRow = useLoopStep(comparison.rows.length, {
    active: inView && !hovered && !reduceMotion,
    intervalMs: 1500,
  });

  const tableRef = useRef<HTMLTableElement | null>(null);
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([]);

  // Measure each row so the travelling highlight lines up with real content
  // height, including wrapped cells at narrow desktop widths.
  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    const measure = () => {
      const tableBox = table.getBoundingClientRect();
      setBands(
        rowRefs.current.map((row) => {
          if (!row) return { top: 0, height: 0 };
          const box = row.getBoundingClientRect();
          return { top: box.top - tableBox.top, height: box.height };
        }),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(table);
    document.fonts?.ready.then(measure).catch(() => undefined);

    return () => observer.disconnect();
  }, []);

  const activeMobile = useMemo(
    () =>
      comparison.compareOptions.find((option) => option.id === mobileOption) ??
      comparison.compareOptions[0],
    [mobileOption],
  );

  return (
    <section id="comparison" className="relative py-15 md:py-20 lg:py-25">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>{comparison.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.07}>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                {comparison.title}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.14} className="lg:col-span-5">
            <p className="text-base text-muted-foreground">{comparison.intro}</p>
          </Reveal>
        </div>

        <div
          ref={ref}
          className="relative mt-10 lg:mt-14"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          {/* Ambient: faint flickering grid, desktop only, pauses off screen */}
          {inView && !reduceMotion && gridColor ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-4 -top-8 bottom-0 hidden opacity-10 md:block"
            >
              <FlickeringGrid
                color={gridColor}
                squareSize={3}
                gridGap={7}
                flickerChance={0.25}
                maxOpacity={0.6}
                className="[mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
              />
            </div>
          ) : null}

          {/* Desktop: semantic table with the Elevosia column raised */}
          <div className="relative hidden lg:block">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-[19%] rounded-lg border border-border bg-card shadow-md"
            >
              {!reduceMotion && bands.length > 0 ? (
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  {bands.map((band, index) => (
                    <motion.div
                      key={comparison.rows[index]?.criterion ?? index}
                      className="absolute inset-x-1 rounded-md bg-highlight/15"
                      style={{ top: band.top, height: band.height }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: activeRow === index ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    />
                  ))}
                </div>
              ) : null}
              {!reduceMotion ? (
                <BorderBeam
                  size={140}
                  duration={16}
                  borderWidth={1.5}
                  colorFrom="var(--highlight)"
                  colorTo="var(--success)"
                />
              ) : null}
            </div>

            <table
              ref={tableRef}
              className="relative w-full table-fixed border-separate border-spacing-0"
            >
              <caption className="sr-only">
                SaaS, a freelancer, a big agency and Elevosia compared
              </caption>
              <colgroup>
                <col className="w-[24%]" />
                <col className="w-[19%]" />
                <col className="w-[19%]" />
                <col className="w-[19%]" />
                <col className="w-[19%]" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="pt-6 pr-6 pb-5 text-left text-xs font-medium text-muted-foreground"
                  >
                    <span className="sr-only">What you compare</span>
                  </th>
                  {comparison.options.map((option) => (
                    <th
                      key={option.id}
                      scope="col"
                      className={cn(
                        "pt-6 pb-5 text-center text-sm font-semibold",
                        option.id === "elevosia"
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {option.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row, rowIndex) => (
                  <tr
                    key={row.criterion}
                    ref={(element) => {
                      rowRefs.current[rowIndex] = element;
                    }}
                    className="group/row"
                  >
                    <th
                      scope="row"
                      className={cn(
                        "py-4 pr-6 text-left text-sm font-medium text-foreground",
                        rowIndex > 0 && "border-t border-border/60",
                      )}
                    >
                      {row.criterion}
                    </th>
                    {comparison.options.map((option) => (
                      <td
                        key={option.id}
                        className={cn(
                          "px-2 py-4 text-center text-sm transition-colors group-hover/row:bg-accent/50",
                          rowIndex > 0 && "border-t border-border/60",
                          option.id === "elevosia"
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {row.values[option.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: one option at a time against Elevosia, no sideways scroll */}
          <div className="lg:hidden">
            <ContinuousTabs
              tabs={comparison.compareOptions}
              activeId={mobileOption}
              onChange={(id) => {
                if (isComparisonOptionId(id)) setMobileOption(id);
              }}
              className="w-full justify-between"
            />

            <ul className="mt-4 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              {comparison.rows.map((row, index) => (
                <li
                  key={row.criterion}
                  className={cn("p-4", index > 0 && "border-t border-border/60")}
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    {row.criterion}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border/60 p-3">
                      <p className="text-xs text-muted-foreground">
                        {activeMobile.label}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {row.values[mobileOption]}
                      </p>
                    </div>
                    <div className="rounded-lg bg-accent p-3">
                      <p className="text-xs font-medium text-foreground">Elevosia</p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {row.values.elevosia}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Reveal delay={0.1}>
          <Link
            href={comparison.link.href}
            className="mt-8 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {comparison.link.label}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
