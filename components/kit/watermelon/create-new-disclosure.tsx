// Source: https://registry.watermelon.sh/r/create-new-disclosure.json (adapted to Elevosia tokens)
"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Plus, X, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type CreateNewDisclosureItemProps = {
  icon: LucideIcon;
  label: string;
} & Omit<ComponentProps<"button">, "children">;

/** Grid tile. Wrap it in a dialog trigger to give the item its action. */
export function CreateNewDisclosureItem({
  icon: Icon,
  label,
  className,
  ...props
}: CreateNewDisclosureItemProps) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-3 text-foreground transition-colors hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <Icon
        className="size-5 text-muted-foreground transition-colors group-hover:text-foreground"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export function CreateNewDisclosure({
  items,
  initialOpen = false,
  className,
}: {
  items: ReactNode[];
  initialOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        // The create dialogs live inside this popover, so closing it while one
        // is open would unmount the dialog. Wait until the dialog is gone.
        if (!next && document.querySelector('[role="dialog"]')) return;
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Plus className="size-4" aria-hidden="true" />
          Create new
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        collisionPadding={16}
        className={cn("w-[calc(100vw-2rem)] p-1 sm:w-72", className)}
      >
        <div className="flex items-center justify-between gap-2 py-0.5 pr-0.5 pl-2.5">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            Create new
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close create menu"
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-input bg-card text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/10 focus-visible:outline-none"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-1 grid grid-cols-3 gap-1 border-t border-border pt-1">
          {items}
        </div>
      </PopoverContent>
    </Popover>
  );
}
