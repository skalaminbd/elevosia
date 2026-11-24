"use client";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { portalClient } from "@/lib/portal-data";
import { authClient } from "@/lib/auth-client";
import { usePortalContext } from "@/hooks/use-portal-context";

/** Greeting that follows the signed-in client when there is one. */
export function PortalHomeHeader({
  projectName,
  phase,
  meta,
}: {
  projectName: string;
  phase: string;
  meta: string;
}) {
  const { data: authData } = authClient.useSession();
  const authUser = authData?.user as { name?: string } | undefined;
  const context = usePortalContext();
  const firstName = authUser?.name
    ? authUser.name.split(" ")[0]
    : portalClient.firstName;
  const company = context.company || portalClient.company;

  return (
    <PageHeader
      title={`Welcome back, ${firstName}`}
      meta={meta}
      description={`${company} · ${projectName}, ${phase}.`}
    />
  );
}
