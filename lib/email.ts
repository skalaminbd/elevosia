import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const from = process.env.EMAIL_FROM ?? "Elevosia <noreply@elevosia.com>";

type OtpPurpose = "sign-in" | "email-verification" | "forget-password" | "change-email";

const SUBJECTS: Record<OtpPurpose, string> = {
  "sign-in": "Your Elevosia sign-in code",
  "email-verification": "Verify your Elevosia email",
  "forget-password": "Reset your Elevosia password",
  "change-email": "Confirm your new Elevosia email",
};

/** Sends the one-time code through Resend. No-ops without an API key. */
export async function sendOtpEmail({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: OtpPurpose;
}) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY missing; OTP for ${email} was not sent.`);
    return;
  }

  await resend.emails.send({
    from,
    to: email,
    subject: SUBJECTS[type],
    text: `Your verification code is ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#17392b">
        <h1 style="font-size:20px;margin:0 0 12px">Elevosia</h1>
        <p style="font-size:14px;line-height:1.6;margin:0 0 20px">
          Use this code to continue. It expires in 5 minutes.
        </p>
        <p style="font-family:monospace;font-size:28px;font-weight:700;letter-spacing:6px;margin:0 0 24px">${otp}</p>
        <p style="font-size:12px;color:#6b7280;margin:0">
          If you did not request this, you can ignore this email.
        </p>
      </div>
    `,
  });
}
