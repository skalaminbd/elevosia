"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { VerifyCode } from "@/components/kit/watermelon/verify-code";
import { SocialAuthButtons } from "@/components/shared/SocialAuthButtons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean(),
});

type FormValues = z.infer<typeof schema>;
type Mode = "password" | "verify-email" | "otp-signin";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [pendingEmail, setPendingEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [cachedPassword, setCachedPassword] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: FormValues) {
    const result = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.remember,
    });

    if (result.error) {
      if (result.error.status === 403) {
        setPendingEmail(values.email);
        setCachedPassword(values.password);
        setCode("");
        setMode("verify-email");
        await authClient.emailOtp.sendVerificationOtp({
          email: values.email,
          type: "email-verification",
        });
        toast.info("Verify your email", {
          description: `We sent a code to ${values.email}.`,
        });
        return;
      }
      toast.error(result.error.message ?? "Could not sign in");
      return;
    }

    toast.success("Signed in");
    router.push("/auth/redirect");
  }

  async function verifyPasswordEmail(otp: string) {
    if (busy) return;
    setBusy(true);
    const verified = await authClient.emailOtp.verifyEmail({
      email: pendingEmail,
      otp,
    });
    if (verified.error) {
      setBusy(false);
      toast.error(verified.error.message ?? "That code is not valid");
      return;
    }
    if (cachedPassword) {
      await authClient.signIn.email({
        email: pendingEmail,
        password: cachedPassword,
        rememberMe: true,
      });
    }
    setBusy(false);
    toast.success("Email verified");
    router.push("/auth/redirect");
  }

  async function startOtpSignIn() {
    const email = form.getValues("email");
    if (!email.includes("@")) {
      toast.error("Enter your email first");
      return;
    }
    const result = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });
    if (result.error) {
      toast.error(result.error.message ?? "Could not send the code");
      return;
    }
    setPendingEmail(email);
    setCode("");
    setMode("otp-signin");
    toast.success("Code sent", { description: `Check ${email}.` });
  }

  async function verifyOtpSignIn(otp: string) {
    if (busy) return;
    setBusy(true);
    const result = await authClient.signIn.emailOtp({
      email: pendingEmail,
      otp,
    });
    setBusy(false);
    if (result.error) {
      toast.error(result.error.message ?? "That code is not valid");
      return;
    }
    toast.success("Signed in");
    router.push("/auth/redirect");
  }

  function startWithProvider(provider: "Google" | "OTP") {
    if (provider === "Google") {
      void authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/redirect",
      });
      return;
    }
    void startOtpSignIn();
  }

  if (mode !== "password") {
    return (
      <div className="space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "verify-email" ? "Verify your email" : "Check your email"}
          </h1>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to {pendingEmail}.
          </p>
        </div>

        <VerifyCode
          value={code}
          onChange={setCode}
          onComplete={(otp) => {
            if (mode === "verify-email") void verifyPasswordEmail(otp);
            else void verifyOtpSignIn(otp);
          }}
        />

        <Button
          type="button"
          variant="ghost"
          className="h-12 w-full"
          onClick={() => {
            setCode("");
            setMode("password");
          }}
        >
          Use a different method
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to your workspace.
        </p>
      </div>

      <SocialAuthButtons onProvider={startWithProvider} />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="shrink-0 text-xs text-muted-foreground">
          or continue with email
        </span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <div className="relative">
            <Mail
              className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              className="h-11 pl-10"
              aria-invalid={Boolean(errors.email)}
              {...form.register("email")}
            />
          </div>
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock
              className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-11 pl-10"
              aria-invalid={Boolean(errors.password)}
              {...form.register("password")}
            />
          </div>
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            defaultChecked
            onCheckedChange={(checked) =>
              form.setValue("remember", checked === true)
            }
          />
          <Label
            htmlFor="remember"
            className="cursor-pointer text-sm text-muted-foreground"
          >
            Keep me signed in
          </Label>
        </div>

        <Button type="submit" className="h-12 w-full gap-2" disabled={isSubmitting}>
          Sign in
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create one for free
        </Link>
      </p>
    </div>
  );
}
