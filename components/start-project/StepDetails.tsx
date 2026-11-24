"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Loader2, Paperclip, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { FieldError } from "@/components/start-project/FieldError";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IntakeFormValues } from "@/lib/intake-schema";

const MAX_FILES = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
];

/** Step 5: the project in the visitor's own words, plus files. */
export function StepDetails() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IntakeFormValues>();
  const files = watch("files");
  const nda = watch("nda");
  const description = watch("description");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (picked.length === 0 || uploading) return;

    const room = MAX_FILES - files.length;
    if (room <= 0) {
      toast.error(`You can attach up to ${MAX_FILES} files.`);
      return;
    }

    const accepted = picked.slice(0, room).filter((file) => {
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name} is over 10 MB.`);
        return false;
      }
      if (file.type && !ACCEPTED.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        return false;
      }
      return true;
    });
    if (accepted.length === 0) return;

    setUploading(true);
    const uploaded: IntakeFormValues["files"] = [];

    for (const file of accepted) {
      try {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
        const blob = await upload(
          `intake/${safeName}`,
          file,
          { access: "public", handleUploadUrl: "/api/intake/upload" },
        );
        uploaded.push({
          name: file.name.slice(0, 255),
          url: blob.url,
          contentType: file.type,
          sizeBytes: file.size,
        });
      } catch {
        toast.error(
          `${file.name} did not upload. File uploads may not be configured yet.`,
        );
      }
    }

    if (uploaded.length > 0) {
      setValue("files", [...files, ...uploaded], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    setUploading(false);
  }

  function removeFile(url: string) {
    setValue(
      "files",
      files.filter((file) => file.url !== url),
      { shouldDirty: true, shouldValidate: true },
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <Label htmlFor="description" className="text-sm font-medium">
          Describe the project in your own words
        </Label>
        <p className="mt-1 text-xs text-muted-foreground">
          What happens today, what should happen instead, and who uses it. Plain
          words are best. Start with a section per part of your business, like
          &ldquo;Scheduling&rdquo; or &ldquo;Client billing&rdquo;.
        </p>
        <textarea
          id="description"
          rows={9}
          maxLength={5000}
          placeholder={"Example:\n\nScheduling: Clients book a visit online and get a text the day before. Open shifts show in one board for the office team.\n\nBilling: Invoices go out from completed visits without retyping."}
          aria-invalid={Boolean(errors.description)}
          className="mt-3 w-full resize-y rounded-lg border border-input bg-card px-3 py-2.5 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
          {...register("description")}
        />
        <div className="mt-1 flex items-center justify-between">
          <FieldError message={errors.description?.message} />
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
            {description.length}/5000
          </span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="deadline" className="text-sm font-medium">
            Deadline{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="deadline"
            type="date"
            className="mt-1.5 h-11 text-base md:text-sm"
            {...register("deadline")}
          />
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-border p-3.5">
          <Checkbox
            id="nda"
            checked={nda}
            onCheckedChange={(value) =>
              setValue("nda", value === true, { shouldDirty: true })
            }
            className="mt-0.5"
          />
          <div>
            <Label htmlFor="nda" className="text-sm font-medium">
              Send an NDA first
            </Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              We sign it before anyone reads your answers.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">
              Attach files{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Docs, spreadsheets, screenshots or a requirements PDF. Up to{" "}
              {MAX_FILES} files, 10 MB each.
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED.join(",")}
            className="sr-only"
            onChange={handleFiles}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading || files.length >= MAX_FILES}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Paperclip className="size-4" aria-hidden="true" />
            )}
            {uploading ? "Uploading…" : "Add files"}
          </Button>
        </div>

        {files.length > 0 ? (
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
            {files.map((file) => (
              <li
                key={file.url}
                className="flex items-center gap-3 p-3 text-sm"
              >
                <Paperclip
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {formatSize(file.sizeBytes)}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(file.url)}
                  aria-label={`Remove ${file.name}`}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <FieldError
          message={
            errors.files
              ? "One of the files did not upload. Remove it and try again."
              : undefined
          }
        />
      </div>
    </div>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
