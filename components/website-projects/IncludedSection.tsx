import {
  BarChart3,
  Gauge,
  LayoutDashboard,
  MousePointerClick,
  PencilLine,
  Search,
} from "lucide-react";
import { webIncluded } from "@/content/website-projects";
import { Section } from "@/components/shared/Section";

const ICONS = {
  convert: MousePointerClick,
  fast: Gauge,
  found: Search,
  edit: PencilLine,
  tracking: BarChart3,
  ready: LayoutDashboard,
} as const;

/** What a website project includes, as a six-item icon grid. */
export function IncludedSection() {
  return (
    <Section>
      <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
        {webIncluded.title}
      </h2>

      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {webIncluded.items.map((item) => {
          const Icon = ICONS[item.id as keyof typeof ICONS];
          return (
            <div key={item.id} className="bg-card p-6">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
