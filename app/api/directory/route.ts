import { NextResponse } from "next/server";
import { listBlueprintRows, listClients, listProjects } from "@/db/queries";

/** Client, project and Blueprint options for the create dialogs. */
export async function GET() {
  const [clients, projects, blueprints] = await Promise.all([
    listClients(),
    listProjects(),
    listBlueprintRows(),
  ]);

  return NextResponse.json({
    clients: clients.map((client) => ({
      id: client.id,
      name: client.name,
      companies: client.companies.map((company) => ({
        name: company.name,
        city: company.city,
      })),
    })),
    projects: projects.map((project) => ({
      id: project.id,
      name: project.name,
      client: project.client,
    })),
    blueprints: blueprints.map((blueprint) => ({
      id: blueprint.id,
      client: blueprint.client,
      title: blueprint.title,
      status: blueprint.status,
      price: blueprint.price,
    })),
  });
}
