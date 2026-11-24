"use client";

import { useState } from "react";
import { Check, Clock, MessageSquareWarning } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { useStoredProjects } from "@/hooks/use-stored-projects";
import { addStoredProject, type StoredProject } from "@/lib/project-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type State = "pending" | "approved" | "changes";

type ApprovalItem = {
  id: string;
  type: string;
  title: string;
  detail: string;
  due: string;
  amount?: number;
  live?: { project: StoredProject; milestoneId: string };
};

type ApprovalRow = {
  id: string;
  type: string;
  title: string;
  detail: string;
  due: string;
  amount?: number;
};

type HistoryRow = {
  id: string;
  title: string;
  action: string;
  who: string;
  date: string;
};

/** Approvals: approve or send a change request with a mandatory comment. */
export function ApprovalsList({
  approvals,
  history,
}: {
  approvals: ApprovalRow[];
  history: HistoryRow[];
}) {
  const [states, setStates] = useState<Record<string, State>>({});
  const [openComment, setOpenComment] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const projects = useStoredProjects();

  const liveItems: ApprovalItem[] = projects.flatMap((project) =>
    project.milestones
      .filter(
        (milestone) =>
          milestone.approval === "requested" ||
          states[`live-${project.id}-${milestone.id}`] !== undefined,
      )
      .map((milestone) => {
        const done = milestone.tasks.filter((task) => task.done).length;
        const hours = milestone.tasks.reduce(
          (total, task) => total + task.hours,
          0,
        );
        return {
          id: `live-${project.id}-${milestone.id}`,
          type: "Milestone",
          title: milestone.title || "Milestone plan",
          detail: `${project.name} · ${done}/${milestone.tasks.length} tasks done · ${hours} h`,
          due: milestone.due ? `Due ${milestone.due}` : "Awaiting you",
          live: { project, milestoneId: milestone.id },
        };
      }),
  );

  const items: ApprovalItem[] = [...liveItems, ...approvals];

  function saveMilestone(
    live: { project: StoredProject; milestoneId: string },
    approval: "approved" | undefined,
  ) {
    addStoredProject({
      ...live.project,
      milestones: live.project.milestones.map((milestone) =>
        milestone.id === live.milestoneId
          ? { ...milestone, approval }
          : milestone,
      ),
    });
  }

  function approve(item: ApprovalItem) {
    if (item.live) {
      saveMilestone(item.live, "approved");
      toast.success("Milestone approved", {
        description: "Your PM has been notified.",
      });
    }
    setStates((current) => ({ ...current, [item.id]: "approved" }));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((approval) => {
          const state = states[approval.id] ?? "pending";
          return (
            <div
              key={approval.id}
              className={cn(
                "rounded-lg border bg-card p-5",
                state === "approved"
                  ? "border-success/30"
                  : state === "changes"
                    ? "border-warning/40"
                    : "border-border",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone="accent">{approval.type}</StatusBadge>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {approval.due}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold">{approval.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    {approval.detail}
                  </p>
                  {approval.amount ? (
                    <p className="mt-2 font-mono text-xs font-semibold">
                      +${approval.amount.toLocaleString("en-US")}
                      <span className="ml-2 font-normal text-muted-foreground">
                        one-time change
                      </span>
                    </p>
                  ) : null}
                </div>

                {state === "pending" ? (
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Button onClick={() => approve(approval)}>
                      <Check className="size-4" aria-hidden="true" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setOpenComment(openComment === approval.id ? null : approval.id)
                      }
                    >
                      Request changes
                    </Button>
                  </div>
                ) : state === "approved" ? (
                  <StatusBadge tone="success">
                    <Check className="size-3" aria-hidden="true" />
                    Approved
                  </StatusBadge>
                ) : (
                  <StatusBadge tone="warning">
                    <MessageSquareWarning className="size-3" aria-hidden="true" />
                    Changes requested
                  </StatusBadge>
                )}
              </div>

              {openComment === approval.id && state === "pending" ? (
                <form
                  className="mt-4 rounded-md border border-border bg-background p-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!comments[approval.id]?.trim()) return;
                    if (approval.live) {
                      saveMilestone(approval.live, undefined);
                      toast.success("Sent to your PM", {
                        description: "The plan stays open until they reply.",
                      });
                    }
                    setStates((current) => ({ ...current, [approval.id]: "changes" }));
                    setOpenComment(null);
                  }}
                >
                  <label
                    htmlFor={`comment-${approval.id}`}
                    className="text-xs font-medium"
                  >
                    What should change?
                  </label>
                  <textarea
                    id={`comment-${approval.id}`}
                    value={comments[approval.id] ?? ""}
                    onChange={(event) =>
                      setComments((current) => ({
                        ...current,
                        [approval.id]: event.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="A short note for your PM. This is required."
                    className="mt-1.5 w-full resize-none rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpenComment(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!comments[approval.id]?.trim()}
                    >
                      Send to PM
                    </Button>
                  </div>
                </form>
              ) : null}

              {state === "approved" ? (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-success">
                  <Check className="size-3.5" aria-hidden="true" />
                  Approved just now. Your PM has been notified.
                </p>
              ) : null}
              {state === "changes" ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Sent with your comment. The plan stays open until the PM replies.
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">History</h2>
          <p className="text-xs text-muted-foreground">Everything you have approved</p>
        </div>
        <ul className="divide-y divide-border">
          {history.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <Clock className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.action} by {item.who} · {item.date}
                </p>
              </div>
              <StatusBadge tone="success">Approved</StatusBadge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
