import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { PortalAccountView } from "@/components/portal/PortalAccountView";
import {
  getClient,
  listClientNotificationPrefs,
  listPortalUsers,
} from "@/db/queries";
import { requirePortalClientId } from "@/lib/portal-session";

export const metadata: Metadata = {
  title: "Account | Elevosia client portal",
};

async function AccountLoader() {
  await connection();
  const clientId = await requirePortalClientId();
  const [client, team, prefs] = await Promise.all([
    getClient(clientId),
    listPortalUsers(clientId),
    listClientNotificationPrefs(clientId),
  ]);
  if (!client) notFound();
  return <PortalAccountView client={client} team={team} prefs={prefs} />;
}

export default function PortalAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <div className="h-72 rounded-lg border border-border bg-card" />
            <div className="h-72 rounded-lg border border-border bg-card" />
          </div>
        </div>
      }
    >
      <AccountLoader />
    </Suspense>
  );
}
