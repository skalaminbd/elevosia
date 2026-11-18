"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { calculator } from "@/content/why-custom";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Values = {
  people: number;
  cost: number;
  increase: number;
  hours: number;
};

const CARE = 299;
const MONTHS = 36;

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
  };
}

/**
 * The page's one interactive moment: four sliders, a live comparison and a
 * 36-month cumulative chart. Results are plain text, so they read cleanly with
 * reduced motion and without JavaScript animation.
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
  const breakEvenX =
    result.breakEven > 0
      ? ((result.breakEven - 1) / (MONTHS - 1)) * 300
      : null;
  const breakEvenY = breakEvenX
    ? 110 - (result.saasSeries[result.breakEven - 1] / chartMax) * 102
    : null;

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
          <div className="space-y-7">
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
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24 lg:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                Over three years
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {result.pkg.label} build
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <TotalRow
                label={calculator.labels.saas}
                value={money(result.saas)}
                fraction={result.saas / max}
                tone="muted"
                reduceMotion={reduceMotion}
              />
              <TotalRow
                label={calculator.labels.custom}
                value={money(result.custom)}
                fraction={result.custom / max}
                tone="primary"
                reduceMotion={reduceMotion}
              />
            </div>

            <p className="mt-6 font-heading text-xl font-semibold tracking-tight">
              {result.verdict}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-mono tabular-nums">
                {result.hoursYear.toLocaleString("en-US")}
              </span>{" "}
              {calculator.labels.hours}, or about{" "}
              {Math.round(result.hoursYear / 40)} working weeks.
            </p>

            <div className="mt-6">
              <svg
                viewBox="0 0 300 120"
                className="h-32 w-full overflow-visible"
                role="img"
                aria-label={`Cumulative cost over 36 months: subscriptions ${money(result.saas)}, custom ${money(result.custom)}`}
              >
                <line x1="0" y1="110" x2="300" y2="110" stroke="var(--color-border)" strokeWidth="1" />
                <line x1="0" y1="59" x2="300" y2="59" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 4" />
                <line x1="0" y1="8" x2="300" y2="8" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 4" />

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
                      x={Math.min(breakEvenX + 8, 262)}
                      y={Math.max(breakEvenY - 8, 14)}
                      className="fill-muted-foreground text-[9px]"
                    >
                      break-even
                    </text>
                  </g>
                ) : null}
              </svg>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-5 rounded-full bg-primary" />
                  Custom + care
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-5 rounded-full border-t-2 border-dashed border-muted-foreground" />
                  Subscriptions
                </span>
                <span className="ml-auto font-mono">36 months</span>
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
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={`calc-${id}`} className="text-sm font-medium">
          {label}
        </label>
        <span className="font-mono text-sm font-semibold tabular-nums">
          {prefix}
          {value}
          {suffix}
        </span>
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
        className="mt-3 h-11 w-full cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      />
      <p id={`calc-${id}-hint`} className="-mt-1 text-xs text-muted-foreground">
        {hint}
      </p>
    </div>
  );
}

function TotalRow({
  label,
  value,
  fraction,
  tone,
  reduceMotion,
}: {
  label: string;
  value: string;
  fraction: number;
  tone: "muted" | "primary";
  reduceMotion: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-mono text-base font-semibold tabular-nums">
          {value}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className={`h-full rounded-full ${
            tone === "primary" ? "bg-primary" : "bg-muted-foreground/40"
          }`}
          initial={reduceMotion ? false : { width: 0 }}
          whileInView={{ width: `${Math.max(4, fraction * 100)}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
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
