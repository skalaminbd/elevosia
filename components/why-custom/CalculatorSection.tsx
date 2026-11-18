"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useSpring } from "motion/react";
import { ArrowDownRight, ArrowUpRight, CheckCircle2, RotateCcw } from "lucide-react";
import { calculator } from "@/content/why-custom";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type Values = {
  people: number;
  cost: number;
  increase: number;
  hours: number;
};

const CARE = 299;
const MONTHS = 36;
const PRESETS = [10, 25, 50];

function packageFor(people: number): { label: string; price: number } {
  if (people <= 10) return { label: "Launch", price: 8500 };
  if (people <= 40) return { label: "Operate", price: 16000 };
  return { label: "Scale", price: 28000 };
}

function money(value: number): string {
  return "$" + Math.round(value).toLocaleString("en-US");
}

function compute(values: Values) {
  const monthly = values.people * values.cost;
  const pkg = packageFor(values.people);

  const saasSeries: number[] = [];
  const customSeries: number[] = [];
  let saas = 0;
  let custom = pkg.price;

  for (let month = 1; month <= MONTHS; month += 1) {
    const year = Math.floor((month - 1) / 12);
    saas += monthly * Math.pow(1 + values.increase / 100, year);
    custom += CARE;
    saasSeries.push(saas);
    customSeries.push(custom);
  }

  const breakEven =
    saasSeries.findIndex((total, index) => total >= customSeries[index]) + 1;

  const verdict =
    breakEven === 0
      ? "Over three years, subscriptions come out cheaper. If your tools already fit, stay where you are."
      : breakEven <= 18
        ? `Custom pays for itself in about ${breakEven} months.`
        : breakEven <= 30
          ? `Custom breaks even in about ${breakEven} months. Close call, so it comes down to fit.`
          : `Subscriptions stay cheaper for three years. Build only if your process is the difference.`;

  return {
    pkg,
    saas: saasSeries[MONTHS - 1],
    custom: customSeries[MONTHS - 1],
    saasSeries,
    customSeries,
    breakEven,
    verdict,
    hoursYear: Math.round(values.people * values.hours * 52),
    difference: saasSeries[MONTHS - 1] - customSeries[MONTHS - 1],
  };
}

/**
 * The page's one interactive moment: presets, four sliders, spring-animated
 * totals and a 36-month cumulative chart. Every value is also plain text, so
 * it reads cleanly with reduced motion.
 */
export function CalculatorSection() {
  const reduceMotion = useReducedMotion();
  const [values, setValues] = useState<Values>({
    people: 20,
    cost: 120,
    increase: 7,
    hours: 1.5,
  });

  const result = useMemo(() => compute(values), [values]);
  const max = Math.max(result.saas, result.custom);
  const chartMax = max * 1.08;
  const saasPath = linePath(result.saasSeries, chartMax);
  const customPath = linePath(result.customSeries, chartMax);
  const areaPath = `${customPath} L300,110 L0,110 Z`;
  const breakEvenX =
    result.breakEven > 0
      ? ((result.breakEven - 1) / (MONTHS - 1)) * 300
      : null;
  const breakEvenY = breakEvenX
    ? 110 - (result.saasSeries[result.breakEven - 1] / chartMax) * 102
    : null;
  const buildWins = result.difference > 0;

  return (
    <Section id="calculator">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>Cost calculator</Eyebrow>
        <h2 className="mt-4 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
          {calculator.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          {calculator.intro}
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="rounded-lg border border-border bg-card p-6 lg:col-span-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium text-muted-foreground">
              Quick start
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESETS.map((people) => (
                <button
                  key={people}
                  type="button"
                  onClick={() =>
                    setValues((current) => ({ ...current, people }))
                  }
                  aria-pressed={values.people === people}
                  className={cn(
                    "min-h-8 rounded-full px-2.5 text-[11px] font-medium transition-colors",
                    values.people === people
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  {people} people
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  setValues({
                    people: 20,
                    cost: 120,
                    increase: 7,
                    hours: 1.5,
                  })
                }
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Reset the calculator"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-7">
            {calculator.sliders.map((slider) => (
              <Slider
                key={slider.id}
                id={slider.id}
                label={slider.label}
                hint={slider.hint}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                prefix={slider.prefix}
                suffix={slider.suffix}
                value={values[slider.id as keyof Values]}
                onChange={(next) =>
                  setValues((current) => ({ ...current, [slider.id]: next }))
                }
              />
            ))}
          </div>

          <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
            The custom total includes the build plus 36 months of Essential care
            at $299 a month.
          </p>
        </div>

        <div className="lg:col-span-6">
          <div
            className="rounded-lg border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24 lg:p-8"
            aria-live="polite"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                Over three years
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {result.pkg.label} build
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-md border border-border bg-background p-3">
                <p className="text-[10px] text-muted-foreground">
                  {calculator.labels.saas}
                </p>
                <p className="mt-1 font-mono text-xl font-semibold tabular-nums">
                  <SpringMoney value={result.saas} reduceMotion={reduceMotion} />
                </p>
              </div>
              <div className="rounded-md border border-primary/25 bg-primary/5 p-3">
                <p className="text-[10px] text-muted-foreground">
                  {calculator.labels.custom}
                </p>
                <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-primary">
                  <SpringMoney
                    value={result.custom}
                    reduceMotion={reduceMotion}
                  />
                </p>
              </div>
            </div>

            <p
              className={cn(
                "mt-3 flex items-start gap-2 text-sm font-medium",
                buildWins ? "text-success" : "text-warning",
              )}
            >
              {buildWins ? (
                <ArrowDownRight className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              ) : (
                <ArrowUpRight className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              )}
              {buildWins
                ? `You keep ${money(result.difference)} compared with subscriptions.`
                : `Subscriptions cost ${money(-result.difference)} less over three years.`}
            </p>

            <div className="mt-4 flex items-start gap-2 rounded-md bg-secondary/60 p-3">
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p className="font-heading text-base font-semibold tracking-tight">
                {result.verdict}
              </p>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-mono tabular-nums">
                {result.hoursYear.toLocaleString("en-US")}
              </span>{" "}
              {calculator.labels.hours}, or about{" "}
              {Math.round(result.hoursYear / 40)} working weeks.
            </p>

            <div className="mt-5">
              <svg
                viewBox="0 0 300 120"
                className="h-32 w-full overflow-visible"
                role="img"
                aria-label={`Cumulative cost over 36 months: subscriptions ${money(result.saas)}, custom ${money(result.custom)}`}
              >
                <defs>
                  <linearGradient id="calc-area" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-primary)"
                      stopOpacity="0.22"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-primary)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <line x1="0" y1="110" x2="300" y2="110" stroke="var(--color-border)" strokeWidth="1" />
                <line x1="0" y1="59" x2="300" y2="59" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 4" />
                <line x1="0" y1="8" x2="300" y2="8" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 4" />

                <path d={areaPath} fill="url(#calc-area)" />

                <motion.path
                  d={saasPath}
                  fill="none"
                  stroke="var(--color-muted-foreground)"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: reduceMotion ? 0 : 1.4, ease: "easeOut" }}
                />
                <motion.path
                  d={customPath}
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: reduceMotion ? 0 : 1.4, ease: "easeOut" }}
                />

                {breakEvenX !== null && breakEvenY !== null ? (
                  <g>
                    <circle
                      cx={breakEvenX}
                      cy={breakEvenY}
                      r="3.5"
                      fill="var(--color-primary)"
                    />
                    <text
                      x={Math.min(breakEvenX + 8, 254)}
                      y={Math.max(breakEvenY - 8, 14)}
                      className="fill-muted-foreground text-[9px]"
                    >
                      break-even
                    </text>
                  </g>
                ) : null}
              </svg>

              <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground">
                <span>Month 1</span>
                <span>12</span>
                <span>24</span>
                <span>36</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-5 rounded-full bg-primary" />
                  Custom + care
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-5 rounded-full border-t-2 border-dashed border-muted-foreground" />
                  Subscriptions
                </span>
              </div>
            </div>

            <div className="mt-6">
              <ButtonLink href={calculator.cta.href}>
                {calculator.cta.label}
              </ButtonLink>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {calculator.finePrint}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Slider({
  id,
  label,
  hint,
  min,
  max,
  step,
  prefix,
  suffix,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={`calc-${id}`} className="text-sm font-medium">
          {label}
        </label>
        <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs font-semibold tabular-nums">
          {prefix}
          {value}
          {suffix}
        </span>
      </div>

      <div className="relative mt-3 h-11 rounded-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-secondary">
          <span
            className="block h-full rounded-full bg-primary transition-[width] duration-150"
            style={{ width: `${percent}%` }}
          />
        </div>
        <input
          id={`calc-${id}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-describedby={`calc-${id}-hint`}
          className="absolute inset-0 h-11 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-card [&::-moz-range-thumb]:bg-primary [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
        />
      </div>

      <p id={`calc-${id}-hint`} className="-mt-1 text-xs text-muted-foreground">
        {hint}
      </p>
    </div>
  );
}

function SpringMoney({
  value,
  reduceMotion,
}: {
  value: number;
  reduceMotion: boolean;
}) {
  const spring = useSpring(value, { damping: 38, stiffness: 220 });
  const [shown, setShown] = useState(() => Math.round(value));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const stop = spring.on("change", (latest) => setShown(Math.round(latest)));
    return stop;
  }, [spring]);

  return <>${Math.round(reduceMotion ? value : shown).toLocaleString("en-US")}</>;
}

function linePath(values: number[], max: number): string {
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 300;
      const y = 110 - (value / max) * 102;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}
