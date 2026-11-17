"use client";

import type { ReactNode } from "react";
import { MagicCard } from "@/components/ui/magic-card";
import { cn } from "@/lib/utils";

/**
 * Bento cell for the AI section. The Magic Card spotlight follows the cursor;
 * touch devices simply never see it, and the demo inside still runs.
 */
export function DemoCard({
  title,
  caption,
  className,
  children,
}: {
  title: string;
  caption: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <MagicCard className={cn("h-full rounded-lg", className)}>
      <div className="flex h-full flex-col p-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{caption}</p>
        <div className="mt-6 flex-1 rounded-lg border border-border/60 bg-background p-4">
          {children}
        </div>
      </div>
    </MagicCard>
  );
}
