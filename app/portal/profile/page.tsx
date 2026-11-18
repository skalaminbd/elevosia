import type { Metadata } from "next";
import { ProfileView } from "@/components/shared/ProfileView";
import { clientProfile } from "@/lib/profile-data";

export const metadata: Metadata = {
  title: "Profile | Elevosia client portal",
};

export default function PortalProfilePage() {
  return <ProfileView profile={clientProfile} />;
}
