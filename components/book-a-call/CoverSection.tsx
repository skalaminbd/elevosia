import { cover } from "@/content/book-a-call";
import { Section } from "@/components/shared/Section";

/** Dark band: what actually happens in the half hour. */
export function CoverSection() {
  return (
    <Section className="bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="text-xs font-medium text-highlight">{cover.eyebrow}</p>
          <h2 className="mt-3 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {cover.title}
          </h2>
          <p className="mt-4 max-w-sm text-base text-primary-foreground/80 dark:text-foreground/80">
            {cover.intro}
          </p>
        </div>

        <div className="lg:col-span-8">
          <ol className="grid gap-6 sm:grid-cols-3">
            {cover.steps.map((step, index) => (
              <li
                key={step.id}
                className="border-t border-primary-foreground/20 pt-4 dark:border-border"
              >
                <span className="font-mono text-xs text-highlight">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-primary-foreground/70 dark:text-foreground/70">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
