import { Check } from "lucide-react";
import { reassurance } from "@/content/start";

/** Thin reassurance strip: static on desktop, a quiet marquee on phones. */
export function ReassuranceStrip() {
  return (
    <section className="border-y border-border bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="hidden flex-wrap items-center justify-center gap-x-8 gap-y-2 py-5 sm:flex">
          {reassurance.map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 text-xs text-primary-foreground/70 dark:text-foreground/70"
            >
              <Check className="size-3.5 text-highlight" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className="overflow-hidden py-4 sm:hidden" aria-hidden="true">
          <div className="flex w-max gap-8 motion-safe:animate-[marquee-x_18s_linear_infinite]">
            {[...reassurance, ...reassurance].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="flex items-center gap-1.5 text-xs whitespace-nowrap text-primary-foreground/70 dark:text-foreground/70"
              >
                <Check className="size-3.5 text-highlight" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
