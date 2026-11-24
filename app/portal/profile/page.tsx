import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { ProfileView } from "@/components/shared/ProfileView";
import { getClient } from "@/db/queries";
import { clientProfile, type Profile } from "@/lib/profile-data";
import { requirePortalClientId } from "@/lib/portal-session";

export const metadata: Metadata = {
  title: "Profile | Elevosia client portal",
};

async function ProfileLoader() {
  await connection();
  const clientId = await requirePortalClientId();
  const client = await getClient(clientId);
  if (!client) return null;

  const profile: Profile = {
    ...clientProfile,
    details: {
      ...clientProfile.details,
      name: client.contact || clientProfile.details.name,
      initials: client.initials || clientProfile.details.initials,
      role: `Owner, ${client.name}`,
      availability: client.status === "Active" ? "Active client" : client.status,
    },
    address: {
      ...clientProfile.address,
      street: client.companies[0]?.address || clientProfile.address.street,
      city: client.companies[0]?.city || clientProfile.address.city,
      region: client.companies[0]?.region || clientProfile.address.region,
      postal: client.companies[0]?.zip || clientProfile.address.postal,
    },
  };

  return <ProfileView profile={profile} />;
}

export default function PortalProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="h-8 w-64 rounded bg-secondary" />
          <div className="mt-6 h-72 rounded-lg border border-border bg-card" />
        </div>
      }
    >
      <ProfileLoader />
    </Suspense>
  );
}
