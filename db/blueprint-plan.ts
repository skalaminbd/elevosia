/** Writes a full Blueprint plan to Postgres (milestones, tasks, order). */

import { and, eq, notInArray, sql } from "drizzle-orm";
import { db } from "./index";
import {
  blueprintMilestones,
  blueprintTasks,
  blueprints,
} from "./schema";

export type PlanMilestone = {
  id: string;
  title: string;
  tasks: {
    id: string;
    name: string;
    description: string;
    hours: number;
    visible: boolean;
  }[];
};

export async function applyBlueprintPlan(
  blueprintId: string,
  milestones: PlanMilestone[],
) {
  for (const [position, milestone] of milestones.entries()) {
    await db
      .insert(blueprintMilestones)
      .values({
        id: milestone.id,
        blueprintId,
        title: milestone.title,
        position,
      })
      .onConflictDoUpdate({
        target: blueprintMilestones.id,
        set: { title: milestone.title, position },
      });

    if (milestone.tasks.length > 0) {
      await db
        .insert(blueprintTasks)
        .values(
          milestone.tasks.map((task, taskIndex) => ({
            id: task.id,
            milestoneId: milestone.id,
            name: task.name,
            description: task.description,
            hours: Math.round(task.hours),
            visible: task.visible,
            position: taskIndex,
          })),
        )
        .onConflictDoUpdate({
          target: blueprintTasks.id,
          set: {
            name: sql`excluded.name`,
            description: sql`excluded.description`,
            hours: sql`excluded.hours`,
            visible: sql`excluded.visible`,
            position: sql`excluded.position`,
          },
        });
    }

    const taskIds = milestone.tasks.map((task) => task.id);
    if (taskIds.length > 0) {
      await db
        .delete(blueprintTasks)
        .where(
          and(
            eq(blueprintTasks.milestoneId, milestone.id),
            notInArray(blueprintTasks.id, taskIds),
          ),
        );
    } else {
      await db
        .delete(blueprintTasks)
        .where(eq(blueprintTasks.milestoneId, milestone.id));
    }
  }

  const milestoneIds = milestones.map((milestone) => milestone.id);
  if (milestoneIds.length > 0) {
    await db
      .delete(blueprintMilestones)
      .where(
        and(
          eq(blueprintMilestones.blueprintId, blueprintId),
          notInArray(blueprintMilestones.id, milestoneIds),
        ),
      );
  } else {
    await db
      .delete(blueprintMilestones)
      .where(eq(blueprintMilestones.blueprintId, blueprintId));
  }

  await db
    .update(blueprints)
    .set({ milestoneCount: milestones.length })
    .where(eq(blueprints.id, blueprintId));
}
