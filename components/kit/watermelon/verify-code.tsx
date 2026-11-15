// Source: https://registry.watermelon.sh/r/input-otp-2.json (adapted to Elevosia tokens)

"use client";

import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

export function VerifyCode({
  value,
  onChange,
  onComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
}) {
  const id = useId();
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="space-y-4">
      <Label htmlFor={id} className="sr-only">
        Verification code
      </Label>

      <InputOTP
        id={id}
        maxLength={6}
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        containerClassName="w-full"
      >
        <InputOTPGroup className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="h-14 w-12 rounded-lg bg-card text-lg"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <div className="flex items-center gap-1 text-sm">
        <span className="text-muted-foreground">
          {seconds > 0
            ? `Resend in 00:${seconds.toString().padStart(2, "0")}`
            : "Didn't receive the code?"}
        </span>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="px-1"
          onClick={() => setSeconds(30)}
          disabled={seconds > 0}
        >
          Resend
        </Button>
      </div>
    </div>
  );
}
