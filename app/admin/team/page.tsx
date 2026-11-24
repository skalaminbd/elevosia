import type { Metadata } from "next";
import { Suspense } from "react";
import { TeamData } from "@/components/admin/team/TeamData";

export const metadata: Metadata = {
  title: "Team management | Elevosia Admin",
};

export default function TeamPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 h-96 rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <TeamData />
    </Suspense>
  );
}
