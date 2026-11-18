"use client";

import { board } from "@/content/about";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Section } from "@/components/shared/Section";
import { useInViewLoop } from "@/hooks/use-in-view-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * The week board: the studio's own dashboard, running on a slightly darker
 * surface than the page. One status dot flips and the week's bar fills.
 */
export function BoardSection() {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewLoop<HTMLDivElement>({ threshold: 0.2 });
  const alive = inView && !reduceMotion;

  return (
    <Section id="board">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Eyebrow>{board.eyebrow}</Eyebrow>
          <h2 className="mt-5 font-heading text-[2.125rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem]">
            {board.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">{board.body}</p>
        </div>

        <div ref={ref} className="lg:col-span-8">
          <div className="overflow-hidden rounded-lg border border-border bg-primary/10 shadow-md dark:bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <p className="text-sm font-semibold text-foreground">Your board</p>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-xs text-muted-foreground">
                  {board.week}
                </span>
                <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-success"
                  />
                  Live
                </span>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-3">
              {board.columns.map((column) => (
                <div
                  key={column.id}
                  className="rounded-md bg-background/70 p-3 dark:bg-background/40"
                >
                  <p className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    {column.label}
                    <span className="font-mono">{column.tasks.length}</span>
                  </p>

                  <ul className="mt-3 flex flex-col gap-2">
                    {column.tasks.map((task) => {
                      const isTesting =
                        column.id === "progress" && task.id === "invoices";

                      return (
                        <li
                          key={task.id}
                          className="rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground"
                        >
                          <span className="flex items-start gap-2">
                            <span
                              aria-hidden="true"
                              className={cn(
                                "mt-1 size-1.5 shrink-0 rounded-full",
                                column.id === "done"
                                  ? "bg-success"
                                  : "bg-muted-foreground/40",
                              )}
                            />
                            <span className="leading-snug">{task.text}</span>
                          </span>

                          {isTesting ? (
                            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "size-1.5 rounded-full",
                                  alive
                                    ? "animate-[who-status-dot_4500ms_ease-in-out_infinite]"
                                    : "bg-success",
                                )}
                              />
                              In review
                            </span>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
              <p className="text-xs text-muted-foreground">{board.update}</p>
              <span className="h-1 w-32 overflow-hidden rounded-full bg-muted">
                <span
                  className={cn(
                    "block h-full origin-left rounded-full bg-primary",
                    alive && "animate-[who-grow-x_4500ms_ease-out_infinite]",
                  )}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
