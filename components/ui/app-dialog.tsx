"use client";

/**
 * Elevosia dialog system.
 *
 * Role map (no new colour tokens; all resolve to app tokens):
 * overlay          -> --sb-bg at 55% + blur
 * dialog-bg        -> --card
 * dialog-chrome    -> --dialog-chrome (#F6F4EE light, muted in dark)
 * dialog-divider   -> --border
 * input-border     -> --input
 * text             -> --foreground
 * text-label       -> --foreground
 * text-muted       -> --muted-foreground
 * primary          -> --primary / --primary-foreground
 * icon-tile-bg/fg  -> --dialog-icon (#E4EFCB light) / --primary
 * avatar-bg/fg     -> --highlight / --highlight-foreground
 * success          -> --success-strong (on muted chrome)
 * danger/soft      -> --destructive / --destructive at 10%
 * focus-ring       -> --ring
 *
 * Radii/shadows are dialog-scoped tokens: --radius-dialog (20px),
 * --radius-dialog-control (12px), --radius-dialog-preview (14px),
 * --shadow-dialog. Everything uses font-sans.
 */

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  AlertTriangle,
  Check,
  Loader2,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[480px]",
  lg: "sm:max-w-[640px]",
} as const;

type DialogContextValue = {
  requestClose: () => void;
  isMobile: boolean;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("AppDialog parts must be used inside AppDialog");
  }
  return context;
}

export function AppDialog({
  open: controlledOpen,
  onOpenChange,
  trigger,
  size = "md",
  dirty = false,
  initialFocus = "first",
  className,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  size?: keyof typeof SIZES;
  dirty?: boolean;
  initialFocus?: "first" | "primary";
  className?: string;
  children: ReactNode;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const isMobile = useMediaQuery("(max-width: 639px)");
  const confirm = useConfirm();
  const contentRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const requestClose = useCallback(() => {
    if (dirty) {
      void confirm({
        icon: AlertTriangle,
        title: "Discard changes?",
        subtitle: "Your edits will be lost if you close this dialog.",
        confirmLabel: "Discard",
        tone: "danger",
      }).then((ok) => {
        if (ok) setOpen(false);
      });
      return;
    }
    setOpen(false);
  }, [confirm, dirty, setOpen]);

  function handleOpenChange(next: boolean) {
    if (next) {
      setOpen(true);
      return;
    }
    requestClose();
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      ) : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-70 bg-sb-bg/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-150 motion-reduce:animate-none" />
        <DialogPrimitive.Content
          ref={contentRef}
          style={
            isMobile && dragY > 0
              ? { transform: `translateY(${dragY}px)` }
              : undefined
          }
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            const root = contentRef.current;
            const target =
              initialFocus === "primary"
                ? root?.querySelector<HTMLElement>(
                    "[data-dialog-primary]",
                  )
                : root?.querySelector<HTMLElement>(
                    "input:not([type='hidden']), select, textarea, [data-dialog-primary]",
                  );
            (target ?? root)?.focus();
          }}
          className={cn(
            "fixed z-70 flex flex-col overflow-hidden border border-border bg-card text-card-foreground shadow-[var(--shadow-dialog)] focus:outline-none",
            "inset-x-0 bottom-0 top-auto max-h-[90svh] w-full rounded-t-[var(--radius-dialog)] border-x-0 border-b-0",
            "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[calc(100svh-3rem)] sm:w-[calc(100%-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[var(--radius-dialog)] sm:border",
            SIZES[size],
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-200 data-[state=open]:ease-[cubic-bezier(0.22,1,0.36,1)]",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-150",
            "max-sm:data-[state=open]:slide-in-from-bottom-8 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-bottom-2",
            "motion-reduce:animate-none",
            className,
          )}
        >
          <DialogContext.Provider
            value={{ requestClose, isMobile }}
          >
            <div
              aria-hidden="true"
              className="flex shrink-0 cursor-grab touch-none justify-center bg-dialog-chrome pt-2 pb-1 active:cursor-grabbing sm:hidden"
              onTouchStart={(event) => {
                dragStart.current = event.touches[0]?.clientY ?? null;
              }}
              onTouchMove={(event) => {
                if (dragStart.current === null) return;
                const delta =
                  (event.touches[0]?.clientY ?? dragStart.current) -
                  dragStart.current;
                if (delta > 0) setDragY(delta);
              }}
              onTouchEnd={() => {
                if (dragY > 80) {
                  setDragY(0);
                  requestClose();
                } else {
                  setDragY(0);
                }
                dragStart.current = null;
              }}
            >
              <span className="h-1 w-10 rounded-full bg-input" />
            </div>
            {children}
          </DialogContext.Provider>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

AppDialog.Header = function AppDialogHeader({
  icon: Icon,
  title,
  subtitle,
  tone = "default",
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  tone?: "default" | "danger";
}) {
  const { requestClose } = useDialogContext();
  return (
    <div className="flex shrink-0 items-center gap-3.5 border-b border-border bg-dialog-chrome py-4 pr-5 pl-5 sm:py-5 sm:pr-6 sm:pl-6">
      {Icon ? (
        <span
          aria-hidden="true"
          className={
            tone === "danger"
              ? "flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-dialog-control)] bg-destructive/10 text-destructive"
              : "flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-dialog-control)] bg-dialog-icon text-primary"
          }
        >
          <Icon className="size-5" strokeWidth={1.9} />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <DialogPrimitive.Title className="font-sans text-lg leading-6 font-semibold tracking-[-0.01em] text-foreground">
          {title}
        </DialogPrimitive.Title>
        {subtitle ? (
          <DialogPrimitive.Description className="mt-0.5 text-sm text-muted-foreground">
            {subtitle}
          </DialogPrimitive.Description>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={requestClose}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-input bg-card text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/10 focus-visible:outline-none"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
};

AppDialog.Body = function AppDialogBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto bg-card px-5 py-5 sm:px-7 sm:py-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

type FooterAction = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  form?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "outline" | "destructive";
};

AppDialog.Footer = function AppDialogFooter({
  status,
  secondary,
  primary,
}: {
  status?: "saved" | "dirty" | ReactNode;
  secondary?: FooterAction;
  primary?: FooterAction;
}) {
  const { requestClose, isMobile } = useDialogContext();

  return (
    <div className="flex shrink-0 flex-col gap-3 border-t border-border bg-dialog-chrome px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+16px)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
      {status ? (
        <div className="text-[13px] font-medium">
          {status === "saved" ? (
            <span className="inline-flex items-center gap-1.5 text-success-strong">
              <Check className="size-4" aria-hidden="true" />
              Saved
            </span>
          ) : status === "dirty" ? (
            <span className="text-muted-foreground">Unsaved changes</span>
          ) : (
            status
          )}
        </div>
      ) : null}
      <div className="flex items-center gap-2.5 max-sm:w-full sm:ml-auto">
        {secondary ? (
          <Button
            type={secondary.type ?? "button"}
            variant="outline"
            size="dialog"
            form={secondary.form}
            onClick={secondary.onClick ?? requestClose}
            disabled={secondary.disabled}
            className={cn(isMobile && "flex-1", "bg-card font-semibold")}
          >
            {secondary.label}
          </Button>
        ) : null}
        {primary ? (
          <Button
            type={primary.type ?? "button"}
            variant={primary.variant ?? "default"}
            size="dialog"
            form={primary.form}
            onClick={primary.onClick}
            disabled={primary.disabled || primary.loading}
            className={cn(isMobile && "flex-1", "font-semibold", "disabled:opacity-45")}
            aria-busy={primary.loading || undefined}
            data-dialog-primary="true"
          >
            {primary.loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {primary.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

AppDialog.PreviewCard = function AppDialogPreviewCard({
  initials,
  photo,
  title,
  subtitle,
  action,
}: {
  initials: string;
  photo?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-dialog-preview)] border border-border bg-card p-4">
      <span className="relative flex size-[60px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-highlight text-xl font-bold text-highlight-foreground">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="size-full object-cover" />
        ) : (
          initials
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold">{title}</p>
        {subtitle ? (
          <p className="truncate text-[13px] text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
};

export { AlertTriangle as AppDialogAlertIcon };
