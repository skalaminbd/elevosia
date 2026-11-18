"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Folder, Upload } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { portalContracts, portalFiles } from "@/lib/portal-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TABS = ["Files", "Contracts"] as const;
type Tab = (typeof TABS)[number];

export function PortalFilesView() {
  const [tab, setTab] = useState<Tab>("Files");
  const [chosen, setChosen] = useState<string[]>([]);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("tab");
    if (wanted !== "contracts") return;
    const frame = window.requestAnimationFrame(() => setTab("Contracts"));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function chooseTab(next: Tab) {
    setTab(next);
    window.history.replaceState(
      null,
      "",
      next === "Contracts" ? "/portal/files?tab=contracts" : "/portal/files",
    );
  }

  function upload(event: React.FormEvent) {
    event.preventDefault();
    if (chosen.length === 0) return;
    setUploaded((current) => [...chosen, ...current]);
    setChosen([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-1 border-b border-border px-3 py-2.5">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => chooseTab(item)}
            aria-pressed={tab === item}
            className={cn(
              "h-8 rounded-md px-3 text-xs font-medium transition-colors",
              tab === item
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Files" ? (
        <div>
          <form onSubmit={upload} className="border-b border-border p-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium transition-colors hover:bg-secondary">
                <Upload className="size-3.5" aria-hidden="true" />
                Choose files
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(event) =>
                    setChosen(
                      Array.from(event.target.files ?? []).map((file) => file.name),
                    )
                  }
                />
              </label>
              <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {chosen.length > 0
                  ? chosen.join(", ")
                  : "Uploads go to your project's Client uploads folder."}
              </p>
              <Button type="submit" disabled={chosen.length === 0}>
                Upload
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-warning">
              No patient data unless approved. Files are visible to your PM only.
            </p>
          </form>

          {uploaded.length > 0 ? (
            <div className="border-b border-border bg-success/5 px-5 py-2.5">
              <p className="text-xs text-success">
                Uploaded {uploaded.length} file{uploaded.length > 1 ? "s" : ""} in this
                sample. Your PM is notified.
              </p>
            </div>
          ) : null}

          <div className="divide-y divide-border">
            {portalFiles.map((file) => (
              <div key={file.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                  <FileText className="size-3.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {file.folder} · {file.version} · updated {file.updated}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {file.size}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
            <Folder className="size-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs text-muted-foreground">
              Signed contracts and Blueprints. Read only; download for your records.
            </p>
          </div>
          <ul className="divide-y divide-border">
            {portalContracts.map((contract) => (
              <li key={contract.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{contract.name}</p>
                  <p className="text-xs text-muted-foreground">{contract.date}</p>
                </div>
                <StatusBadge
                  tone={contract.status === "Signed" ? "success" : "warning"}
                >
                  {contract.status}
                </StatusBadge>
              </li>
            ))}
          </ul>
          <p className="border-t border-border px-5 py-3 text-[11px] text-muted-foreground">
            A pending signature link is emailed to the owner. This sample does not sign
            documents.
          </p>
        </div>
      )}
    </div>
  );
}
