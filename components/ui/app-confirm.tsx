"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { AppDialog } from "@/components/ui/app-dialog";
import { ConfirmContext, type ConfirmOptions } from "@/hooks/use-confirm";

type ConfirmState = {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
};

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);
  const stateRef = useRef<ConfirmState | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const confirm = useCallback((options: ConfirmOptions) => {
    if (stateRef.current) {
      stateRef.current.resolve(false);
    }
    return new Promise<boolean>((resolve) => {
      setState({ options, resolve });
    });
  }, []);

  function settle(value: boolean) {
    stateRef.current?.resolve(value);
    setState(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AppDialog
        open={Boolean(state)}
        onOpenChange={(open) => {
          if (!open) settle(false);
        }}
        size="sm"
        initialFocus="primary"
      >
        {state ? (
          <>
            <AppDialog.Header
              icon={state.options.icon ?? AlertTriangle}
              title={state.options.title}
              subtitle={state.options.subtitle}
              tone={state.options.tone === "danger" ? "danger" : "default"}
            />
            <AppDialog.Footer
              secondary={{
                label: state.options.cancelLabel ?? "Cancel",
                onClick: () => settle(false),
              }}
              primary={{
                label: state.options.confirmLabel ?? "Confirm",
                onClick: () => settle(true),
                variant:
                  state.options.tone === "danger" ? "destructive" : "default",
              }}
            />
          </>
        ) : null}
      </AppDialog>
    </ConfirmContext.Provider>
  );
}
