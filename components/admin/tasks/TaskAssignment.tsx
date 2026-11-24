"use client";

import { AssigneePicker } from "@/components/admin/tasks/AssigneePicker";

/** Assignee and reviewer for a task. */
export function TaskAssignment({
  assignee,
  reviewer,
  onAssigneeChange,
  onReviewerChange,
  members,
}: {
  assignee: string;
  reviewer: string;
  onAssigneeChange: (name: string) => void;
  onReviewerChange: (name: string) => void;
  members: string[];
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-semibold">People</p>
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Assignee</span>
          <AssigneePicker
            value={assignee}
            onChange={onAssigneeChange}
            label="Assignee"
            members={members}
          />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-2">
          <span className="text-xs text-muted-foreground">Reviewer</span>
          <AssigneePicker
            value={reviewer}
            onChange={onReviewerChange}
            label="Reviewer"
            members={members}
          />
        </div>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        One owner per task. The reviewer checks it before Done.
      </p>
    </div>
  );
}
