"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, KeyRound, Mail } from "lucide-react";
import { toast } from "sonner";
import { VerifyCode } from "@/components/kit/watermelon/verify-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

type Step = "email" | "code" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestCode(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    setBusy(true);
    const result = await authClient.emailOtp.requestPasswordReset({ email });
    setBusy(false);
    if (result.error) {
      toast.error(result.error.message ?? "Could not send the code");
      return;
    }
    setStep("code");
    toast.success("Code sent", { description: `Check ${email}.` });
  }

  async function resetPassword(event: React.FormEvent) {
    event.preventDefault();
    if (otp.length < 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    if (password.length < 8) {
      toast.error("Use at least 8 characters");
      return;
    }
    setBusy(true);
    const result = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
    });
    setBusy(false);
    if (result.error) {
      toast.error(result.error.message ?? "Could not reset the password");
      return;
    }
    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Password updated</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your new password.
          </p>
        </div>
        <Button asChild className="h-12 w-full">
          <Link href="/login">Go to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          {step === "email"
            ? "We send a 6-digit code to your email."
            : `Enter the code sent to ${email} and a new password.`}
        </p>
      </div>

      {step === "email" ? (
        <form onSubmit={requestCode} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="reset-email" className="text-sm font-medium">
              Email address
            </Label>
            <div className="relative">
              <Mail
                className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="reset-email"
                type="email"
                placeholder="you@company.com"
                className="h-11 pl-10"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="h-12 w-full gap-2" disabled={busy}>
            Send the code
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="space-y-6">
          <VerifyCode value={otp} onChange={setOtp} />
          <div className="space-y-1.5">
            <Label htmlFor="reset-password" className="text-sm font-medium">
              New password
            </Label>
            <div className="relative">
              <KeyRound
                className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="reset-password"
                type="password"
                placeholder="••••••••"
                className="h-11 pl-10"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="h-12 w-full" disabled={busy}>
            Set the new password
          </Button>
        </form>
      )}

      <Button
        type="button"
        variant="ghost"
        className="h-12 w-full gap-2 text-muted-foreground"
        onClick={() => setStep("email")}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to sign in
      </Button>
    </div>
  );
}
