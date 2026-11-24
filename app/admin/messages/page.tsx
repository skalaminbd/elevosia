import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { MessagesData } from "@/components/admin/messages/MessagesData";

export const metadata: Metadata = {
  title: "Messages | Elevosia Admin",
};

export default function MessagesPage() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Messages"
        meta="Support"
        description="Client threads stay in the portal. Internal notes never leave the team."
      />

      <Suspense
        fallback={
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-lg border border-border bg-card"
                />
              ))}
            </div>
            <div className="h-96 rounded-lg border border-border bg-card" />
          </div>
        }
      >
        <MessagesData />
      </Suspense>
    </div>
  );
}
