"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Award, MapPin, Pencil, UserRound } from "lucide-react";
import { z } from "zod";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import type {
  Profile,
  ProfileAddress,
  ProfileDetails,
} from "@/lib/profile-data";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter the full name"),
  role: z.string().trim().min(2, "Enter the role"),
  city: z.string().trim().min(2, "Enter the location"),
  experience: z.string().trim().min(1, "Enter the experience level"),
  favorite: z.string().trim().min(1, "Enter the favorite industries"),
  stack: z.string().trim().min(1, "Enter the preferred stack"),
  tools: z.string().trim().min(1, "Enter the software you use"),
  style: z.string().trim().min(1, "Enter the working style"),
  availability: z.string().trim().min(2, "Enter the availability"),
  badge: z.string().trim().min(1, "Enter a badge"),
  tags: z.string().trim().min(1, "Enter the tags"),
  photo: z.string().optional(),
});

const addressSchema = z.object({
  street: z.string().trim().min(4, "Enter the street address"),
  city: z.string().trim().min(2, "Enter the city"),
  region: z.string().trim().min(2, "Enter the state or region"),
  postal: z.string().trim().min(3, "Enter the postal code"),
  country: z.string().trim().min(2, "Enter the country"),
});

type ProfileValues = z.infer<typeof profileSchema>;
type ProfileErrors = Partial<Record<keyof ProfileValues, string>>;
type AddressValues = z.infer<typeof addressSchema>;
type AddressErrors = Partial<Record<keyof AddressValues, string>>;

const PROFILE_STEPS: (keyof ProfileValues)[][] = [
  ["name", "role", "city"],
  ["experience", "favorite", "stack", "tools"],
  ["style", "availability", "badge", "tags"],
];

const ADDRESS_STEPS: (keyof AddressValues)[][] = [
  ["street", "city", "region"],
  ["postal", "country"],
];

const FIELDS: {
  label: string;
  key: keyof ProfileDetails;
  kind?: "success" | "accent";
}[] = [
  { label: "My role", key: "role" },
  { label: "My experience level", key: "experience" },
  { label: "My 3 favorite industries", key: "favorite" },
  { label: "My preferred stack", key: "stack" },
  { label: "Software I use", key: "tools" },
  { label: "My working style", key: "style" },
  { label: "My city or region", key: "city" },
  { label: "Availability", key: "availability", kind: "success" },
  { label: "Badges", key: "badge", kind: "accent" },
  { label: "Tags", key: "tags" },
];

export function ProfileView({ profile: initialProfile }: { profile: Profile }) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [profileOpen, setProfileOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [profileSession, setProfileSession] = useState(0);
  const [addressSession, setAddressSession] = useState(0);
  const details = profile.details;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Profile"
        description="View all your profile details here."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <section className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-center lg:col-span-5">
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute inset-4 rounded-full bg-highlight/25 blur-2xl"
            />
            <span className="relative flex size-40 items-center justify-center overflow-hidden rounded-full border-[6px] border-secondary bg-highlight/40 font-heading text-5xl font-semibold tracking-tight text-primary sm:size-48">
              {details.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={details.photo} alt="" className="size-full object-cover" />
              ) : (
                details.initials
              )}
            </span>
          </div>
          <h2 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {details.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-success">
            {details.title}
          </p>
        </section>

        <section className="relative rounded-lg border border-border bg-card p-6 lg:col-span-7">
          <div className="absolute top-4 right-4">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Edit profile details"
              onClick={() => {
                setProfileSession((value) => value + 1);
                setProfileOpen(true);
              }}
              className="rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Pencil className="size-3.5" aria-hidden="true" />
            </Button>
          </div>

          <h2 className="pr-10 text-lg font-semibold">Bio &amp; other details</h2>

          <dl className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {FIELDS.map((field) => {
              const value = details[field.key];
              return (
                <div key={field.key} className="min-w-0">
                  <dt className="text-xs text-muted-foreground">
                    {field.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium break-words">
                    {field.kind === "success" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                        <span
                          aria-hidden="true"
                          className="size-1.5 rounded-full bg-success"
                        />
                        {String(value)}
                      </span>
                    ) : field.kind === "accent" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        <Award className="size-3" aria-hidden="true" />
                        {String(value)}
                      </span>
                    ) : (
                      String(value)
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      </div>

      <section className="relative mt-4 rounded-lg border border-border bg-card p-6">
        <div className="absolute top-4 right-4">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Edit address"
            onClick={() => {
              setAddressSession((value) => value + 1);
              setAddressOpen(true);
            }}
            className="rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Pencil className="size-3.5" aria-hidden="true" />
          </Button>
        </div>

        <h2 className="pr-10 text-lg font-semibold">Address</h2>
        <div className="mt-5 flex items-start gap-3 rounded-lg border border-border bg-background p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPin className="size-4" aria-hidden="true" />
          </span>
          <address className="text-sm leading-6 not-italic">
            <span className="block font-medium">{profile.address.street}</span>
            <span className="block text-muted-foreground">
              {profile.address.city}, {profile.address.region}{" "}
              {profile.address.postal}
            </span>
            <span className="block text-muted-foreground">
              {profile.address.country}
            </span>
          </address>
        </div>
      </section>

      <ProfileEditDialog
        key={`profile-${profileSession}`}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        initial={details}
        onSave={(next) =>
          setProfile((current) => ({ ...current, details: next }))
        }
      />

      <AddressEditDialog
        key={`address-${addressSession}`}
        open={addressOpen}
        onOpenChange={setAddressOpen}
        initial={profile.address}
        onSave={(next) =>
          setProfile((current) => ({ ...current, address: next }))
        }
      />
    </div>
  );
}

function ProfileEditDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ProfileDetails;
  onSave: (details: ProfileDetails) => void;
}) {
  const [form, setForm] = useState<ProfileValues>({
    name: initial.name,
    role: initial.role,
    city: initial.city,
    experience: initial.experience,
    favorite: initial.favorite,
    stack: initial.stack,
    tools: initial.tools,
    style: initial.style,
    availability: initial.availability,
    badge: initial.badge,
    tags: initial.tags,
    photo: initial.photo,
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);

  function update(key: keyof ProfileValues) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
      setDirty(true);
    };
  }

  function changePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((current) => ({ ...current, photo: reader.result as string }));
        setDirty(true);
      }
    };
    reader.readAsDataURL(file);
  }

  function save() {
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      const next: ProfileErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ProfileValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const failedStep = PROFILE_STEPS.findIndex((keys) =>
        keys.some((key) => next[key]),
      );
      if (failedStep >= 0) setStep(failedStep);
      return;
    }

    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setDirty(false);
      onSave({
        ...initial,
        ...parsed.data,
        title: initial.title,
        initials: initial.initials,
      });
      window.setTimeout(() => onOpenChange(false), 2000);
    }, 450);
  }

  const subtitles = [
    "Update your name, role and location.",
    "Tell clients about your work.",
    "Set how you show up in the workspace.",
  ];

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      dirty={dirty && !saved}
      initialFocus="first"
    >
      <AppDialog.Header
        icon={UserRound}
        title="Edit profile"
        subtitle={subtitles[step]}
      />
      <AppDialog.Body>
        <form
          id="profile-edit-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (step < 2) setStep((value) => value + 1);
            else save();
          }}
          className="flex flex-col gap-[18px]"
        >
          {step === 0 ? (
            <>
              <AppDialog.PreviewCard
                initials={initial.initials}
                photo={form.photo}
                title={form.name || "Your name"}
                subtitle={[form.role, form.city].filter(Boolean).join(" · ")}
                action={
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="dialog-sm"
                      className="bg-card"
                      onClick={() => photoInput.current?.click()}
                    >
                      Change photo
                    </Button>
                    <input
                      ref={photoInput}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      aria-label="Change profile photo"
                      onChange={changePhoto}
                    />
                  </>
                }
              />
              <FormField
                id="profile-name"
                label="Full name"
                value={form.name}
                onChange={update("name")}
                error={errors.name}
              />
              <FormField
                id="profile-role"
                label="Role"
                value={form.role}
                onChange={update("role")}
                error={errors.role}
              />
              <FormField
                id="profile-city"
                label="Location"
                icon={MapPin}
                value={form.city}
                onChange={update("city")}
                error={errors.city}
              />
            </>
          ) : null}

          {step === 1 ? (
            <>
              <FormField
                id="profile-experience"
                label="Experience level"
                value={form.experience}
                onChange={update("experience")}
                error={errors.experience}
              />
              <FormField
                id="profile-favorite"
                label="Favorite industries"
                value={form.favorite}
                onChange={update("favorite")}
                error={errors.favorite}
              />
              <FormField
                id="profile-stack"
                label="Preferred stack"
                value={form.stack}
                onChange={update("stack")}
                error={errors.stack}
              />
              <FormField
                id="profile-tools"
                label="Software I use"
                value={form.tools}
                onChange={update("tools")}
                error={errors.tools}
              />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <FormField
                id="profile-style"
                label="Working style"
                value={form.style}
                onChange={update("style")}
                error={errors.style}
              />
              <FormField
                id="profile-availability"
                label="Availability"
                value={form.availability}
                onChange={update("availability")}
                error={errors.availability}
              />
              <FormField
                id="profile-badge"
                label="Badge"
                value={form.badge}
                onChange={update("badge")}
                error={errors.badge}
              />
              <FormField
                id="profile-tags"
                label="Tags"
                value={form.tags}
                onChange={update("tags")}
                error={errors.tags}
              />
            </>
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
          step < 2
            ? {
                label: "Next",
                onClick: () => setStep((value) => value + 1),
              }
            : {
                label: "Save changes",
                type: "submit",
                form: "profile-edit-form",
                disabled: !dirty || saving,
                loading: saving,
              }
        }
      />
    </AppDialog>
  );
}

function AddressEditDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ProfileAddress;
  onSave: (address: ProfileAddress) => void;
}) {
  const [form, setForm] = useState<AddressValues>(initial);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<AddressErrors>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(key: keyof AddressValues) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
      setDirty(true);
    };
  }

  function save() {
    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      const next: AddressErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof AddressValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const failedStep = ADDRESS_STEPS.findIndex((keys) =>
        keys.some((key) => next[key]),
      );
      if (failedStep >= 0) setStep(failedStep);
      return;
    }

    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setDirty(false);
      onSave(parsed.data);
      window.setTimeout(() => onOpenChange(false), 2000);
    }, 450);
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      dirty={dirty && !saved}
      initialFocus="first"
    >
      <AppDialog.Header
        icon={MapPin}
        title="Edit address"
        subtitle="Update the detailed address on your profile."
      />
      <AppDialog.Body>
        <form
          id="address-edit-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (step < ADDRESS_STEPS.length - 1)
              setStep((value) => value + 1);
            else save();
          }}
          className="flex flex-col gap-[18px]"
        >
          {step === 0 ? (
            <>
              <FormField
                id="address-street"
                label="Street address"
                value={form.street}
                onChange={update("street")}
                error={errors.street}
              />
              <FormField
                id="address-city"
                label="City"
                value={form.city}
                onChange={update("city")}
                error={errors.city}
              />
              <FormField
                id="address-region"
                label="State or region"
                value={form.region}
                onChange={update("region")}
                error={errors.region}
              />
            </>
          ) : (
            <>
              <FormField
                id="address-postal"
                label="Postal code"
                value={form.postal}
                onChange={update("postal")}
                error={errors.postal}
              />
              <FormField
                id="address-country"
                label="Country"
                value={form.country}
                onChange={update("country")}
                error={errors.country}
              />
            </>
          )}
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
          step < ADDRESS_STEPS.length - 1
            ? { label: "Next", onClick: () => setStep((value) => value + 1) }
            : {
                label: "Save address",
                type: "submit",
                form: "address-edit-form",
                disabled: !dirty || saving,
                loading: saving,
              }
        }
      />
    </AppDialog>
  );
}
