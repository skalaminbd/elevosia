"use client";

import Link from "next/link";
import {
  FileEdit,
  FolderKanban,
  LifeBuoy,
  Receipt,
  SquareCheck,
  ArrowUpRight,
} from "lucide-react";
import type { TicketLinkedItem } from "@/lib/tickets/types";

const ICONS = {
  invoice: Receipt,
  task: SquareCheck,
  change: FileEdit,
  project: FolderKanban,
  ticket: LifeBuoy,
} satisfies Record<TicketLinkedItem["type"], typeof Receipt>;

/** Linked invoice, dev task, change request, project or related ticket. */
export function LinkedItemCard({ item }: { item: TicketLinkedItem }) {
  const Icon = ICONS[item.type];
  const content = (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2 transition-colors hover:border-primary/30">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium">{item.label}</p>
        {item.meta ? (
          <p className="truncate text-[10px] text-muted-foreground">
            {item.meta}
          </p>
        ) : null}
      </div>
      {item.href ? (
        <ArrowUpRight
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );

  if (!item.href) return content;

  return (
    <Link
      href={item.href}
      className="block focus-visible:outline-none"
      aria-label={`Open ${item.label}`}
    >
      {content}
    </Link>
  );
}
