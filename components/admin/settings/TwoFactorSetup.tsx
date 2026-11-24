"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { authClient } from "@/lib/auth-client";

/** Staff two-factor setup: TOTP secret, backup codes, enable or disable. */
export function TwoFactorSetup() {
  const router = useRouter();
  const { data } = authClient.useSession();
  const user = data?.user as { twoFactorEnabled?: boolean } | undefined;
  const enabled = Boolean(user?.twoFactorEnabled);

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [totpURI, setTotpURI] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const secret = totpURI
    ? (new URL(totpURI).searchParams.get("secret") ?? "")
    : "";

  function reset() {
    setPassword("");
    setTotpURI(null);
    setBackupCodes([]);
    setCode("");
  }

  async function start() {
    setBusy(true);
    const result = await authClient.twoFactor.enable({ password });
    setBusy(false);
    if (result.error) {
      toast.error(result.error.message ?? "Could not start two-factor setup");
      return;
    }
    const payload = result.data;
    if (!payload || payload.method !== "totp") {
      toast.error("This account does not support authenticator codes.");
      return;
    }
    setTotpURI(payload.totpURI);
    setBackupCodes(payload.backupCodes);
  }

  async function confirm() {
    setBusy(true);
    const result = await authClient.twoFactor.verifyTotp({ code });
    setBusy(false);
    if (result.error) {
      toast.error(result.error.message ?? "That code is not valid");
      return;
    }
    toast.success("Two-factor authentication is on");
    setOpen(false);
    reset();
    router.refresh();
  }

  async function disable() {
    setBusy(true);
    const result = await authClient.twoFactor.disable({ password });
    setBusy(false);
    if (result.error) {
      toast.error(result.error.message ?? "Could not turn two-factor off");
      return;
    }
    toast.success("Two-factor authentication is off");
    setOpen(false);
    reset();
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ShieldCheck className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium">Two-factor authentication</p>
          <p className="text-xs text-muted-foreground">
            Ask for a code from your authenticator app at sign-in.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge tone={enabled ? "success" : "neutral"}>
          {enabled ? "On" : "Off"}
        </StatusBadge>
        <AppDialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) reset();
          }}
          trigger={
            <Button variant="outline" size="sm">
              {enabled ? "Manage" : "Set up"}
            </Button>
          }
          size="md"
        >
          <AppDialog.Header
            icon={ShieldCheck}
            title={enabled ? "Two-factor authentication" : "Set up two-factor"}
            subtitle={
              enabled
                ? "Turn it off with your password."
                : "Add the secret to your authenticator app, then confirm one code."
            }
          />
          <AppDialog.Body>
            <div className="flex flex-col gap-[18px]">
              <FormField
                id="two-factor-password"
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={Boolean(totpURI) || busy}
              />

              {!enabled && !totpURI ? (
                <Button onClick={() => void start()} disabled={!password || busy}>
                  {busy ? "Checking…" : "Continue"}
                </Button>
              ) : null}

              {!enabled && totpURI ? (
                <>
                  <div className="rounded-[var(--radius-dialog-preview)] border border-border bg-card p-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Secret key
                    </p>
                    <p className="mt-1 font-mono text-sm break-all">{secret}</p>
                  </div>
                  {backupCodes.length > 0 ? (
                    <div className="rounded-[var(--radius-dialog-preview)] border border-border bg-secondary/40 p-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Backup codes
                      </p>
                      <div className="mt-1 grid grid-cols-2 gap-1 font-mono text-xs">
                        {backupCodes.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <FormField
                    id="two-factor-code"
                    label="Code from your app"
                    inputMode="numeric"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    disabled={busy}
                  />
                  <Button
                    onClick={() => void confirm()}
                    disabled={code.length < 6 || busy}
                  >
                    {busy ? "Saving…" : "Turn on two-factor"}
                  </Button>
                </>
              ) : null}

              {enabled ? (
                <Button
                  variant="outline"
                  onClick={() => void disable()}
                  disabled={!password || busy}
                >
                  {busy ? "Saving…" : "Turn off two-factor"}
                </Button>
              ) : null}
            </div>
          </AppDialog.Body>
        </AppDialog>
      </div>
    </div>
  );
}
