"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
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

const accountSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.boolean().refine((value) => value, "You must accept the terms"),
});

const businessSchema = z.object({
  businessName: z.string().min(2, "Enter your business name"),
  phone: z.string().min(7, "Enter a valid phone number"),
  address: z.string().min(5, "Enter your business address"),
});

type AccountValues = z.infer<typeof accountSchema>;
type BusinessValues = z.infer<typeof businessSchema>;

type Step = "account" | "verify" | "business";

export default function SignUpPage() {
  const [step, setStep] = useState<Step>("account");
  const [pendingEmail, setPendingEmail] = useState("");
  const [code, setCode] = useState("");

  const accountForm = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: "", email: "", password: "", terms: false },
  });

  const businessForm = useForm<BusinessValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: { businessName: "", phone: "", address: "" },
  });

  const accountErrors = accountForm.formState.errors;
  const businessErrors = businessForm.formState.errors;

  function onAccountSubmit(values: AccountValues) {
    setPendingEmail(values.email);
    setCode("");
    setStep("verify");
    toast.success("Code sent", {
      description: `Check ${values.email} for the 6-digit code.`,
    });
  }

  function onCodeComplete() {
    toast.success("Email verified");
    setStep("business");
  }

  function startWithProvider(provider: "Google" | "OTP") {
    toast.success(`Continuing with ${provider}`, {
      description: "Add your business details to finish setup.",
    });
    setStep("business");
  }

  function onBusinessSubmit(values: BusinessValues) {
    toast.success("Workspace ready", {
      description: `${values.businessName} is all set up.`,
    });
  }

  if (step === "verify") {
    return (
      <div className="space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to {pendingEmail}.
          </p>
        </div>

        <VerifyCode
          value={code}
          onChange={setCode}
          onComplete={onCodeComplete}
        />

        <Button
          type="button"
          variant="ghost"
          className="h-12 w-full gap-2 text-muted-foreground"
          onClick={() => {
            setCode("");
            setStep("account");
          }}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Use a different email
        </Button>
      </div>
    );
  }

  if (step === "business") {
    return (
      <div className="space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Tell us about your business
          </h1>
          <p className="text-sm text-muted-foreground">
            A few details so we can set up your workspace.
          </p>
        </div>

        <form
          onSubmit={businessForm.handleSubmit(onBusinessSubmit)}
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <Label htmlFor="businessName" className="text-sm font-medium">
              Business name
            </Label>
            <div className="relative">
              <Building2
                className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="businessName"
                placeholder="Brightline Care"
                className="h-11 pl-10"
                aria-invalid={Boolean(businessErrors.businessName)}
                {...businessForm.register("businessName")}
              />
            </div>
            {businessErrors.businessName ? (
              <p className="text-xs text-destructive">
                {businessErrors.businessName.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone number
            </Label>
            <div className="relative">
              <Phone
                className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 555 000 1234"
                className="h-11 pl-10"
                aria-invalid={Boolean(businessErrors.phone)}
                {...businessForm.register("phone")}
              />
            </div>
            {businessErrors.phone ? (
              <p className="text-xs text-destructive">
                {businessErrors.phone.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-sm font-medium">
              Business address
            </Label>
            <div className="relative">
              <MapPin
                className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="address"
                placeholder="12 Market Street, Springfield"
                className="h-11 pl-10"
                aria-invalid={Boolean(businessErrors.address)}
                {...businessForm.register("address")}
              />
            </div>
            {businessErrors.address ? (
              <p className="text-xs text-destructive">
                {businessErrors.address.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="h-12 w-full gap-2"
            disabled={businessForm.formState.isSubmitting}
          >
            Finish
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Start with a free blueprint. No card needed.
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

      <form
        onSubmit={accountForm.handleSubmit(onAccountSubmit)}
        className="space-y-5"
      >
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">
            Full name
          </Label>
          <div className="relative">
            <User
              className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="name"
              placeholder="Sk Alamin"
              className="h-11 pl-10"
              aria-invalid={Boolean(accountErrors.name)}
              {...accountForm.register("name")}
            />
          </div>
          {accountErrors.name ? (
            <p className="text-xs text-destructive">
              {accountErrors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Work email
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
              aria-invalid={Boolean(accountErrors.email)}
              {...accountForm.register("email")}
            />
          </div>
          {accountErrors.email ? (
            <p className="text-xs text-destructive">
              {accountErrors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock
              className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              className="h-11 pl-10"
              aria-invalid={Boolean(accountErrors.password)}
              {...accountForm.register("password")}
            />
          </div>
          {accountErrors.password ? (
            <p className="text-xs text-destructive">
              {accountErrors.password.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Checkbox
              id="terms"
              onCheckedChange={(checked) =>
                accountForm.setValue("terms", checked === true)
              }
            />
            <Label
              htmlFor="terms"
              className="cursor-pointer text-sm text-muted-foreground"
            >
              I agree to the terms and privacy policy
            </Label>
          </div>
          {accountErrors.terms ? (
            <p className="text-xs text-destructive">
              {accountErrors.terms.message}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="h-12 w-full gap-2"
          disabled={accountForm.formState.isSubmitting}
        >
          Verify and create account
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
