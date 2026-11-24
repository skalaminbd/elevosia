"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LifeBuoy, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { FormField, FormSelect, FormTextarea } from "@/components/ui/form-field";
import {
  TICKET_SLA,
  type TicketCategory,
  type TicketPriority,
} from "@/lib/ticket-store";
import { createPortalTicket } from "@/app/portal/actions";
import { useDirectory } from "@/hooks/use-directory";

const CATEGORIES: TicketCategory[] = [
  "Something is broken",
  "Question",
  "Change request",
  "Billing",
];
const PRIORITIES: TicketPriority[] = ["Normal", "High", "Urgent"];

export default function NewPortalTicketPage() {
  const router = useRouter();
  const { projects } = useDirectory();
  const [subject, setSubject] = useState("");
  const [project, setProject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("Question");
  const [priority, setPriority] = useState<TicketPriority>("Normal");
  const [body, setBody] = useState("");

  const valid = subject.trim().length > 2 && body.trim().length > 2;

  async function submit() {
    if (!valid) return;
    const result = await createPortalTicket({
      subject: subject.trim(),
      body: body.trim(),
      priority:
        priority === "Urgent" ? "P1" : priority === "High" ? "P2" : "P3",
      projectLabel: project || null,
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Ticket submitted", {
      description: `${result.id} · target ${TICKET_SLA[priority]}.`,
    });
    router.push(`/portal/tickets/${result.id}`);
  }

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <Link
        href="/portal/tickets"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All tickets
      </Link>

      <PageHeader
        title="New ticket"
        meta="Support"
        description="Tell us what happened. Your PM sees it right away."
        className="mt-3"
      />

      <div className="mt-6 rounded-lg border border-border bg-card p-5">
        <div className="flex flex-col gap-[18px]">
          <FormField
            id="new-ticket-subject"
            label="Subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="A short summary"
          />
          <div className="grid gap-[18px] sm:grid-cols-2">
            <FormSelect
              id="new-ticket-project"
              label="Project"
              value={project}
              onChange={(event) => setProject(event.target.value)}
            >
              <option value="">Not project specific</option>
              {projects.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </FormSelect>
            <FormSelect
              id="new-ticket-category"
              label="Category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as TicketCategory)
              }
            >
              {CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </FormSelect>
          </div>
          <FormSelect
            id="new-ticket-priority"
            label="Priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TicketPriority)
            }
            hint={`Expected response: ${TICKET_SLA[priority]}.`}
          >
            {PRIORITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </FormSelect>
          <FormTextarea
            id="new-ticket-body"
            label="What happened?"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Steps or pages involved"
          />
          <div className="flex items-center gap-2">
            <Button onClick={submit} disabled={!valid}>
              <Plus className="size-4" aria-hidden="true" />
              Create ticket
            </Button>
            <Button asChild variant="outline">
              <Link href="/portal/tickets">Cancel</Link>
            </Button>
          </div>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <LifeBuoy className="size-3.5" aria-hidden="true" />
        Response target {TICKET_SLA[priority]}.
      </p>
    </div>
  );
}
