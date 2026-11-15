"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { VerifyCode } from "@/components/kit/watermelon/verify-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [code, setCode] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const { errors } = form.formState;

  function onSubmit(values: FormValues) {
    setStep("code");
    toast.success("Code sent", {
      description: `Check ${values.email} for the 6-digit code.`,
    });
  }

  function verifyCode() {
    toast.success("Code verified", {
      description: "You can now set a new password.",
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {step === "email" ? "Reset your password" : "Check your email"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {step === "email"
            ? "Enter your email and we'll send a 6-digit code."
            : "Enter the code below to continue."}
        </p>
      </div>

      {step === "email" ? (
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

          <Button type="submit" className="h-12 w-full gap-2">
            Send reset code
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          <VerifyCode value={code} onChange={setCode} />

          <Button
            type="button"
            className="h-12 w-full gap-2"
            disabled={code.length < 6}
            onClick={verifyCode}
          >
            Verify code
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-12 w-full gap-2 text-muted-foreground"
            onClick={() => {
              setCode("");
              setStep("email");
            }}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Use a different email
          </Button>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
