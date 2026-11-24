"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LifeBuoy, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { FormField, FormTextarea } from "@/components/ui/form-field";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { createTicket } from "@/app/admin/tickets/actions";
import { useDirectory } from "@/hooks/use-directory";
import type { TicketPriority } from "@/lib/tickets/types";

/** Open ticket tabs, max 8, oldest closes first. Persisted per browser. */
/** Opens the new-ticket dialog. Tabs are off; staff create from the queue. */
export function NewTicketButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="size-3.5" aria-hidden="true" />
        New ticket
      </Button>
      <NewTicketDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function NewTicketDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { clients } = useDirectory();
  const [subject, setSubject] = useState("");
  const [clientName, setClientName] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("P3");
  const [body, setBody] = useState("");

  const valid = subject.trim().length > 2 && body.trim().length > 2;

  async function create() {
    if (!valid) return;
    const client =
      clients.find((item) => item.name === clientName) ?? clients[0];
    if (!client) {
      toast.error("Clients are still loading. Try again in a second.");
      return;
    }
    const result = await createTicket({
      clientId: client.id,
      subject: subject.trim(),
      body: body.trim(),
      priority,
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`${result.id} created`, {
      description: `${client.name} · ${priority} target starts now.`,
    });
    setSubject("");
    setBody("");
    onOpenChange(false);
    router.push(`/admin/tickets/${result.id}`);
  }

  return (
    <AppDialog open={open} onOpenChange={onOpenChange} size="md">
      <AppDialog.Header
        icon={LifeBuoy}
        title="New ticket"
        subtitle="Log a request that came in by phone or from a client email."
      />
      <AppDialog.Body>
        <form
          id="new-admin-ticket"
          onSubmit={(event) => {
            event.preventDefault();
            create();
          }}
          className="flex flex-col gap-[18px]"
        >
          <FormField
            id="admin-ticket-subject"
            label="Subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="A short summary"
          />
          <div className="grid gap-[18px] sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-[13px] font-medium text-foreground">Client</p>
              <NativeSelect
                aria-label="Client"
                value={clientName || clients[0]?.name || ""}
                onChange={(event) => setClientName(event.target.value)}
                className="h-11.5 w-full"
              >
                {clients.map((client) => (
                  <option key={client.id}>{client.name}</option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <p className="text-[13px] font-medium text-foreground">
                Priority
              </p>
              <NativeSelect
                aria-label="Priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TicketPriority)
                }
                className="h-11.5 w-full"
              >
                <option value="P1">P1 · 1 hour</option>
                <option value="P2">P2 · 4 hours</option>
                <option value="P3">P3 · 1 business day</option>
              </NativeSelect>
            </div>
          </div>
          <FormTextarea
            id="admin-ticket-body"
            label="What did the client say?"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="The request in their words"
          />
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        secondary={{ label: "Cancel" }}
        primary={{
          label: "Create ticket",
          type: "submit",
          form: "new-admin-ticket",
          disabled: !valid,
        }}
      />
    </AppDialog>
  );
}
