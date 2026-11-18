"use client";

import { useState, type ReactNode } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

/**
 * A centred, scrollable dialog with a soft dark overlay. The trigger opens it;
 * children can be a render function that receives close(), so a form can
 * dismiss itself on success.
 */
export function Dialog({
  trigger,
  title,
  description,
  icon,
  children,
  size = "lg",
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  size?: keyof typeof SIZES;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-70 bg-black/30 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 dark:bg-black/45 motion-reduce:animate-none" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-70 flex max-h-[92svh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-border bg-card text-foreground shadow-md focus:outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200 ease-out motion-reduce:animate-none",
            SIZES[size],
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-primary/[0.07] to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />

          <div className="relative flex items-start gap-3 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
            {icon ? (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
                {icon}
              </span>
            ) : null}
            <div className="min-w-0 flex-1">
              <DialogPrimitive.Title className="font-heading text-lg font-semibold tracking-tight text-balance sm:text-xl">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close
              aria-label="Close dialog"
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <X className="size-3.5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          <div className="relative min-h-0 flex-1 overflow-y-auto bg-background/30 p-4 [scrollbar-width:thin] sm:p-6">
            {typeof children === "function" ? children(close) : children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
