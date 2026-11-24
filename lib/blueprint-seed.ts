/** Milestone task names seeded for every Blueprint. */

export const MILESTONE_TASKS = [
  ["Discovery workshop", "Roles and visit types", "Data import"],
  ["Weekly board", "Auto-fill rules", "Caregiver phone view"],
  ["Client records", "Family access", "Care plan fields"],
  ["Invoices", "Reminders", "Exports"],
  ["Training", "Migration checks", "Launch"],
];

export function buildMilestones(count: number) {
  return Array.from({ length: count }).map((_, index) => {
    const names = MILESTONE_TASKS[index] ?? MILESTONE_TASKS[0];
    return {
      id: `milestone-${index + 1}`,
      title: `Milestone ${index + 1}`,
      tasks: names.map((name, taskIndex) => ({
        id: `milestone-${index + 1}-task-${taskIndex + 1}`,
        name,
        description: "",
        hours: 8 + taskIndex * 2,
        visible: true,
      })),
    };
  });
}
