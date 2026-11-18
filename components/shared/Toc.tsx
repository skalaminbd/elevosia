"use client";

import { useEffect, useRef, useState } from "react";

/** Sticky table of contents with a bar that slides to the visible section. */
export function Toc({
  sections,
}: {
  sections: { id: string; title: string }[];
}) {
  const [active, setActive] = useState(0);
  const [bar, setBar] = useState({ top: 0, height: 0 });
  const listRef = useRef<HTMLOListElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = headings.indexOf(entry.target as HTMLElement);
            if (index >= 0) setActive(index);
          }
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const link = linksRef.current[active];
    if (link) setBar({ top: link.offsetTop, height: link.offsetHeight });
  }, [active]);

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-24">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        On this page
      </p>
      <ol ref={listRef} className="relative mt-3 space-y-1 border-l border-border">
        <span
          aria-hidden="true"
          className="absolute -left-px w-0.5 rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ top: bar.top, height: bar.height }}
        />
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              ref={(node) => {
                linksRef.current[index] = node;
              }}
              href={`#${section.id}`}
              aria-current={index === active ? "true" : undefined}
              className={`block py-1.5 pl-4 text-sm transition-colors ${
                index === active
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
