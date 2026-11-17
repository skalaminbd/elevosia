import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The shared section wrapper: identical top and bottom padding to the homepage.
 */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative py-15 md:py-20 lg:py-25", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
