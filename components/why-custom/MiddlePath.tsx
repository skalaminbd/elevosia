import { ArrowRight } from "lucide-react";
import { middlePath } from "@/content/why-custom";
import { Section } from "@/components/shared/Section";

/** Keep, replace, add: the middle path, as three columns of chips. */
export function MiddlePath() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {middlePath.title}
          </h2>
        </div>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg lg:col-span-5">
          {middlePath.body}
        </p>
      </div>

      <div className="mt-10 grid gap-4 rounded-lg border border-border bg-card p-6 sm:grid-cols-3 sm:gap-0 sm:p-0">
        {middlePath.columns.map((column, index) => (
          <div
            key={column.id}
            className="relative flex flex-col gap-3 sm:p-6"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-semibold">{column.label}</h3>
            </div>

            <ul className="flex flex-wrap gap-2">
              {column.items.map((item) => (
                <li
                  key={item}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    column.id === "replace"
                      ? "bg-primary/10 text-primary"
                      : column.id === "keep"
                        ? "bg-secondary text-muted-foreground"
                        : "bg-success/10 text-success"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>

            {index < middlePath.columns.length - 1 ? (
              <ArrowRight
                className="absolute top-1/2 -right-2 hidden size-4 -translate-y-1/2 text-muted-foreground sm:block"
                aria-hidden="true"
              />
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  );
}
