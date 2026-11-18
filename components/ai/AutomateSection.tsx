"use client";

import { automate } from "@/content/ai-automation";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Three automation groups beside the beam hub: website, email, PDF and form
 * flow into the AI core, which writes to the dashboard, calendar, inbox and
 * report. Beams flow only while the section is on screen.
 */
export function AutomateSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.1 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="what-we-automate">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow>Where it helps</Eyebrow>
          <h2 className="mt-4 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {automate.title}
          </h2>
        </div>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg lg:col-span-5">
          {automate.intro}
        </p>
      </div>

      <div
        ref={ref}
        className="mt-10 grid gap-8 rounded-lg border border-border bg-card p-6 lg:grid-cols-12 lg:gap-12 lg:p-10"
      >
        <div className="lg:col-span-7">
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            {automate.groups.map((group) => (
              <div key={group.id}>
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {group.label}
                </h3>
                <ul className="mt-4 space-y-4">
                  {group.items.map((item) => (
                    <li key={item.title}>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <Hub alive={alive} />
        </div>
      </div>
    </Section>
  );
}

function Hub({ alive }: { alive: boolean }) {
  const { flow } = automate;
  const rows = [40, 100, 160, 220];

  return (
    <div className="mx-auto w-full max-w-sm lg:max-w-none">
      <svg
        viewBox="0 0 320 260"
        className="w-full"
        role="img"
        aria-label="Inputs such as website, email, PDF and form flow into an AI core, which writes to your dashboard, calendar, client inbox and reports"
      >
        {flow.inputs.map((label, index) => {
          const y = rows[index];
          return (
            <g key={label}>
              <rect
                x="4"
                y={y - 13}
                width="80"
                height="26"
                rx="6"
                fill="var(--color-background)"
                stroke="var(--color-border)"
              />
              <text
                x="44"
                y={y + 3.5}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                {label}
              </text>
              <path
                d={`M84 ${y} C108 ${y} 104 130 134 130`}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                strokeLinecap="round"
                className={alive ? "animate-[ai-flow_2200ms_linear_infinite]" : "opacity-40"}
                style={{ animationDelay: `${index * 0.25}s` }}
              />
            </g>
          );
        })}

        <circle
          cx="160"
          cy="130"
          r="30"
          fill="var(--color-primary)"
          className={alive ? "animate-[pulse-soft_3200ms_ease-in-out_infinite]" : ""}
        />
        <circle
          cx="160"
          cy="130"
          r="36"
          fill="none"
          stroke="var(--color-primary)"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
        <text
          x="160"
          y="127"
          textAnchor="middle"
          className="fill-primary-foreground text-[9px] font-semibold"
        >
          AI core
        </text>
        <text
          x="160"
          y="138"
          textAnchor="middle"
          className="fill-primary-foreground/70 text-[7px]"
        >
          one job each
        </text>

        {flow.outputs.map((label, index) => {
          const y = rows[index];
          return (
            <g key={label}>
              <path
                d={`M190 130 C218 130 212 ${y} 236 ${y}`}
                fill="none"
                stroke="var(--color-success)"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                strokeLinecap="round"
                className={alive ? "animate-[ai-flow_2200ms_linear_infinite]" : "opacity-40"}
                style={{ animationDelay: `${index * 0.25 + 0.8}s` }}
              />
              <rect
                x="236"
                y={y - 13}
                width="80"
                height="26"
                rx="6"
                fill="var(--color-background)"
                stroke="var(--color-border)"
              />
              <text
                x="276"
                y={y + 3.5}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
