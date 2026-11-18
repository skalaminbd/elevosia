import { demoClosing } from "@/content/demo";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Section } from "@/components/shared/Section";

/** Closing band with a marquee of module chips. */
export function DemoClosing() {
  const chips = [...demoClosing.modules, ...demoClosing.modules];

  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
            {demoClosing.title}
          </h2>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 dark:text-foreground/80">
            {demoClosing.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={demoClosing.primary.href}
              className="bg-background text-foreground hover:bg-background/90"
            >
              {demoClosing.primary.label}
            </ButtonLink>
            <ButtonLink
              href={demoClosing.secondary.href}
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 dark:text-foreground dark:hover:bg-foreground/10"
            >
              {demoClosing.secondary.label}
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-lg border border-primary-foreground/15 bg-background/5 p-5 dark:border-border">
            <p className="text-xs font-medium text-primary-foreground/60 dark:text-foreground/60">
              Modules in this demo
            </p>
            <div className="mt-4 space-y-2">
              {[
                ["Scheduling", "shifts, cover, swaps"],
                ["Invoicing", "reminders that stop on payment"],
                ["Client portal", "weekly board, approvals"],
                ["AI briefing", "one summary, every morning"],
              ].map(([name, detail]) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between gap-4 border-b border-primary-foreground/10 pb-2 text-sm last:border-0 last:pb-0 dark:border-border"
                >
                  <span className="font-medium">{name}</span>
                  <span className="text-right text-xs text-primary-foreground/60 dark:text-foreground/60">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 overflow-hidden border-y border-primary-foreground/15 py-4 dark:border-border">
        <div className="flex w-max gap-2 motion-safe:animate-[marquee-x_32s_linear_infinite]">
          {chips.map((chip, index) => (
            <span
              key={`${chip}-${index}`}
              className="rounded-full border border-primary-foreground/20 px-3 py-1 font-mono text-[11px] whitespace-nowrap text-primary-foreground/80 dark:border-border dark:text-foreground/80"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
