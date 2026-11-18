import { BarChart3, LayoutDashboard, Smartphone, Sparkles } from "lucide-react";
import { industryFoundation } from "@/content/industries";
import { Section } from "@/components/shared/Section";

const ICONS = {
  portal: LayoutDashboard,
  phone: Smartphone,
  numbers: BarChart3,
  ai: Sparkles,
} as const;

/** Four parts every industry build shares, as a ruled grid. */
export function FoundationSection() {
  return (
    <Section>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {industryFoundation.title}
          </h2>
        </div>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg lg:col-span-5">
          {industryFoundation.intro}
        </p>
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {industryFoundation.items.map((item, index) => {
          const Icon = ICONS[item.id as keyof typeof ICONS];
          return (
            <div key={item.id} className="flex flex-col bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
