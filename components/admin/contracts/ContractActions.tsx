"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateContractStatus } from "@/app/admin/contracts/actions";

export function ContractActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [stage, setStage] = useState(status);
  const [pending, startTransition] = useTransition();

  function change(next: "Sent" | "Signed") {
    startTransition(async () => {
      const result = await updateContractStatus({ id, status: next });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setStage(next);
      toast.success(
        next === "Signed" ? "Contract marked signed" : "Contract sent",
        { description: id },
      );
      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-semibold">Actions</p>
      <p className="mt-1 text-xs text-muted-foreground">Status: {stage}</p>
      <div className="mt-3 space-y-2">
        {stage === "Draft" ? (
          <Button
            className="w-full"
            onClick={() => change("Sent")}
            disabled={pending}
          >
            <Send className="size-4" aria-hidden="true" />
            {pending ? "Sending…" : "Send for signature"}
          </Button>
        ) : null}
        {stage === "Sent" ? (
          <>
            <Button variant="outline" className="w-full" disabled={pending}>
              <Bell className="size-4" aria-hidden="true" />
              Send reminder
            </Button>
            <Button
              className="w-full"
              onClick={() => change("Signed")}
              disabled={pending}
            >
              <Check className="size-4" aria-hidden="true" />
              {pending ? "Saving…" : "Mark signed"}
            </Button>
          </>
        ) : null}
        {stage === "Signed" ? (
          <p className="flex items-center gap-1.5 text-xs text-success">
            <Check className="size-3.5" aria-hidden="true" />
            Signed and stored with the project files.
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        E-signature links expire after 7 days. Signed files are read only.
      </p>
    </div>
  );
}
