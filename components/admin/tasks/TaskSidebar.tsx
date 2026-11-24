"use client";

import { useMemo, useState } from "react";
import { TaskActions } from "@/components/admin/tasks/TaskActions";
import { TaskAssignment } from "@/components/admin/tasks/TaskAssignment";
import { useProjectTeams } from "@/hooks/use-project-teams";
import { DEFAULT_TEAM, projectTeamForName } from "@/lib/team-store";

/** Right column of the task detail: people, then status and time. */
export function TaskSidebar({
  status,
  visible,
  logged,
  estimate,
  assignee: initialAssignee,
  reviewer: initialReviewer,
  project,
  onStatusChange,
}: {
  status: string;
  visible: boolean;
  logged: number;
  estimate: number;
  assignee: string;
  reviewer: string;
  project: string;
  onStatusChange?: (status: string) => void;
}) {
  const [assignee, setAssignee] = useState(initialAssignee);
  const [reviewer, setReviewer] = useState(initialReviewer);
  // Re-reads when teams change in Project settings.
  const teams = useProjectTeams();
  const members = useMemo(
    () => projectTeamForName(project),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project, teams],
  );

  return (
    <div className="space-y-4">
      <TaskAssignment
        assignee={assignee}
        reviewer={reviewer}
        onAssigneeChange={setAssignee}
        onReviewerChange={setReviewer}
        members={members.length > 0 ? members : DEFAULT_TEAM}
      />
      <TaskActions
        status={status}
        visible={visible}
        logged={logged}
        estimate={estimate}
        assignee={assignee}
        onTake={() => setAssignee("Alamin")}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
