"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TicketHeader } from "@/components/admin/tickets/TicketHeader";
import { TicketConversation } from "@/components/admin/tickets/TicketConversation";
import { TicketSidebar } from "@/components/admin/tickets/TicketSidebar";
import { updateTicket } from "@/app/admin/tickets/actions";
import type { TicketRecord } from "@/lib/tickets/types";

/** Single-column ticket page: header, conversation, composer. */
export function TicketWorkspace({
  initialTicket,
}: {
  initialTicket: TicketRecord;
}) {
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketRecord>(initialTicket);

  function patch(next: Partial<TicketRecord>) {
    setTicket((current) => ({ ...current, ...next }));
    void updateTicket({ id: initialTicket.id, patch: next }).then((result) => {
      if (!result.ok) {
        toast.error(result.error);
        router.refresh();
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="grid gap-4 lg:h-[calc(100dvh-3.5rem)] lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card">
          <TicketHeader ticket={ticket} onPatch={patch} />
          <TicketConversation ticket={ticket} onPatch={patch} />
        </div>
        <aside className="hidden min-h-0 lg:flex lg:flex-col">
          <TicketSidebar ticket={ticket} />
        </aside>
      </div>
    </div>
  );
}
