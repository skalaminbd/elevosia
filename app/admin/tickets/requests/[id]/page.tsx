import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { WorkRequestDetail } from "@/components/admin/tickets/WorkRequestDetail";
import { getWorkRequest } from "@/db/queries";
import { workRequests } from "@/lib/admin-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return workRequests.map((request) => ({ id: request.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} | Elevosia Admin` };
}

async function RequestLoader({ id }: { id: string }) {
  await connection();
  const request = await getWorkRequest(id);
  if (!request) notFound();
  return <WorkRequestDetail request={request} />;
}

export default async function WorkRequestPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-3 w-28 rounded bg-secondary" />
          <div className="mt-4 h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 h-12 rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <RequestLoader id={id} />
    </Suspense>
  );
}
