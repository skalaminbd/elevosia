import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { TaskDetail } from "@/components/admin/tasks/TaskDetail";
import { getTaskDetail } from "@/db/queries";
import { adminTasks } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return adminTasks.map((task) => ({ id: task.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} | Elevosia Admin` };
}

async function TaskLoader({ id }: { id: string }) {
  await connection();
  const data = await getTaskDetail(id);
  if (!data) notFound();
  return <TaskDetail data={data} />;
}

export default async function TaskDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-3 w-24 rounded bg-secondary" />
          <div className="mt-4 h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 h-12 rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <TaskLoader id={id} />
    </Suspense>
  );
}
