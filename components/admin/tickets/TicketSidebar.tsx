"use client";

import { useState } from "react";
import { BookOpen, FileText, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { updateTicket } from "@/app/admin/tickets/actions";
import { useTeamOptions } from "@/hooks/use-team-options";
import { useHelpArticles } from "@/hooks/use-help-articles";
import { useStoredProjects } from "@/hooks/use-stored-projects";
import { addStoredProject } from "@/lib/project-store";
import type { TicketRecord } from "@/lib/tickets/types";

let taskCounter = 0;
const nextTaskId = (ticketId: string) => {
  taskCounter += 1;
  return `ticket-${ticketId}-${taskCounter}`;
};

/** Ticket sidebar: knowledge, AI suggestions and request-to-task. */
export function TicketSidebar({ ticket }: { ticket: TicketRecord }) {
  const team = useTeamOptions();
  const articles = useHelpArticles();
  const projects = useStoredProjects();
  const [articleQuery, setArticleQuery] = useState("");
  const [title, setTitle] = useState(ticket.subject);
  const [description, setDescription] = useState(ticket.description);
  const [hours, setHours] = useState("2");
  const [assignee, setAssignee] = useState("Alamin");
  const [milestoneChoice, setMilestoneChoice] = useState("");
  const [created, setCreated] = useState<string | null>(null);

  const projectName = ticket.project ?? "Not project specific";
  const project = projects.find(
    (item) => item.name.toLowerCase() === (ticket.project ?? "").toLowerCase(),
  );
  const milestoneOptions = project
    ? project.milestones.map((milestone) => ({
        id: milestone.id,
        label: milestone.title || "Milestone",
      }))
    : ["Foundation", "Build", "Review", "Launch"].map((label) => ({
        id: label,
        label,
      }));
  const chosenMilestone =
    milestoneOptions.find((option) => option.id === milestoneChoice) ??
    milestoneOptions[0];

  const filteredArticles = articles.filter((article) =>
    article.title
      .toLowerCase()
      .includes(articleQuery.trim().toLowerCase()),
  );

  function convert() {
    if (!title.trim()) return;
    const taskId = nextTaskId(ticket.id);
    const taskHours = Number(hours) || 0;

    if (project && chosenMilestone) {
      const milestoneId =
        project.milestones.find((item) => item.id === chosenMilestone.id)?.id ??
        project.milestones[0]?.id;
      addStoredProject({
        ...project,
        milestones: project.milestones.map((milestone) =>
          milestone.id === milestoneId
            ? {
                ...milestone,
                tasks: [
                  ...milestone.tasks,
                  {
                    id: taskId,
                    name: title.trim(),
                    description: description.trim(),
                    hours: taskHours,
                    visible: false,
                    done: false,
                    status: "todo" as const,
                  },
                ],
              }
            : milestone,
        ),
      });
      void updateTicket({
        id: ticket.id,
        patch: {
          linked: [
            ...ticket.linked,
            {
              id: taskId,
              type: "task",
              label: title.trim(),
              meta: `${chosenMilestone.label} · ${taskHours} h · ${assignee}`,
              href: `/admin/tasks/${taskId}?project=${project.id}`,
            },
          ],
        },
      });
      setCreated(`${project.name} · ${chosenMilestone.label}`);
    } else {
      void updateTicket({
        id: ticket.id,
        patch: {
          linked: [
            ...ticket.linked,
          {
            id: taskId,
            type: "task",
            label: title.trim(),
            meta: `${projectName} · ${chosenMilestone?.label} · ${taskHours} h`,
          },
          ],
        },
      });
      setCreated(`${projectName} · ${chosenMilestone?.label}`);
    }
    toast.success("Task created", {
      description: `${title.trim()} · ${chosenMilestone?.label}`,
    });
  }

  return (
    <div className="flex h-full flex-col gap-2.5">
      <section className="rounded-lg border border-border bg-card p-3">
        <p className="flex items-center gap-1.5 text-sm font-medium">
          <BookOpen className="size-3.5 text-muted-foreground" aria-hidden="true" />
          Knowledge base
        </p>
        <Input
          value={articleQuery}
          onChange={(event) => setArticleQuery(event.target.value)}
          placeholder="Search articles"
          aria-label="Search knowledge base"
          className="mt-2 h-8 text-sm"
        />
        <ul className="mt-2 space-y-1">
          {filteredArticles.map((article) => (
            <li
              key={article.title}
              className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 hover:bg-secondary/40"
            >
              <span className="truncate text-sm">{article.title}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {article.type}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {ticket.client.hipaa ? null : (
        <section className="rounded-lg border border-border bg-card p-3">
          <p className="flex items-center gap-1.5 text-sm font-medium">
            <Sparkles className="size-3.5 text-muted-foreground" aria-hidden="true" />
            AI suggestions
          </p>
          <ul className="mt-2 space-y-1">
            <li className="rounded-md bg-secondary/40 px-2.5 py-1.5 text-sm">
              Summarise the thread before replying.
            </li>
            <li className="rounded-md bg-secondary/40 px-2.5 py-1.5 text-sm">
              Suggested tone: calm, short, next step today.
            </li>
          </ul>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Sample output, no model connected.
          </p>
        </section>
      )}

      <section className="flex flex-1 flex-col rounded-lg border border-border bg-card p-3">
        <p className="flex items-center gap-1.5 text-sm font-medium">
          <FileText className="size-3.5 text-muted-foreground" aria-hidden="true" />
          Request to task
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Project: {projectName}
        </p>

        <div className="mt-2 flex flex-1 flex-col gap-1.5">
          <label className="block text-xs text-muted-foreground" htmlFor="to-task-title">
            Task title
          </label>
          <Input
            id="to-task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-8 text-sm"
          />
          <label
            className="block text-xs text-muted-foreground"
            htmlFor="to-task-description"
          >
            Description
          </label>
          <textarea
            id="to-task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="min-h-24 w-full flex-1 resize-none rounded-md border border-input bg-card px-2 py-1.5 text-sm outline-none focus-visible:border-ring"
          />
          <label
            className="block text-xs text-muted-foreground"
            htmlFor="to-task-milestone"
          >
            Milestone
          </label>
          <NativeSelect
            id="to-task-milestone"
            value={milestoneChoice || milestoneOptions[0]?.id || ""}
            onChange={(event) => setMilestoneChoice(event.target.value)}
            className="h-8 rounded-md border border-input bg-card px-2 text-xs"
          >
            {milestoneOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                className="block text-xs text-muted-foreground"
                htmlFor="to-task-hours"
              >
                Hours
              </label>
              <Input
                id="to-task-hours"
                type="number"
                min={0}
                step={0.5}
                value={hours}
                onChange={(event) => setHours(event.target.value)}
                className="mt-1 h-8 font-mono text-sm"
              />
            </div>
            <div>
              <label
                className="block text-xs text-muted-foreground"
                htmlFor="to-task-assignee"
              >
                Assignee
              </label>
              <NativeSelect
                id="to-task-assignee"
                value={assignee}
                onChange={(event) => setAssignee(event.target.value)}
                className="mt-1 h-8 rounded-md border border-input bg-card px-2 text-xs"
              >
                {team.map((member) => (
                  <option key={member.id} value={member.name.split(" ")[0]}>
                    {member.name.split(" ")[0]}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>
          <Button size="sm" className="w-full" onClick={convert}>
            <Wand2 className="size-3.5" aria-hidden="true" />
            Convert to task
          </Button>
          {created ? (
            <p className="text-xs text-success">
              Task created under {created}.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
