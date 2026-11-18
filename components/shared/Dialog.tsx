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
 * A framed dialog: a 10px light border around a dark, textured title band and
 * a scrollable body. The backdrop is the brand green at 70% with a blur.
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
        <DialogPrimitive.Overlay className="fixed inset-0 z-70 bg-sb-bg/70 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-70 flex max-h-[92svh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border-[10px] border-border bg-background text-foreground shadow-md focus:outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200 ease-out motion-reduce:animate-none",
            SIZES[size],
          )}
        >
          <div className="relative shrink-0 overflow-hidden bg-primary px-5 py-5 text-primary-foreground sm:px-6 sm:py-6 dark:bg-secondary dark:text-foreground">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 text-primary-foreground/20 dot-grid opacity-20 dark:text-foreground/20"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 right-0 size-52 rounded-full bg-highlight/25 blur-3xl"
            />

            <div className="relative flex items-start gap-4">
              {icon ? (
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-highlight/30 bg-highlight/10 text-highlight">
                  {icon}
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <DialogPrimitive.Title className="font-heading text-lg font-semibold tracking-tight text-balance text-primary-foreground sm:text-xl dark:text-foreground">
                  {title}
                </DialogPrimitive.Title>
                {description ? (
                  <DialogPrimitive.Description className="mt-1 max-w-xl text-sm leading-relaxed text-primary-foreground/70 dark:text-foreground/70">
                    {description}
                  </DialogPrimitive.Description>
                ) : null}
              </div>
              <DialogPrimitive.Close
                aria-label="Close dialog"
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight dark:border-border dark:text-foreground dark:hover:bg-foreground/10"
              >
                <X className="size-3.5" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>

            <span
              aria-hidden="true"
              className="relative mt-4 block h-px bg-gradient-to-r from-highlight/70 via-highlight/25 to-transparent"
            />
          </div>

          <div className="relative min-h-0 flex-1 overflow-y-auto bg-background p-4 [scrollbar-width:thin] sm:p-6">
            {typeof children === "function" ? children(close) : children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
