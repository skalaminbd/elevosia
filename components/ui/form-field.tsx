"use client";

import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { cn } from "@/lib/utils";

const CONTROL =
  "h-11.5 w-full rounded-[var(--radius-dialog-control)] border border-input bg-card px-3.5 text-base text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/10 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive sm:text-[15px]";

function FieldShell({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-[13px] font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function FormField({
  id,
  label,
  hint,
  error,
  icon: Icon,
  className,
  inputClassName,
  ...props
}: ComponentProps<typeof Input> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  icon?: LucideIcon;
  inputClassName?: string;
}) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      className={className}
    >
      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}
        <Input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={cn(CONTROL, Icon && "pl-10", inputClassName)}
          {...props}
        />
      </div>
    </FieldShell>
  );
}

export function FormSelect({
  id,
  label,
  hint,
  error,
  className,
  selectClassName,
  children,
  ...props
}: ComponentProps<typeof NativeSelect> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  selectClassName?: string;
}) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      className={className}
    >
      <NativeSelect
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cn(CONTROL, selectClassName)}
        {...props}
      >
        {children}
      </NativeSelect>
    </FieldShell>
  );
}

export function FormTextarea({
  id,
  label,
  hint,
  error,
  className,
  ...props
}: ComponentProps<"textarea"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      className={className}
    >
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cn(CONTROL, "min-h-24 resize-none px-3.5 py-3", className)}
        {...props}
      />
    </FieldShell>
  );
}
