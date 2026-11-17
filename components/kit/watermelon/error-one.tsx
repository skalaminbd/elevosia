// Source: https://registry.watermelon.sh/r/error-1.json (adapted to Elevosia tokens)

import Link from "next/link";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ButtonLink } from "@/components/shared/ButtonLink";

function GradientCode({ code }: { code: string }) {
  return (
    <svg
      viewBox="0 0 800 300"
      className="w-full max-w-80 select-none sm:max-w-md"
      aria-hidden="true"
    >
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-primary/20 stroke-primary font-black tracking-tighter"
        style={{ fontSize: "20rem" }}
        strokeWidth="2"
        strokeDasharray="40 20"
      >
        {code}
      </text>
    </svg>
  );
}

export function ErrorOne({
  code = "404",
  title = "This page went missing.",
  description = "The page you are looking for does not exist or has moved. Let's get you back on track.",
}: {
  code?: string;
  title?: string;
  description?: string;
}) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-highlight font-heading text-base font-bold text-highlight-foreground">
            e
          </span>
          <span className="font-heading text-xl font-bold tracking-tight">
            elevosia
          </span>
        </Link>

        <ThemeToggle />
      </div>

      <div
        className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-highlight/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-primary/5"
        aria-hidden="true"
      />

      <section
        aria-labelledby="error-one-title"
        className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center text-center"
      >
        <GradientCode code={code} />

        <div className="flex flex-col items-center gap-2">
          <h1
            id="error-one-title"
            className="text-xl leading-snug font-bold tracking-tight sm:text-2xl"
          >
            {title}
          </h1>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground sm:max-w-sm sm:text-base">
            {description}
          </p>
        </div>

        <ButtonLink href="/" className="mt-4 rounded-full">
          Back to home
        </ButtonLink>
      </section>
    </main>
  );
}
