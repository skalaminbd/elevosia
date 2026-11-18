import type { Metadata } from "next";
import { ProfileView } from "@/components/shared/ProfileView";
import { adminProfile } from "@/lib/profile-data";

export const metadata: Metadata = {
  title: "Profile | Elevosia Admin",
};

export default function AdminProfilePage() {
  return <ProfileView profile={adminProfile} />;
}
