import { connection } from "next/server";
import { UserPlus, Users, Wallet } from "lucide-react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { ClientsTable } from "@/components/admin/clients/ClientsTable";
import { listClients } from "@/db/queries";

/** Clients from Postgres, read at request time. */
export async function ClientsData() {
  await connection();
  const clients = await listClients();

  const active = clients.filter((client) => client.status === "Active").length;
  const leads = clients.filter(
    (client) => client.status === "Lead" || client.status === "Onboarding",
  ).length;
  const balance = clients.reduce((total, client) => total + client.balance, 0);
  const withBalance = clients.filter((client) => client.balance > 0).length;

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-3">
        <StatCard
          label="Active clients"
          value={active}
          note={`${leads} onboarding or lead`}
          icon={Users}
        />
        <StatCard
          label="Leads"
          value={leads}
          note="From the website and referrals"
          icon={UserPlus}
        />
        <StatCard
          label="Balance due"
          value={`$${balance.toLocaleString("en-US")}`}
          note={`${withBalance} clients with an open balance`}
          icon={Wallet}
          tone="warning"
        />
      </div>

      <div className="mt-4">
        <ClientsTable clients={clients} />
      </div>
    </>
  );
}
