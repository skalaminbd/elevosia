"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Pencil, Plus, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormSelect } from "@/components/ui/form-field";
import type { AdminClient, AdminCompany } from "@/lib/admin-data";
import { createClient, updateClient } from "@/app/admin/clients/actions";

const STATUSES = ["Lead", "Onboarding", "Active", "Paused", "Former"];

const BLANK_COMPANY: AdminCompany = {
  name: "",
  address: "",
  city: "",
  region: "",
  zip: "",
  phone: "",
  website: "",
};

/** Shared client form for the Add and Edit dialogs. */
export function ClientDialogForm({
  mode,
  client,
  onClose,
}: {
  mode: "new" | "edit";
  client?: AdminClient;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    firstName: client?.contact.split(" ")[0] ?? "",
    lastName: client?.contact.split(" ").slice(1).join(" ") ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    status: client?.status ?? "Onboarding",
    hipaa: client ? client.industry === "Care" : false,
  });
  const [companies, setCompanies] = useState<AdminCompany[]>(
    client ? client.companies : [{ ...BLANK_COMPANY }],
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateCompany(index: number, key: keyof AdminCompany, value: string) {
    setCompanies((current) =>
      current.map((company, itemIndex) =>
        itemIndex === index ? { ...company, [key]: value } : company,
      ),
    );
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    const payload = {
      contact: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone,
      status: form.status as "Lead" | "Onboarding" | "Active" | "Paused" | "Former",
      industry: client?.industry ?? "",
      pm: client?.pm ?? "Alamin",
      timezone: client?.timezone ?? "America/New_York",
      source: client?.source ?? "Admin",
      companies,
    };
    const result =
      mode === "new"
        ? await createClient(payload)
        : await updateClient({ ...payload, id: client?.id });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSaved(true);
    toast.success(mode === "new" ? "Client added" : "Client updated", {
      description: payload.contact,
    });
    router.refresh();
    window.setTimeout(onClose, 900);
  }

  const valid =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.email.includes("@") &&
    companies.length > 0 &&
    companies.every((company) => company.name.trim() !== "");

  const formId = `${mode}-client-dialog`;

  return (
    <>
      <AppDialog.Header
        icon={mode === "new" ? UserPlus : Pencil}
        title={mode === "new" ? "Add a client" : `Edit ${client?.contact}`}
        subtitle="Client details, ownership, and every company they own."
      />
      <AppDialog.Body>
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault();
            if (valid) save();
          }}
          className="flex flex-col gap-[18px]"
        >
          <div className="grid gap-[18px] sm:grid-cols-2">
            <FormField
              id="client-first-name"
              label="First name"
              value={form.firstName}
              onChange={(event) => update("firstName", event.target.value)}
              disabled={saved}
            />
            <FormField
              id="client-last-name"
              label="Last name"
              value={form.lastName}
              onChange={(event) => update("lastName", event.target.value)}
              disabled={saved}
            />
            <FormField
              id="client-email"
              label="Personal email"
              type="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              disabled={saved}
            />
            <FormField
              id="client-phone"
              label="Phone number"
              type="tel"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              disabled={saved}
            />
            <FormSelect
              id="client-status"
              label="Status"
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
              disabled={saved}
            >
              {STATUSES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </FormSelect>
            <div className="space-y-2">
              <p className="text-[13px] font-medium text-foreground">
                HIPAA mode
              </p>
              <label className="flex h-11.5 cursor-pointer items-center gap-2.5 rounded-[var(--radius-dialog-control)] border border-input bg-card px-3.5">
                <Checkbox
                  id="client-hipaa"
                  checked={form.hipaa}
                  onCheckedChange={(value) => update("hipaa", value === true)}
                  disabled={saved}
                />
                <span className="truncate text-[13px] text-muted-foreground">
                  Turns AI off for this client
                </span>
              </label>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="flex items-center gap-1.5 text-[13px] font-medium">
                  <Building2
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  Companies
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Open a company to edit its details. The first one is the
                  primary.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="dialog-sm"
                onClick={() =>
                  setCompanies((current) => [...current, { ...BLANK_COMPANY }])
                }
                disabled={saved}
              >
                <Plus className="size-3.5" aria-hidden="true" />
                Add company
              </Button>
            </div>

            <Accordion type="single" collapsible className="mt-3 gap-2">
              {companies.map((company, index) => (
                <AccordionItem
                  key={index}
                  value={`company-${index}`}
                  className="rounded-lg border border-border bg-secondary/40 px-3 not-last:border-b-0"
                >
                  <AccordionTrigger className="cursor-pointer py-3 hover:no-underline">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="truncate">
                        {company.name.trim() || `Company ${index + 1}`}
                      </span>
                      {index === 0 ? (
                        <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] font-normal text-muted-foreground">
                          Primary
                        </span>
                      ) : null}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    <div className="grid gap-3 pb-3 sm:grid-cols-2">
                      <FormField
                        id={`company-name-${index}`}
                        label="Company name"
                        value={company.name}
                        onChange={(event) =>
                          updateCompany(index, "name", event.target.value)
                        }
                        disabled={saved}
                        className="sm:col-span-2"
                      />
                      <FormField
                        id={`company-address-${index}`}
                        label="Street address"
                        value={company.address}
                        onChange={(event) =>
                          updateCompany(index, "address", event.target.value)
                        }
                        disabled={saved}
                        className="sm:col-span-2"
                      />
                      <FormField
                        id={`company-city-${index}`}
                        label="City"
                        value={company.city}
                        onChange={(event) =>
                          updateCompany(index, "city", event.target.value)
                        }
                        disabled={saved}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          id={`company-region-${index}`}
                          label="State"
                          value={company.region}
                          onChange={(event) =>
                            updateCompany(index, "region", event.target.value)
                          }
                          disabled={saved}
                        />
                        <FormField
                          id={`company-zip-${index}`}
                          label="ZIP"
                          value={company.zip}
                          onChange={(event) =>
                            updateCompany(index, "zip", event.target.value)
                          }
                          disabled={saved}
                          inputClassName="font-mono"
                        />
                      </div>
                      <FormField
                        id={`company-phone-${index}`}
                        label="Phone"
                        type="tel"
                        value={company.phone}
                        onChange={(event) =>
                          updateCompany(index, "phone", event.target.value)
                        }
                        disabled={saved}
                      />
                      <FormField
                        id={`company-website-${index}`}
                        label="Website"
                        value={company.website}
                        onChange={(event) =>
                          updateCompany(index, "website", event.target.value)
                        }
                        disabled={saved}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="dialog-sm"
                      onClick={() =>
                        setCompanies((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                      disabled={saved || companies.length === 1}
                      className="mb-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Remove company
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        status={saved ? "saved" : undefined}
        secondary={{ label: "Cancel" }}
        primary={{
          label: mode === "new" ? "Add client" : "Save changes",
          type: "submit",
          form: formId,
          disabled: !valid || saving,
          loading: saving,
        }}
      />
    </>
  );
}
