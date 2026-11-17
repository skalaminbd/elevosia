"use client";

import { team } from "@/content/about";
import { Section } from "@/components/shared/Section";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { ShineBorder } from "@/components/ui/shine-border";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function TeamSection() {
  const reduceMotion = useReducedMotion();
  const { founder, people } = team;

  return (
    <Section id="team">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg border border-border bg-card p-3 shadow-sm">
            {founder.photo ? (
              <div className="relative overflow-hidden rounded-md">
                {!reduceMotion ? (
                  <ShineBorder
                    borderWidth={1.5}
                    duration={14}
                    shineColor="var(--highlight)"
                    className="rounded-md"
                  />
                ) : null}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={founder.photo}
                  alt={founder.photoAlt}
                  width={320}
                  height={320}
                  className="size-full rounded-md object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-7">
          <Eyebrow>{team.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {founder.name}, {founder.role.toLowerCase()}.
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            {founder.line}
          </p>
          <a
            href={founder.linkedin.href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {founder.linkedin.label}
          </a>

          {people.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-3">
              {people.map((person) => (
                <li
                  key={person.name}
                  className="flex items-center gap-3 rounded-full border border-border px-3 py-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={person.photo}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 rounded-full object-cover"
                  />
                  <span className="text-sm">
                    <span className="block font-medium text-foreground">
                      {person.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {person.role}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
