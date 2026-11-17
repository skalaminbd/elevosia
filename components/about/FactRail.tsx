import { facts } from "@/content/about";
import { Section } from "@/components/shared/Section";

/**
 * The fact rail directly under the hero: four plain claims, no cards.
 */
export function FactRail() {
  return (
    <Section className="border-y border-border py-10 md:py-12 lg:py-14">
      <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {facts.map((fact) => (
          <div key={fact.title}>
            <dt className="font-heading text-base font-semibold text-foreground">
              {fact.title}
            </dt>
            <dd className="mt-1.5 max-w-xs text-sm text-muted-foreground">
              {fact.body}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
