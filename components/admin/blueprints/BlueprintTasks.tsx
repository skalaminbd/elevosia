"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardCheck,
  Eye,
  GripVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { FormField, FormTextarea } from "@/components/ui/form-field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ConvertToProjectDialog } from "@/components/admin/projects/ConvertToProjectDialog";
import { TaskSuggestion } from "@/components/admin/blueprints/TaskSuggestion";
import { useBlueprintOverrides } from "@/hooks/use-blueprint-store";
import { saveBlueprintTask } from "@/lib/blueprint-store";
import { saveBlueprintPlan } from "@/app/admin/blueprints/actions";
import type { BlueprintSuggestionRow } from "@/db/queries";

export type BlueprintTask = {
  id: string;
  name: string;
  description: string;
  hours: number;
  visible: boolean;
};

export type BlueprintMilestone = {
  id: string;
  title: string;
  tasks: BlueprintTask[];
};

type TaskLocation = { milestoneId: string; taskId: string };

let counter = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${counter++}`;

function findDropTarget(x: number, y: number) {
  for (const row of document.querySelectorAll<HTMLElement>(
    "[data-task-row]",
  )) {
    const rect = row.getBoundingClientRect();
    if (y >= rect.top && y <= rect.bottom && x >= rect.left && x <= rect.right) {
      const milestoneId = row.dataset.milestoneId;
      if (!milestoneId) continue;
      return { milestoneId, index: Number(row.dataset.taskIndex ?? 0) };
    }
  }
  for (const zone of document.querySelectorAll<HTMLElement>(
    "[data-milestone-drop]",
  )) {
    const rect = zone.getBoundingClientRect();
    if (y >= rect.top && y <= rect.bottom && x >= rect.left && x <= rect.right) {
      const milestoneId = zone.dataset.milestoneDrop;
      if (milestoneId) return { milestoneId, index: 0 };
    }
  }
  return null;
}

export type BlueprintConvertInfo = {
  blueprintId: string;
  blueprintTitle: string;
  client: string;
  clientId: string;
  /** Requirement this Blueprint was built from, when there is one. */
  requirement?: { id: string; title: string };
};

export type ApprovedScopePoint = {
  requirementId: string;
  sectionKey: string;
  pointIndex: number;
  text: string;
  mustHave: boolean;
  milestoneId: string;
};

/** Milestones and tasks: drag to reorder, panel to view and edit. */
export function BlueprintTasks({
  initial,
  convert,
  blueprintId,
  status,
  approvedScope,
  suggestions = [],
}: {
  initial: BlueprintMilestone[];
  convert?: BlueprintConvertInfo;
  blueprintId?: string;
  status?: string;
  approvedScope?: ApprovedScopePoint[];
  suggestions?: BlueprintSuggestionRow[];
}) {
  const router = useRouter();
  const [milestones, setMilestones] = useState<BlueprintMilestone[]>(initial);
  const [savedPlan, setSavedPlan] = useState(() => JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const overrides = useBlueprintOverrides(blueprintId ?? "");
  const effectiveStatus = status ?? "";

  // Approved values from the admin (or an approved client suggestion) win.
  const shownMilestones = milestones.map((milestone) => ({
    ...milestone,
    tasks: milestone.tasks.map((task) =>
      overrides[task.id] ? { ...task, ...overrides[task.id] } : task,
    ),
  }));

  const dirty = JSON.stringify(shownMilestones) !== savedPlan;

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  async function savePlan() {
    if (!blueprintId || saving) return;
    setSaving(true);
    const result = await saveBlueprintPlan({
      blueprintId,
      milestones: shownMilestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title || "Untitled milestone",
        tasks: milestone.tasks.map((task) => ({
          id: task.id,
          name: task.name,
          description: task.description,
          hours: task.hours,
          visible: task.visible,
        })),
      })),
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSavedPlan(JSON.stringify(shownMilestones));
    toast.success("Blueprint saved", {
      description: "Milestones and tasks are stored in the database.",
    });
    router.refresh();
  }

  // Requirement points approved into a milestone join it as read-only tasks.
  const scopePoints = useMemo(() => approvedScope ?? [], [approvedScope]);
  const scopeByMilestone = useMemo(() => {
    const map = new Map<string, ApprovedScopePoint[]>();
    for (const point of scopePoints) {
      if (!point.milestoneId) continue;
      const list = map.get(point.milestoneId) ?? [];
      list.push(point);
      map.set(point.milestoneId, list);
    }
    return map;
  }, [scopePoints]);
  const conversionMilestones = useMemo(
    () =>
      shownMilestones.map((milestone) => ({
        ...milestone,
        tasks: [
          ...milestone.tasks,
          ...(scopeByMilestone.get(milestone.id) ?? []).map((point) => ({
            id: `req-${point.requirementId}-${point.sectionKey}-${point.pointIndex}`,
            name: point.text,
            description: `From ${point.requirementId}`,
            hours: 0,
            visible: true,
          })),
        ],
      })),
    [shownMilestones, scopeByMilestone],
  );
  const scopeRecord =
    convert?.requirement && scopePoints.length > 0
      ? {
          requirementId: convert.requirement.id,
          requirementTitle: convert.requirement.title,
          blueprintId: convert.blueprintId,
          points: scopePoints.map((point) => ({
            text: point.text,
            must: point.mustHave,
            milestoneId: point.milestoneId,
            milestoneTitle:
              shownMilestones.find((item) => item.id === point.milestoneId)
                ?.title ?? "Milestone",
          })),
        }
      : undefined;
  const [drag, setDrag] = useState<TaskLocation | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    milestoneId: string;
    index: number;
  } | null>(null);
  const [touchDrag, setTouchDrag] = useState<
    (TaskLocation & { x: number; y: number }) | null
  >(null);
  const reduceMotion = useReducedMotion();
  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0.12, duration: 0.35 };
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [titleEditing, setTitleEditing] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    milestone: BlueprintMilestone;
    task: BlueprintTask;
  } | null>(null);
  const [deleteWord, setDeleteWord] = useState("");

  // Clicking anywhere outside the title input ends editing; the title is
  // already saved on every keystroke.
  useEffect(() => {
    if (!titleEditing) return;
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-milestone-title]")) return;
      setTitleEditing(null);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown);
  }, [titleEditing]);
  const [sheet, setSheet] = useState<
    (TaskLocation & { mode: "view" | "edit" }) | null
  >(null);

  function addTask(milestoneId: string, task: Omit<BlueprintTask, "id">) {
    setMilestones((current) =>
      current.map((milestone) =>
        milestone.id === milestoneId
          ? {
              ...milestone,
              tasks: [...milestone.tasks, { ...task, id: nextId("task") }],
            }
          : milestone,
      ),
    );
  }

  function removeTask(milestoneId: string, taskId: string) {
    setMilestones((current) =>
      current.map((milestone) =>
        milestone.id === milestoneId
          ? {
              ...milestone,
              tasks: milestone.tasks.filter((task) => task.id !== taskId),
            }
          : milestone,
      ),
    );
    setSheet(null);
  }

  function createMilestone() {
    const id = nextId("milestone");
    setMilestones((current) => [...current, { id, title: "", tasks: [] }]);
    setCollapsed((current) => ({ ...current, [id]: false }));
    setTitleEditing(id);
  }

  function renameMilestone(id: string, title: string) {
    setMilestones((current) =>
      current.map((milestone) =>
        milestone.id === id ? { ...milestone, title } : milestone,
      ),
    );
  }

  function moveTask(
    from: TaskLocation,
    toMilestoneId: string,
    toIndex: number,
  ) {
    setMilestones((current) => {
      const source = current.find(
        (milestone) => milestone.id === from.milestoneId,
      );
      const task = source?.tasks.find((item) => item.id === from.taskId);
      if (!task) return current;

      let targetIndex = toIndex;
      if (from.milestoneId === toMilestoneId) {
        const sourceIndex =
          source?.tasks.findIndex((item) => item.id === from.taskId) ?? 0;
        if (sourceIndex < toIndex) targetIndex = toIndex - 1;
      }

      return current.map((milestone) => {
        let tasks = milestone.tasks;
        if (milestone.id === from.milestoneId) {
          tasks = tasks.filter((item) => item.id !== from.taskId);
        }
        if (milestone.id === toMilestoneId) {
          tasks = [...tasks];
          const index = Math.max(0, Math.min(targetIndex, tasks.length));
          tasks.splice(index, 0, task);
        }
        return tasks === milestone.tasks ? milestone : { ...milestone, tasks };
      });
    });
  }

  function updateTask(
    location: TaskLocation,
    patch: Omit<BlueprintTask, "id">,
  ) {
    setMilestones((current) =>
      current.map((milestone) =>
        milestone.id === location.milestoneId
          ? {
              ...milestone,
              tasks: milestone.tasks.map((task) =>
                task.id === location.taskId ? { ...task, ...patch } : task,
              ),
            }
          : milestone,
      ),
    );
    if (blueprintId) saveBlueprintTask(blueprintId, location.taskId, patch);
  }

  const editingMilestone = sheet
    ? shownMilestones.find((milestone) => milestone.id === sheet.milestoneId)
    : undefined;
  const editingTask = sheet
    ? editingMilestone?.tasks.find((task) => task.id === sheet.taskId)
    : undefined;
  const editingIndex = editingTask
    ? (editingMilestone?.tasks.findIndex(
        (task) => task.id === editingTask.id,
      ) ?? 0)
    : 0;
  const editingCount = editingMilestone?.tasks.length ?? 0;

  return (
    <div className="space-y-4">
      {convert && effectiveStatus === "Approved" ? (
        <div className="flex justify-end">
          <ConvertToProjectDialog
            {...convert}
            milestones={conversionMilestones}
            scope={scopeRecord}
          />
        </div>
      ) : null}

      {blueprintId ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {dirty
              ? "Unsaved changes. Save to keep the milestones and tasks."
              : "All changes are saved."}
          </p>
          <Button
            type="button"
            onClick={() => void savePlan()}
            disabled={!dirty || saving}
          >
            <Save className="size-4" aria-hidden="true" />
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </Button>
        </div>
      ) : null}

      {shownMilestones.map((milestone) => {
        const hours = milestone.tasks.reduce(
          (total, task) => total + task.hours,
          0,
        );
        const isCollapsed = collapsed[milestone.id] ?? false;
        const isEditingTitle = titleEditing === milestone.id;
        const scopeRows = scopeByMilestone.get(milestone.id) ?? [];

        return (
          <section
            key={milestone.id}
            className="min-w-0 overflow-hidden rounded-lg border border-border bg-card"
          >
            <div className="flex flex-wrap items-center gap-2 border-b border-border px-2 py-2.5 sm:px-4">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={
                  isCollapsed ? "Expand milestone" : "Collapse milestone"
                }
                aria-expanded={!isCollapsed}
                onClick={() =>
                  setCollapsed((current) => ({
                    ...current,
                    [milestone.id]: !isCollapsed,
                  }))
                }
                className="shrink-0 text-muted-foreground"
              >
                <ChevronRight
                  className={cn(
                    "size-4 transition-transform",
                    !isCollapsed && "rotate-90",
                  )}
                  aria-hidden="true"
                />
              </Button>

              <div className="min-w-0 flex-1">
                {isEditingTitle ? (
                  <input
                    autoFocus
                    data-milestone-title="true"
                    value={milestone.title}
                    placeholder="Milestone name"
                    aria-label="Milestone name"
                    onChange={(event) =>
                      renameMilestone(milestone.id, event.target.value)
                    }
                    onBlur={() => setTitleEditing(null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === "Escape") {
                        setTitleEditing(null);
                      }
                    }}
                    className="h-8 w-full max-w-xs rounded-md border border-input bg-card px-2 text-sm font-semibold outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                ) : (
                  <h2
                    onDoubleClick={() => setTitleEditing(milestone.id)}
                    title="Double-click to rename"
                    className="cursor-text truncate select-none text-sm font-semibold"
                  >
                    {milestone.title || "Untitled milestone"}
                  </h2>
                )}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {milestone.tasks.length + scopeRows.length}{" "}
                  {milestone.tasks.length + scopeRows.length === 1
                    ? "task"
                    : "tasks"}{" "}
                  · {hours} h
                  {scopeRows.length > 0
                    ? ` · ${scopeRows.length} from requirements`
                    : ""}
                </p>
              </div>

              <AddTaskDialog
                onAdd={(task) => addTask(milestone.id, task)}
              />
            </div>

            {isCollapsed ? null : milestone.tasks.length === 0 &&
              scopeRows.length === 0 ? (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setDropTarget({ milestoneId: milestone.id, index: 0 });
                }}
                onDrop={() => {
                  if (drag) moveTask(drag, milestone.id, 0);
                  setDrag(null);
                  setDropTarget(null);
                }}
                data-milestone-drop={milestone.id}
                className={cn(
                  "px-5 py-6 text-sm text-muted-foreground transition-colors",
                  dropTarget?.milestoneId === milestone.id && "bg-secondary/40",
                )}
              >
                No tasks yet. Add the first one, or drag one here.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {milestone.tasks.map((task, index) => {
                  const isTarget =
                    dropTarget?.milestoneId === milestone.id &&
                    dropTarget.index === index;
                  const taskSuggestion =
                    suggestions.find(
                      (item) =>
                        item.taskId === task.id && item.status === "pending",
                    ) ?? suggestions.find((item) => item.taskId === task.id);
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      transition={layoutTransition}
                      className="relative"
                    >
                      {isTarget ? (
                        <span
                          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div
                        data-task-row="true"
                        data-milestone-id={milestone.id}
                        data-task-index={index}
                        draggable={!touchDrag}
                        onPointerDown={(event) => {
                          if (event.pointerType === "mouse") return;
                          if (
                            (event.target as HTMLElement).closest("button")
                          ) {
                            return;
                          }
                          event.currentTarget.draggable = false;
                          event.preventDefault();
                          event.currentTarget.setPointerCapture(
                            event.pointerId,
                          );
                          setDropTarget(null);
                          setTouchDrag({
                            milestoneId: milestone.id,
                            taskId: task.id,
                            x: event.clientX,
                            y: event.clientY,
                          });
                        }}
                        onPointerMove={(event) => {
                          if (!touchDrag) return;
                          event.preventDefault();
                          setTouchDrag((current) =>
                            current
                              ? {
                                  ...current,
                                  x: event.clientX,
                                  y: event.clientY,
                                }
                              : current,
                          );
                          const hit = findDropTarget(
                            event.clientX,
                            event.clientY,
                          );
                          if (hit) setDropTarget(hit);
                        }}
                        onPointerUp={(event) => {
                          event.currentTarget.draggable = true;
                          if (touchDrag && dropTarget) {
                            moveTask(
                              {
                                milestoneId: touchDrag.milestoneId,
                                taskId: touchDrag.taskId,
                              },
                              dropTarget.milestoneId,
                              dropTarget.index,
                            );
                          }
                          setTouchDrag(null);
                          setDropTarget(null);
                        }}
                        onPointerCancel={(event) => {
                          event.currentTarget.draggable = true;
                          setTouchDrag(null);
                          setDropTarget(null);
                        }}
                        onDragStart={(event) => {
                          event.dataTransfer.setDragImage(
                            event.currentTarget,
                            24,
                            24,
                          );
                          event.dataTransfer.effectAllowed = "move";
                          setDropTarget(null);
                          setDrag({
                            milestoneId: milestone.id,
                            taskId: task.id,
                          });
                        }}
                        onDragEnd={() => {
                          setDrag(null);
                          setDropTarget(null);
                        }}
                        onDragOver={(event) => {
                          event.preventDefault();
                          event.dataTransfer.dropEffect = "move";
                          if (
                            dropTarget?.milestoneId !== milestone.id ||
                            dropTarget.index !== index
                          ) {
                            setDropTarget({
                              milestoneId: milestone.id,
                              index,
                            });
                          }
                        }}
                        onDrop={() => {
                          if (drag) moveTask(drag, milestone.id, index);
                          setDrag(null);
                          setDropTarget(null);
                        }}
                        className={cn(
                          "flex touch-none flex-wrap items-center gap-3 bg-card px-5 py-3 transition-all duration-200",
                          drag?.taskId === task.id &&
                            "scale-[0.99] opacity-60 shadow-sm",
                          touchDrag?.taskId === task.id &&
                            "scale-[0.99] opacity-60 shadow-sm",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="flex size-8 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground active:cursor-grabbing"
                        >
                          <GripVertical className="size-4" />
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{task.name}</p>
                          {task.description ? (
                            <p className="mt-0.5 whitespace-pre-wrap text-xs text-muted-foreground">
                              {task.description}
                            </p>
                          ) : null}
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {task.hours} h
                        </span>
                        <StatusBadge
                          tone={task.visible ? "accent" : "neutral"}
                        >
                          {task.visible ? "Client-visible" : "Internal"}
                        </StatusBadge>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`View ${task.name}`}
                          onClick={() =>
                            setSheet({
                              milestoneId: milestone.id,
                              taskId: task.id,
                              mode: "view",
                            })
                          }
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="size-3.5" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Remove ${task.name}`}
                          onClick={() => {
                            setDeleteWord("");
                            setDeleteTarget({ milestone, task });
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                      {taskSuggestion ? (
                        <TaskSuggestion suggestion={taskSuggestion} />
                      ) : null}
                    </motion.div>
                  );
                })}
                {scopeRows.map((point) => (
                  <div
                    key={`req-${point.requirementId}-${point.sectionKey}-${point.pointIndex}`}
                    className="flex flex-wrap items-center gap-3 bg-success/5 px-5 py-3"
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-md text-success"
                    >
                      <ClipboardCheck className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="whitespace-pre-wrap text-sm">{point.text}</p>
                      <p className="text-xs text-muted-foreground">
                        From {point.requirementId} · approved requirement
                      </p>
                    </div>
                    <StatusBadge tone="success">From requirements</StatusBadge>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}

      <Button variant="outline" className="w-full" onClick={createMilestone}>
        <Plus className="size-4" aria-hidden="true" />
        Add milestone
      </Button>

      {touchDrag ? (
        <div
          className="pointer-events-none fixed z-80 rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md"
          style={{
            left: touchDrag.x,
            top: touchDrag.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          {milestones
            .find((milestone) => milestone.id === touchDrag.milestoneId)
            ?.tasks.find((task) => task.id === touchDrag.taskId)?.name ??
            "Task"}
        </div>
      ) : null}

      <AppDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteWord("");
          }
        }}
        size="sm"
        initialFocus="first"
      >
        <AppDialog.Header icon={AlertTriangle} title="Delete task" />
        <AppDialog.Body>
          <p className="text-sm text-muted-foreground">
            This removes the task for good. It cannot be undone.
          </p>
          <div className="rounded-[var(--radius-dialog-preview)] border border-destructive/25 bg-destructive/10 px-4 py-3">
            <p className="text-sm font-medium text-destructive">
              {deleteTarget?.task.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {deleteTarget?.milestone.title || "Untitled milestone"}
            </p>
          </div>
          <FormField
            id="delete-confirm-word"
            label='Type "delete" to confirm'
            value={deleteWord}
            onChange={(event) => setDeleteWord(event.target.value)}
            autoComplete="off"
            inputClassName="font-mono"
          />
        </AppDialog.Body>
        <AppDialog.Footer
          secondary={{ label: "Cancel" }}
          primary={{
            label: "Delete task",
            variant: "destructive",
            disabled: deleteWord.trim().toLowerCase() !== "delete",
            onClick: () => {
              if (deleteTarget) {
                removeTask(deleteTarget.milestone.id, deleteTarget.task.id);
              }
              setDeleteTarget(null);
              setDeleteWord("");
            },
          }}
        />
      </AppDialog>

      <Sheet
        open={Boolean(editingTask)}
        onOpenChange={(open) => {
          if (!open) setSheet(null);
        }}
      >
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border p-5 pr-14">
            <SheetTitle className="font-heading text-lg font-semibold">
              {sheet?.mode === "edit"
                ? "Edit task"
                : (editingTask?.name ?? "Task details")}
            </SheetTitle>
            <SheetDescription>
              {editingMilestone?.title} · task {editingIndex + 1} of{" "}
              {editingCount}
            </SheetDescription>
          </SheetHeader>
          {editingTask && sheet ? (
            sheet.mode === "view" ? (
              <TaskDetails
                key={`${editingTask.id}-view`}
                task={editingTask}
                canMoveUp={editingIndex > 0}
                canMoveDown={editingIndex < editingCount - 1}
                onMove={(delta) =>
                  moveTask(
                    sheet,
                    sheet.milestoneId,
                    delta > 0 ? editingIndex + 2 : editingIndex - 1,
                  )
                }
                onEdit={() => setSheet({ ...sheet, mode: "edit" })}
              />
            ) : (
              <TaskPanel
                key={`${editingTask.id}-edit`}
                task={editingTask}
                onCancel={() => setSheet({ ...sheet, mode: "view" })}
                onSave={(patch) => {
                  updateTask(sheet, patch);
                  setSheet(null);
                }}
              />
            )
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        checked ? "bg-primary" : "bg-input",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-background shadow-sm transition-all",
          checked ? "left-6" : "left-0.5",
        )}
      />
    </button>
  );
}

function TaskDetails({
  task,
  canMoveUp,
  canMoveDown,
  onMove,
  onEdit,
}: {
  task: BlueprintTask;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (delta: number) => void;
  onEdit: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-muted-foreground">
              Description
            </p>
            <Button size="dialog-sm" onClick={onEdit}>
              <Pencil className="size-3.5" aria-hidden="true" />
              Edit
            </Button>
          </div>
          <p className="mt-1.5 text-sm">
            {task.description || "No description yet."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">Estimated hours</p>
            <p className="mt-1 font-mono text-sm tabular-nums">
              {task.hours} h
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">Visibility</p>
            <div className="mt-1">
              <StatusBadge tone={task.visible ? "accent" : "neutral"}>
                {task.visible ? "Client-visible" : "Internal"}
              </StatusBadge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border p-4">
        <Button
          variant="outline"
          size="dialog-sm"
          onClick={() => onMove(-1)}
          disabled={!canMoveUp}
        >
          <ChevronUp className="size-3.5" aria-hidden="true" />
          Move up
        </Button>
        <Button
          variant="outline"
          size="dialog-sm"
          onClick={() => onMove(1)}
          disabled={!canMoveDown}
        >
          <ChevronDown className="size-3.5" aria-hidden="true" />
          Move down
        </Button>
      </div>
    </div>
  );
}

function TaskPanel({
  task,
  onCancel,
  onSave,
}: {
  task: BlueprintTask;
  onCancel: () => void;
  onSave: (patch: Omit<BlueprintTask, "id">) => void;
}) {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [hours, setHours] = useState(String(task.hours));
  const [visible, setVisible] = useState(task.visible);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-[18px] overflow-y-auto p-5">
        <FormField
          id="panel-task-name"
          label="Task name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <FormTextarea
          id="panel-task-description"
          label="Task description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What done looks like"
        />
        <FormField
          id="panel-task-hours"
          label="Estimated hours"
          type="number"
          min={0}
          step={0.5}
          value={hours}
          onChange={(event) => setHours(event.target.value)}
          inputClassName="font-mono"
        />
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium">Client-visible</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Shows on the client&apos;s weekly board.
            </p>
          </div>
          <Toggle
            checked={visible}
            onChange={setVisible}
            label="Client-visible"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border p-4">
        <Button variant="outline" size="dialog" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="dialog"
          className="ml-auto"
          disabled={!name.trim()}
          onClick={() =>
            onSave({
              name: name.trim(),
              description: description.trim(),
              hours: Number(hours) || 0,
              visible,
            })
          }
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}

function AddTaskDialog({
  onAdd,
}: {
  onAdd: (task: Omit<BlueprintTask, "id">) => void;
}) {
  const [open, setOpen] = useState(false);
  const [drafts, setDrafts] = useState<Omit<BlueprintTask, "id">[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("8");
  const [visible, setVisible] = useState(true);

  const current = (): Omit<BlueprintTask, "id"> | null =>
    name.trim()
      ? {
          name: name.trim(),
          description: description.trim(),
          hours: Number(hours) || 0,
          visible,
        }
      : null;

  function clearFields() {
    setName("");
    setDescription("");
    setHours("8");
    setVisible(false);
  }

  function addAnother() {
    const task = current();
    if (!task) return;
    setDrafts((list) => [...list, task]);
    clearFields();
  }

  function submit() {
    const task = current();
    const all = task ? [...drafts, task] : drafts;
    if (all.length === 0) return;
    all.forEach(onAdd);
    setDrafts([]);
    clearFields();
    setOpen(false);
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setDrafts([]);
          clearFields();
        }
      }}
      trigger={
        <Button variant="outline" size="sm">
          <Plus className="size-3.5" aria-hidden="true" />
          Add task
        </Button>
      }
      size="lg"
    >
      <AppDialog.Header
        icon={Plus}
        title="Add tasks"
        subtitle="Add one task, or stack several before saving."
      />
      <AppDialog.Body>
        <form
          id="add-blueprint-task"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="flex flex-col gap-[18px]"
        >
          <div className="grid gap-[18px] sm:grid-cols-2">
            <FormField
              id="task-name"
              label="Task name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Import client records"
              className="sm:col-span-2"
            />
            <FormTextarea
              id="task-description"
              label="Task description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What done looks like"
              className="sm:col-span-2"
            />
            <FormField
              id="task-hours"
              label="Estimated hours"
              type="number"
              min={0}
              step={0.5}
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              inputClassName="font-mono"
            />
            <div className="space-y-2">
              <p className="text-[13px] font-medium text-foreground">
                Client-visible
              </p>
              <div className="flex h-11.5 items-center gap-3 rounded-[var(--radius-dialog-control)] border border-input bg-card px-3.5">
                <Toggle
                  checked={visible}
                  onChange={setVisible}
                  label="Client-visible"
                />
                <span className="text-xs text-muted-foreground">
                  {visible
                    ? "On · shows on the client board"
                    : "Off · internal only"}
                </span>
              </div>
            </div>
          </div>

          {drafts.length > 0 ? (
            <ul className="space-y-2 rounded-lg border border-border bg-secondary/40 p-3">
              {drafts.map((draft, index) => (
                <li
                  key={`${draft.name}-${index}`}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{draft.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {draft.hours} h
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${draft.name}`}
                    onClick={() =>
                      setDrafts((list) =>
                        list.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}

          <div>
            <Button
              type="button"
              variant="outline"
              size="dialog-sm"
              onClick={addAnother}
              disabled={!name.trim()}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Add another task
            </Button>
          </div>
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        secondary={{ label: "Cancel" }}
        primary={{
          label:
            drafts.length > 0
              ? `Add ${drafts.length + (name.trim() ? 1 : 0)} tasks`
              : "Add task",
          type: "submit",
          form: "add-blueprint-task",
          disabled: !name.trim() && drafts.length === 0,
        }}
      />
    </AppDialog>
  );
}
