import { connection } from "next/server";
import { MessageSquare, MessagesSquare, Users } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { MessagesView } from "@/components/admin/messages/MessagesView";
import { listThreads } from "@/db/queries";

/** Client threads from Postgres, read at request time. */
export async function MessagesData() {
  await connection();
  const threads = await listThreads();
  const unread = threads.reduce((total, thread) => total + thread.unread, 0);
  const firstUnread = threads.find((thread) => thread.unread > 0);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Unread"
          value={unread}
          note={firstUnread?.client ?? "All caught up"}
          icon={MessageSquare}
        />
        <StatCard
          label="Open threads"
          value={threads.length}
          note={`Across ${new Set(threads.map((thread) => thread.client)).size} clients`}
          icon={MessagesSquare}
        />
        <StatCard
          label="Avg reply today"
          value="38 min"
          note="Inside care plan"
          icon={Users}
        />
      </div>

      <div className="mt-4">
        <MessagesView threads={threads} />
      </div>
    </>
  );
}
