"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateBlueprintStatus } from "@/app/admin/blueprints/actions";

export function BlueprintActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const locked = status === "Approved" || status === "Expired";
  const sent = status === "Waiting for approval";

  function send() {
    startTransition(async () => {
      const result = await updateBlueprintStatus({
        id,
        status: "Waiting for approval",
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Sent to the client", {
        description: "It now appears in the portal Blueprints.",
      });
      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold">Next step</h2>
        <p className="text-xs text-muted-foreground">{status}</p>
      </div>
      <div className="space-y-3 p-5">
        {locked ? (
          <p className="text-xs text-muted-foreground">
            This version is locked. Create a new version to change the plan.
          </p>
        ) : sent ? (
          <p className="flex items-center gap-1.5 text-xs text-success">
            <Check className="size-3.5" aria-hidden="true" />
            Sent. The client sees it under Approvals and Blueprints.
          </p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              Drafts stay hidden from the portal. Sending locks the requirements
              and starts the client approval clock.
            </p>
            <Button className="w-full" onClick={send} disabled={pending}>
              <Send className="size-4" aria-hidden="true" />
              {pending ? "Sending…" : "Send to client"}
            </Button>
          </>
        )}
        <p className="text-[11px] text-muted-foreground">
          Valid until the date shown. Expired Blueprints can be reissued as a new
          version.
        </p>
      </div>
    </div>
  );
}
