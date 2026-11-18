"use client";

import { useState, type ReactNode } from "react";
import { Plus, UserPlus } from "lucide-react";
import { z } from "zod";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormSelect } from "@/components/ui/form-field";

const INDUSTRIES = [
  "Home care",
  "Field services",
  "Agency",
  "Nonprofit",
  "Care",
  "Cleaning",
  "Education",
  "Property",
];
const STATUSES = ["Lead", "Onboarding", "Active", "Paused", "Former"];
const PMS = ["Alamin", "Maya"];
const TIMEZONES = [
  { value: "America/New_York", label: "US Eastern (ET)" },
  { value: "America/Chicago", label: "US Central (CT)" },
  { value: "America/Denver", label: "US Mountain (MT)" },
  { value: "America/Los_Angeles", label: "US Pacific (PT)" },
];
const SOURCES = ["Website", "Referral", "Google", "Event", "Outbound"];

const schema = z.object({
  company: z.string().trim().min(2, "Enter the company name"),
  contact: z.string().trim().min(2, "Enter the main contact"),
  email: z.string().trim().email("Enter a valid work email"),
  industry: z.string().min(1),
  status: z.string().min(1),
  pm: z.string().min(1),
  timezone: z.string().min(1),
  source: z.string().min(1),
  hipaa: z.boolean(),
  invite: z.boolean(),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

const STEPS: (keyof Values)[][] = [
  ["company", "contact", "email", "industry"],
  ["status", "pm", "timezone", "source"],
  ["hipaa", "invite"],
];

export function NewClientDialog({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        children ?? (
          <Button>
            <Plus className="size-4" aria-hidden="true" />
            Add client
          </Button>
        )
      }
      size="md"
    >
      <ClientDialogForm onClose={() => setOpen(false)} />
    </AppDialog>
  );
}

function ClientDialogForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<Values>({
    company: "",
    contact: "",
    email: "",
    industry: "Field services",
    status: "Onboarding",
    pm: "Alamin",
    timezone: "America/New_York",
    source: "Website",
    hipaa: false,
    invite: true,
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setDirty(true);
  }

  function save() {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const failed = STEPS.findIndex((keys) =>
        keys.some((key) => next[key]),
      );
      if (failed >= 0) setStep(failed);
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setDirty(false);
      window.setTimeout(onClose, 2000);
    }, 450);
  }

  return (
    <>
      <AppDialog.Header
        icon={UserPlus}
        title="Add a client"
        subtitle={
          step === 0
            ? "Start with the company and main contact."
            : step === 1
              ? "Set ownership and the client time zone."
              : "Choose how portal access should work."
        }
      />
      <AppDialog.Body>
        <form
          id="new-client-dialog"
          onSubmit={(event) => {
            event.preventDefault();
            if (step < STEPS.length - 1) setStep((value) => value + 1);
            else save();
          }}
          className="flex flex-col gap-[18px]"
        >
          {step === 0 ? (
            <>
              <FormField
                id="client-company"
                label="Company name"
                value={form.company}
                onChange={(event) => update("company", event.target.value)}
                error={errors.company}
              />
              <FormField
                id="client-contact"
                label="Main contact"
                value={form.contact}
                onChange={(event) => update("contact", event.target.value)}
                error={errors.contact}
              />
              <FormField
                id="client-email"
                label="Work email"
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                error={errors.email}
              />
              <FormSelect
                id="client-industry"
                label="Service type"
                value={form.industry}
                onChange={(event) => update("industry", event.target.value)}
              >
                {INDUSTRIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </FormSelect>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <FormSelect
                id="client-status"
                label="Status"
                value={form.status}
                onChange={(event) => update("status", event.target.value)}
              >
                {STATUSES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </FormSelect>
              <FormSelect
                id="client-pm"
                label="Assigned PM"
                value={form.pm}
                onChange={(event) => update("pm", event.target.value)}
              >
                {PMS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </FormSelect>
              <FormSelect
                id="client-timezone"
                label="Client time zone"
                value={form.timezone}
                onChange={(event) => update("timezone", event.target.value)}
              >
                {TIMEZONES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </FormSelect>
              <FormSelect
                id="client-source"
                label="Lead source"
                value={form.source}
                onChange={(event) => update("source", event.target.value)}
              >
                {SOURCES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </FormSelect>
            </>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-dialog-preview)] border border-border p-4">
                <Checkbox
                  id="client-hipaa"
                  checked={form.hipaa}
                  onCheckedChange={(value) => update("hipaa", value === true)}
                  className="mt-0.5"
                />
                <span>
                  <span className="block text-sm font-medium">HIPAA mode</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Turns AI off for this client and adds upload warnings.
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-dialog-preview)] border border-border p-4">
                <Checkbox
                  id="client-invite"
                  checked={form.invite}
                  onCheckedChange={(value) => update("invite", value === true)}
                  className="mt-0.5"
                />
                <span>
                  <span className="block text-sm font-medium">
                    Send a portal invite
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    The owner gets a set-password link that expires in 7 days.
                  </span>
                </span>
              </label>
            </div>
          ) : null}
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        status={saved ? "saved" : dirty ? "dirty" : undefined}
        secondary={
          step === 0
            ? { label: "Cancel" }
            : { label: "Back", onClick: () => setStep((value) => value - 1) }
        }
        primary={
          step < STEPS.length - 1
            ? { label: "Next", onClick: () => setStep((value) => value + 1) }
            : {
                label: "Create client",
                type: "submit",
                form: "new-client-dialog",
                disabled:
                  !form.company.trim() ||
                  !form.contact.trim() ||
                  !form.email.includes("@") ||
                  saving,
                loading: saving,
              }
        }
      />
    </>
  );
}
