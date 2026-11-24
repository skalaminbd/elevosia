/**
 * Server-side reads for the pilot module. Every page that calls these must
 * await connection() inside a Suspense boundary (Cache Components is on).
 */

import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";
import { db } from "./index";
import {
  activities,
  blueprintMilestones,
  blueprintSuggestions,
  blueprintTasks,
  blueprints as blueprintsTable,
  callNotes,
  calls,
  campaigns,
  clientCompanies,
  clients,
  contractTemplates,
  contracts,
  deletionRequests,
  files,
  handoverItems,
  helpArticles,
  installments,
  invoices,
  marketingStats,
  notificationSettings,
  clientNotificationPrefs,
  healthRules,
  taskChecklistItems,
  taskComments,
  projectAccess,
  projectChanges,
  projectMilestones,
  projectScopePoints,
  projectScopes,
  projectTasks,
  projects,
  approvalHistory,
  retainers,
  retainerWork,
  portalApprovals,
  portalCalls,
  portalReports,
  portalUsers,
  requirementPoints,
  requirementReviews,
  requirementSections,
  requirements,
  tasks,
  teamMembers,
  threads,
  threadMessages,
  ticketEvents,
  ticketMessages,
  tickets,
  timesheets,
  workRequests,
} from "./schema";
import type {
  AdminClient,
  AdminProject,
  AdminTask,
  Blueprint,
  CallRecord,
  Requirement,
  RequirementStatus,
  TaskStatus,
  ProjectHealth,
  Thread,
} from "@/lib/admin-data";
import {
  permissionsFor,
  type TeamMember,
  type TeamRole,
} from "@/lib/team-data";
import type {
  CarePlan,
  TicketCategory,
  TicketChannel,
  TicketEvent,
  TicketEventKind,
  TicketLinkedItem,
  TicketMessage,
  TicketPerson,
  TicketPriority,
  TicketRating,
  TicketRecord,
  TicketSender,
  TicketSla,
  TicketStatus,
} from "@/lib/tickets/types";
import type { WorkRequest } from "@/lib/admin-data";

export type RequirementReviewState = {
  status: string | null;
  reviews: {
    sectionKey: string;
    pointIndex: number;
    milestoneId: string | null;
    state: string;
  }[];
};

export async function getRequirementReviewState(
  requirementId: string,
): Promise<RequirementReviewState> {
  const [requirement] = await db
    .select({ status: requirements.status })
    .from(requirements)
    .where(eq(requirements.id, requirementId));

  const reviews = await db
    .select({
      sectionKey: requirementReviews.sectionKey,
      pointIndex: requirementReviews.pointIndex,
      milestoneId: requirementReviews.milestoneId,
      state: requirementReviews.state,
    })
    .from(requirementReviews)
    .where(eq(requirementReviews.requirementId, requirementId));

  return { status: requirement?.status ?? null, reviews };
}

export type ScopePointRow = {
  requirementId: string;
  requirementTitle: string;
  sectionKey: string;
  pointIndex: number;
  milestoneId: string;
  text: string;
  mustHave: boolean;
};

/** Approved requirement points attached to a Blueprint's milestones. */
export async function getApprovedScopeRows(
  blueprintId: string,
): Promise<ScopePointRow[]> {
  const rows = await db
    .select({
      requirementId: requirementReviews.requirementId,
      requirementTitle: requirements.title,
      sectionKey: requirementReviews.sectionKey,
      pointIndex: requirementReviews.pointIndex,
      milestoneId: requirementReviews.milestoneId,
      text: requirementPoints.text,
      mustHave: requirementPoints.mustHave,
    })
    .from(requirementReviews)
    .innerJoin(
      requirements,
      eq(requirements.id, requirementReviews.requirementId),
    )
    .innerJoin(
      requirementSections,
      and(
        eq(requirementSections.requirementId, requirementReviews.requirementId),
        eq(requirementSections.sectionKey, requirementReviews.sectionKey),
      ),
    )
    .innerJoin(
      requirementPoints,
      and(
        eq(requirementPoints.sectionId, requirementSections.id),
        eq(requirementPoints.position, requirementReviews.pointIndex),
      ),
    )
    .where(
      and(
        eq(requirementReviews.blueprintId, blueprintId),
        eq(requirementReviews.state, "approved"),
      ),
    )
    .orderBy(asc(requirementReviews.sectionKey), asc(requirementReviews.pointIndex));

  return rows
    .filter(
      (row): row is ScopePointRow =>
        row.milestoneId !== null && row.text !== null,
    );
}

export type ProjectDetail = {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  blueprintId: string | null;
  pm: string;
  status: string;
  startDate: string | null;
  milestones: {
    id: string;
    title: string;
    dueOn: string | null;
    tasks: {
      id: string;
      name: string;
      description: string;
      hours: number;
      visible: boolean;
      done: boolean;
      week: string;
      state: string;
      assignee: string;
    }[];
  }[];
  scope: {
    requirementId: string;
    requirementTitle: string;
    blueprintId: string;
    approvedAt: Date;
    invoiceId: string | null;
    invoiceAmountCents: number | null;
    points: {
      text: string;
      mustHave: boolean;
      milestoneId: string;
      milestoneTitle: string;
    }[];
  } | null;
};

export async function getProjectDetail(
  projectId: string,
): Promise<ProjectDetail | null> {
  const [row] = await db
    .select({
      id: projects.id,
      name: projects.name,
      clientId: projects.clientId,
      clientName: clients.name,
      blueprintId: projects.blueprintId,
      pm: projects.pm,
      status: projects.status,
      startDate: projects.startDate,
    })
    .from(projects)
    .innerJoin(clients, eq(clients.id, projects.clientId))
    .where(eq(projects.id, projectId));

  if (!row) return null;

  const milestoneRows = await db
    .select({
      id: projectMilestones.id,
      title: projectMilestones.title,
      dueOn: projectMilestones.dueOn,
    })
    .from(projectMilestones)
    .where(eq(projectMilestones.projectId, projectId))
    .orderBy(asc(projectMilestones.position));

  const milestoneIds = milestoneRows.map((milestone) => milestone.id);
  const taskRows = milestoneIds.length
    ? await db
        .select({
          id: projectTasks.id,
          milestoneId: projectTasks.milestoneId,
          name: projectTasks.name,
          description: projectTasks.description,
          hours: projectTasks.hours,
          visible: projectTasks.visible,
          done: projectTasks.done,
          week: projectTasks.week,
          state: projectTasks.state,
          assignee: projectTasks.assignee,
        })
        .from(projectTasks)
        .where(inArray(projectTasks.milestoneId, milestoneIds))
        .orderBy(asc(projectTasks.position))
    : [];

  const [scopeRow] = await db
    .select({
      requirementId: projectScopes.requirementId,
      requirementTitle: projectScopes.requirementTitle,
      blueprintId: projectScopes.blueprintId,
      approvedAt: projectScopes.approvedAt,
      invoiceId: projectScopes.invoiceId,
      invoiceAmountCents: invoices.amountCents,
    })
    .from(projectScopes)
    .leftJoin(invoices, eq(invoices.id, projectScopes.invoiceId))
    .where(eq(projectScopes.projectId, projectId));

  const scopePointRows = scopeRow
    ? await db
        .select({
          text: projectScopePoints.text,
          mustHave: projectScopePoints.mustHave,
          milestoneId: projectScopePoints.milestoneId,
          milestoneTitle: projectScopePoints.milestoneTitle,
        })
        .from(projectScopePoints)
        .where(eq(projectScopePoints.projectId, projectId))
        .orderBy(asc(projectScopePoints.position))
    : [];

  return {
    ...row,
    milestones: milestoneRows.map((milestone) => ({
      ...milestone,
      tasks: taskRows
        .filter((task) => task.milestoneId === milestone.id)
        .map((task) => ({
          id: task.id,
          name: task.name,
          description: task.description,
          hours: task.hours,
          visible: task.visible,
          done: task.done,
          week: task.week,
          state: task.state,
          assignee: task.assignee,
        })),
    })),
    scope: scopeRow
      ? { ...scopeRow, points: scopePointRows }
      : null,
  };
}

export type InvoiceRow = {
  id: string;
  client: string;
  kind: string;
  amount: number;
  due: string;
  status: string;
};

export async function listInvoices(): Promise<InvoiceRow[]> {
  const rows = await db
    .select({
      id: invoices.id,
      client: clients.name,
      kind: invoices.kind,
      amountCents: invoices.amountCents,
      dueLabel: invoices.dueLabel,
      status: invoices.status,
    })
    .from(invoices)
    .innerJoin(clients, eq(clients.id, invoices.clientId))
    .orderBy(desc(invoices.createdAt));

  return rows.map((row) => ({
    id: row.id,
    client: row.client,
    kind: row.kind,
    amount: row.amountCents / 100,
    due: row.dueLabel,
    status: row.status,
  }));
}

export type ContractRow = {
  id: string;
  clientId: string;
  client: string;
  projectId: string | null;
  projectName: string | null;
  type: string;
  status: string;
  signedOn: string | null;
  createdAt: string;
};

export async function listContracts(): Promise<ContractRow[]> {
  const rows = await db
    .select({
      id: contracts.id,
      clientId: contracts.clientId,
      client: clients.name,
      projectId: contracts.projectId,
      projectName: projects.name,
      type: contracts.type,
      status: contracts.status,
      signedOn: contracts.signedOn,
      createdAt: contracts.createdAt,
    })
    .from(contracts)
    .innerJoin(clients, eq(clients.id, contracts.clientId))
    .leftJoin(projects, eq(projects.id, contracts.projectId))
    .orderBy(desc(contracts.createdAt));

  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getContract(id: string): Promise<ContractRow | null> {
  const rows = await listContracts();
  return rows.find((row) => row.id === id) ?? null;
}

export type ContractTemplateRow = {
  id: string;
  name: string;
  body: string;
  used: number;
  updated: string;
};

export async function listContractTemplates(): Promise<ContractTemplateRow[]> {
  const rows = await db
    .select()
    .from(contractTemplates)
    .orderBy(asc(contractTemplates.id));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    body: row.body,
    used: row.usedCount,
    updated: row.updatedOn ?? "—",
  }));
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function shortDate(value: string | null): string {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export async function listClients(): Promise<AdminClient[]> {
  const rows = await db.select().from(clients);
  const companies = await db
    .select()
    .from(clientCompanies)
    .orderBy(asc(clientCompanies.position));
  const projectRows = await db
    .select({ clientId: projects.clientId })
    .from(projects);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    companies: companies
      .filter((company) => company.clientId === row.id)
      .map((company) => ({
        name: company.name,
        address: company.address,
        city: company.city,
        region: company.region,
        zip: company.zip,
        phone: company.phone,
        website: company.website,
      })),
    initials: row.initials || initialsOf(row.name),
    industry: row.industry,
    contact: row.contact,
    email: row.email,
    phone: row.phone,
    clientSince: row.clientSince ?? "",
    status: row.status as AdminClient["status"],
    source: row.source,
    since: row.sinceLabel,
    projects: projectRows.filter((project) => project.clientId === row.id)
      .length,
    plan: row.plan,
    balance: row.balanceCents / 100,
    pm: row.pm,
    timezone: row.timezone,
  }));
}

export async function getClient(id: string): Promise<AdminClient | null> {
  const all = await listClients();
  return all.find((client) => client.id === id) ?? null;
}

export async function listProjects(): Promise<AdminProject[]> {
  const rows = await db
    .select({ project: projects, client: clients.name })
    .from(projects)
    .innerJoin(clients, eq(clients.id, projects.clientId))
    .orderBy(asc(projects.createdAt));

  return rows.map(({ project, client }) => ({
    id: project.id,
    client,
    name: project.name,
    status: project.status,
    health: project.health as ProjectHealth,
    progress: project.progress,
    due: project.dueLabel,
    pm: project.pm,
    price: project.priceCents / 100,
    used: project.usedCents / 100,
    modules: project.modules,
  }));
}

export async function listTasks(): Promise<AdminTask[]> {
  const rows = await db
    .select({
      task: tasks,
      client: clients.name,
      project: projects.name,
    })
    .from(tasks)
    .leftJoin(clients, eq(clients.id, tasks.clientId))
    .leftJoin(projects, eq(projects.id, tasks.projectId));

  return rows.map(({ task, client, project }) => ({
    id: task.id,
    title: task.title,
    project: project ?? task.milestone ?? "",
    client: client ?? "",
    assignee: task.assignee,
    reviewer: task.reviewer ?? undefined,
    milestone: task.milestone ?? undefined,
    linked:
      task.linkedId && task.linkedType
        ? {
            type: task.linkedType as "Ticket" | "Work request",
            id: task.linkedId,
            title: task.linkedTitle ?? "",
          }
        : undefined,
    week: task.week,
    status: task.status as TaskStatus,
    due: task.dueLabel,
    priority: task.priority as "High" | "Normal",
    estimate: task.estimate,
    logged: task.logged,
    clientVisible: task.clientVisible,
  }));
}

export async function listRequirements(): Promise<Requirement[]> {
  const rows = await db
    .select({ requirement: requirements, client: clients.name })
    .from(requirements)
    .innerJoin(clients, eq(clients.id, requirements.clientId));

  return rows.map(({ requirement, client }) => ({
    id: requirement.id,
    client,
    title: requirement.title,
    submitted: shortDate(requirement.submittedOn),
    due: shortDate(requirement.dueOn),
    overdue: requirement.overdue,
    status: requirement.status as RequirementStatus,
    points: requirement.pointsCount,
    budget: requirement.budget,
  }));
}

export async function listBlueprintRows(): Promise<Blueprint[]> {
  const rows = await db
    .select({ blueprint: blueprintsTable, client: clients.name })
    .from(blueprintsTable)
    .innerJoin(clients, eq(clients.id, blueprintsTable.clientId));

  return rows.map(({ blueprint, client }) => ({
    id: blueprint.id,
    client,
    title: blueprint.title,
    status: blueprint.status as Blueprint["status"],
    version: blueprint.version,
    validUntil: blueprint.validUntil
      ? new Date(`${blueprint.validUntil}T00:00:00`).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—",
    price: blueprint.priceCents / 100,
    milestones: blueprint.milestoneCount,
  }));
}

export async function listCalls(): Promise<CallRecord[]> {
  const rows = await db
    .select({ call: calls, client: clients.name })
    .from(calls)
    .leftJoin(clients, eq(clients.id, calls.clientId))
    .orderBy(asc(calls.position));

  return rows.map(({ call, client }) => ({
    id: call.id,
    day: call.dayLabel,
    time: call.timeLabel,
    title: call.title,
    client: client ?? "Internal",
    kind: call.kind as CallRecord["kind"],
    owner: call.owner,
  }));
}

export type TeamRow = {
  id: string;
  name: string;
  role: string;
  initials: string;
  planned: number;
  capacity: number;
  projects: number;
};

export async function listTeam(): Promise<TeamRow[]> {
  const rows = await db.select().from(teamMembers);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    role: row.role,
    initials: row.initials,
    planned: row.planned,
    capacity: row.capacity,
    projects: row.projectCount,
  }));
}

export async function getTicketCounts(): Promise<{
  open: number;
  breached: number;
}> {
  const rows = await db
    .select({ status: tickets.status, sla: tickets.sla })
    .from(tickets);
  const open = rows.filter(
    (row) => row.status !== "Resolved" && row.status !== "Closed",
  );
  const now = new Date().toISOString();
  const breached = open.filter((row) => {
    const sla = row.sla as { resolutionDue?: string } | null;
    return Boolean(sla?.resolutionDue && sla.resolutionDue < now);
  }).length;
  return { open: open.length, breached };
}

export async function listThreads(): Promise<Thread[]> {
  const rows = await db
    .select({ thread: threads, client: clients.name })
    .from(threads)
    .leftJoin(clients, eq(clients.id, threads.clientId))
    .where(eq(threads.scope, "admin"))
    .orderBy(asc(threads.position));
  const messages = await db
    .select()
    .from(threadMessages)
    .orderBy(asc(threadMessages.position));

  return rows.map(({ thread, client }) => ({
    id: thread.id,
    client: client ?? "Internal",
    preview: thread.preview,
    time: thread.timeLabel,
    unread: thread.unread,
    messages: messages
      .filter((message) => message.threadId === thread.id)
      .map((message) => ({
        id: message.id,
        from: message.author,
        self: message.self,
        body: message.body,
        time: message.timeLabel,
      })),
  }));
}

export type FileRow = {
  id: string;
  name: string;
  folder: string;
  client: string;
  size: string;
  updated: string;
  visible: boolean;
};

export type FolderRow = { id: string; label: string; count: number };

export async function listFiles(): Promise<{
  files: FileRow[];
  folders: FolderRow[];
}> {
  const rows = await db
    .select({ file: files, client: clients.name })
    .from(files)
    .leftJoin(clients, eq(clients.id, files.clientId))
    .orderBy(asc(files.position));

  const fileRows: FileRow[] = rows.map(({ file, client }) => ({
    id: file.id,
    name: file.name,
    folder: file.folder,
    client: client ?? "Internal",
    size: file.sizeLabel,
    updated: file.updatedLabel,
    visible: file.visible,
  }));

  const folderMap = new Map<string, number>();
  for (const file of fileRows) {
    folderMap.set(file.folder, (folderMap.get(file.folder) ?? 0) + 1);
  }
  const folders: FolderRow[] = [...folderMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, count]) => ({
      id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label,
      count,
    }));

  return { files: fileRows, folders };
}

export type CampaignRow = {
  id: string;
  name: string;
  channel: string;
  status: string;
  due: string;
  owner: string;
  progress: number;
};

export async function listCampaigns(): Promise<CampaignRow[]> {
  const rows = await db.select().from(campaigns).orderBy(asc(campaigns.id));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    channel: row.channel,
    status: row.status,
    due: row.dueLabel,
    owner: row.owner,
    progress: row.progress,
  }));
}

export async function listTeamMembers(): Promise<TeamMember[]> {
  const rows = await db.select().from(teamMembers).orderBy(asc(teamMembers.id));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email ?? "",
    initials: row.initials,
    role: row.role as TeamRole,
    status: row.status as "active" | "disabled",
    access: (row.access as string[] | null) ?? [],
    lastActive: row.lastActive ?? "",
    added: row.added ?? "",
    permissions: permissionsFor(row.role as TeamRole),
  }));
}

export async function listTickets(): Promise<TicketRecord[]> {
  const rows = await db
    .select({ ticket: tickets, client: clients })
    .from(tickets)
    .leftJoin(clients, eq(clients.id, tickets.clientId))
    .orderBy(desc(tickets.updatedAt));
  const messageRows = await db.select().from(ticketMessages);
  const eventRows = await db.select().from(ticketEvents);

  return rows.map(({ ticket, client }) => {
    const requester: TicketPerson =
      (ticket.requester as TicketPerson | null) ?? {
        name: client?.contact ?? "",
        email: client?.email ?? "",
        role: "Owner",
      };

    const messages: TicketMessage[] = messageRows
      .filter((message) => message.ticketId === ticket.id)
      .sort((a, b) => a.at.getTime() - b.at.getTime())
      .map((message) => ({
        id: message.id,
        author: message.author,
        sender: message.sender as TicketSender,
        channel: message.channel as TicketChannel,
        body: message.body,
        at: message.at.toISOString(),
        internal: message.internal,
        unread: message.unread,
      }));

    const events: TicketEvent[] = eventRows
      .filter((event) => event.ticketId === ticket.id)
      .sort((a, b) => a.at.getTime() - b.at.getTime())
      .map((event) => ({
        id: event.id,
        kind: event.kind as TicketEventKind,
        text: event.text,
        at: event.at.toISOString(),
        actor: event.actor,
      }));

    return {
      id: ticket.id,
      subject: ticket.subject,
      description: ticket.description,
      requester,
      client: {
        id: ticket.clientId ?? undefined,
        company: client?.name ?? "",
        contact: requester.name,
        email: requester.email,
        carePlan: (ticket.carePlan || "None") as CarePlan,
      },
      project: ticket.projectLabel,
      channel: ticket.channel as TicketChannel,
      status: ticket.status as TicketStatus,
      priority: ticket.priority as TicketPriority,
      category: ticket.category as TicketCategory,
      assignee: ticket.assignee,
      followers: (ticket.followers as string[] | null) ?? [],
      cc: (ticket.cc as TicketPerson[] | null) ?? [],
      tags: (ticket.tags as string[] | null) ?? [],
      warranty: ticket.warranty,
      billableHours: ticket.billableHours,
      sla: (ticket.sla as TicketSla | null) ?? {
        firstResponseDue: ticket.updatedAt.toISOString(),
        resolutionDue: ticket.updatedAt.toISOString(),
      },
      linked: (ticket.linked as TicketLinkedItem[] | null) ?? [],
      rating: (ticket.rating as TicketRating | null) ?? undefined,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      unread: ticket.unread,
      messages,
      events,
    };
  });
}

export async function getTicket(id: string): Promise<TicketRecord | null> {
  const all = await listTickets();
  return all.find((ticket) => ticket.id === id) ?? null;
}

export async function listWorkRequests(): Promise<WorkRequest[]> {
  const rows = await db
    .select({ request: workRequests, client: clients.name })
    .from(workRequests)
    .leftJoin(clients, eq(clients.id, workRequests.clientId))
    .orderBy(desc(workRequests.submittedLabel));

  return rows.map(({ request, client }) => ({
    id: request.id,
    client: client ?? "",
    title: request.title,
    detail: request.detail,
    hours: request.hours,
    submitted: request.submittedLabel,
    status: request.status as WorkRequest["status"],
    pm: request.pm,
  }));
}

export async function getWorkRequest(
  id: string,
): Promise<WorkRequest | null> {
  const all = await listWorkRequests();
  return all.find((request) => request.id === id) ?? null;
}

export async function getTask(id: string): Promise<AdminTask | null> {
  const all = await listTasks();
  return all.find((task) => task.id === id) ?? null;
}

export type InvoiceDetailRow = {
  id: string;
  client: string;
  kind: string;
  amount: number;
  due: string;
  status: string;
  projectName: string | null;
};

export async function getInvoice(
  id: string,
): Promise<InvoiceDetailRow | null> {
  const rows = await db
    .select({
      id: invoices.id,
      client: clients.name,
      kind: invoices.kind,
      amountCents: invoices.amountCents,
      dueLabel: invoices.dueLabel,
      status: invoices.status,
      projectName: projects.name,
    })
    .from(invoices)
    .innerJoin(clients, eq(clients.id, invoices.clientId))
    .leftJoin(projects, eq(projects.id, invoices.projectId))
    .where(eq(invoices.id, id));

  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    client: row.client,
    kind: row.kind,
    amount: row.amountCents / 100,
    due: row.dueLabel,
    status: row.status,
    projectName: row.projectName,
  };
}

export type InstallmentRow = {
  id: string;
  client: string;
  total: number;
  paid: number;
  next: string;
  months: number;
  missed: number;
};

export async function listInstallments(): Promise<InstallmentRow[]> {
  const rows = await db
    .select({ plan: installments, client: clients.name })
    .from(installments)
    .leftJoin(clients, eq(clients.id, installments.clientId))
    .orderBy(asc(installments.id));

  return rows.map(({ plan, client }) => ({
    id: plan.id,
    client: client ?? "",
    total: plan.totalCents / 100,
    paid: plan.paidCents / 100,
    next: plan.nextLabel,
    months: plan.months,
    missed: plan.missed,
  }));
}

export type ActivityRow = {
  id: string;
  title: string;
  detail: string;
  time: string;
  kind: string;
};

export async function listActivities(): Promise<ActivityRow[]> {
  const rows = await db
    .select()
    .from(activities)
    .orderBy(asc(activities.position));
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    detail: row.detail,
    time: row.timeLabel,
    kind: row.kind,
  }));
}

export type ProjectSummary = {
  id: string;
  name: string;
  client: string;
  pm: string;
  status: string;
};

export async function getProjectSummary(
  id: string,
): Promise<ProjectSummary | null> {
  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      client: clients.name,
      pm: projects.pm,
      status: projects.status,
    })
    .from(projects)
    .innerJoin(clients, eq(clients.id, projects.clientId))
    .where(eq(projects.id, id));
  return rows[0] ?? null;
}

export type ProjectChangeRow = {
  id: string;
  projectId: string;
  title: string;
  scope: string;
  price: number;
  days: number;
  status: string;
};

export async function getProjectChange(
  projectId: string,
  changeId: string,
): Promise<ProjectChangeRow | null> {
  const rows = await db
    .select()
    .from(projectChanges)
    .where(eq(projectChanges.projectId, projectId));
  const row = rows.find((item) => item.id === changeId);
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    scope: row.scope,
    price: row.priceCents / 100,
    days: row.days,
    status: row.status,
  };
}

export type AccessRow = {
  id: number;
  name: string;
  owner: string;
  status: string;
};

export async function listProjectAccess(
  projectId: string,
): Promise<AccessRow[]> {
  const rows = await db
    .select()
    .from(projectAccess)
    .where(eq(projectAccess.projectId, projectId))
    .orderBy(asc(projectAccess.position));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    owner: row.owner,
    status: row.status,
  }));
}

export type ProjectChangeListRow = {
  id: string;
  title: string;
  scope: string;
  price: number;
  days: number;
  status: string;
};

export async function listProjectChanges(
  projectId: string,
): Promise<ProjectChangeListRow[]> {
  const rows = await db
    .select()
    .from(projectChanges)
    .where(eq(projectChanges.projectId, projectId))
    .orderBy(asc(projectChanges.position));
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    scope: row.scope,
    price: row.priceCents / 100,
    days: row.days,
    status: row.status,
  }));
}

export type TimesheetRow = {
  id: string;
  member: string;
  project: string;
  task: string;
  hours: number;
  week: string;
};

export async function listTimesheets(): Promise<TimesheetRow[]> {
  const rows = await db.select().from(timesheets).orderBy(asc(timesheets.id));
  return rows.map((row) => ({
    id: row.id,
    member: row.member,
    project: row.projectLabel,
    task: row.task,
    hours: row.hours,
    week: row.weekLabel,
  }));
}

export type PortalProject = {
  id: string;
  name: string;
  status: "Active" | "Completed" | "On hold";
  progress: number;
  start: string;
  end: string;
  health: "On track" | "Needs attention";
  phase: string;
  nextMilestone: string;
  modules: number;
};

export async function listPortalProjects(
  clientId: string = PORTAL_CLIENT_ID,
): Promise<PortalProject[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.clientId, clientId))
    .orderBy(asc(projects.createdAt));

  return rows.map((row) => {
    const completed = row.status.includes("warranty") || row.progress >= 100;
    const onHold = row.status === "On hold";
    return {
      id: row.id,
      name: row.name,
      status: completed ? "Completed" : onHold ? "On hold" : "Active",
      progress: row.progress,
      start: row.startDate
        ? new Date(`${row.startDate}T00:00:00`).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })
        : "—",
      end: row.dueLabel || "Open",
      health: row.health === "On track" ? "On track" : "Needs attention",
      phase:
        row.phase ||
        (completed
          ? "Live"
          : onHold
            ? "On hold"
            : `${row.progress}% built`),
      nextMilestone: row.nextMilestone || row.dueLabel,
      modules: row.modules,
    };
  });
}

export type PortalBlueprintSummary = {
  id: string;
  title: string;
  status: string;
  version: string;
  validUntil: string | null;
  price: number;
  milestones: string[];
};

export async function listPortalBlueprints(
  clientId: string = PORTAL_CLIENT_ID,
): Promise<PortalBlueprintSummary[]> {
  const rows = await db
    .select()
    .from(blueprintsTable)
    .where(
      and(
        eq(blueprintsTable.clientId, clientId),
        ne(blueprintsTable.status, "Draft"),
      ),
    )
    .orderBy(desc(blueprintsTable.validUntil));

  const result: PortalBlueprintSummary[] = [];
  for (const row of rows) {
    const milestones = await db
      .select({ title: blueprintMilestones.title })
      .from(blueprintMilestones)
      .where(eq(blueprintMilestones.blueprintId, row.id))
      .orderBy(asc(blueprintMilestones.position));
    result.push({
      id: row.id,
      title: row.title,
      status: row.status,
      version: row.version,
      validUntil: row.validUntil,
      price: row.priceCents / 100,
      milestones: milestones.map((milestone) => milestone.title),
    });
  }
  return result;
}

export type PortalTicketRow = {
  id: string;
  subject: string;
  category: "Something is broken" | "Question" | "Change request" | "Billing";
  priority: "Low" | "Normal" | "High" | "Urgent";
  status: "Open" | "In progress" | "Waiting on you" | "Resolved";
  warranty: boolean;
  updated: string;
  project?: string;
  messages: { id: string; from: "Client" | "Support"; body: string; at: string }[];
};

export async function listPortalTickets(
  clientId: string = PORTAL_CLIENT_ID,
): Promise<PortalTicketRow[]> {
  const rows = await db
    .select()
    .from(tickets)
    .where(eq(tickets.clientId, clientId))
    .orderBy(desc(tickets.updatedAt));
  const messages = await db.select().from(ticketMessages);

  return rows.map((row) => {
    const status: PortalTicketRow["status"] =
      row.status === "Resolved" || row.status === "Closed"
        ? "Resolved"
        : row.status === "Waiting on client"
          ? "Waiting on you"
          : row.status === "Open"
            ? "In progress"
            : "Open";
    const priority: PortalTicketRow["priority"] =
      row.priority === "P1" ? "Urgent" : row.priority === "P2" ? "High" : "Normal";
    const category: PortalTicketRow["category"] =
      row.category === "Billing"
        ? "Billing"
        : row.category === "Bug"
          ? "Something is broken"
          : row.category === "Feature request"
            ? "Change request"
            : "Question";

    return {
      id: row.id,
      subject: row.subject,
      category,
      priority,
      status,
      warranty: row.warranty,
      updated: row.updatedAt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      project: row.projectLabel ?? undefined,
      messages: messages
        .filter((message) => message.ticketId === row.id && !message.internal)
        .sort((a, b) => a.at.getTime() - b.at.getTime())
        .map((message) => ({
          id: message.id,
          from: message.sender === "Client" ? "Client" : "Support",
          body: message.body,
          at: message.at.toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
        })),
    };
  });
}

export type PortalInvoiceRow = {
  id: string;
  project: string;
  kind: string;
  amount: number;
  due: string;
  status: string;
};

export const PORTAL_CLIENT_ID = "brightline";

export async function listPortalInvoices(
  clientId: string = PORTAL_CLIENT_ID,
): Promise<PortalInvoiceRow[]> {
  const rows = await db
    .select({
      invoice: invoices,
      projectName: projects.name,
    })
    .from(invoices)
    .leftJoin(projects, eq(projects.id, invoices.projectId))
    .where(eq(invoices.clientId, clientId))
    .orderBy(desc(invoices.createdAt));

  return rows.map(({ invoice, projectName }) => ({
    id: invoice.id,
    project: projectName ?? "Care dashboard + portal",
    kind: invoice.kind,
    amount: invoice.amountCents / 100,
    due: invoice.dueLabel,
    status: invoice.status,
  }));
}

export type PortalApprovalRow = {
  id: string;
  type: string;
  title: string;
  detail: string;
  due: string;
  amount?: number;
};

export async function listPortalApprovals(
  clientId: string = PORTAL_CLIENT_ID,
): Promise<PortalApprovalRow[]> {
  const rows = await db
    .select()
    .from(portalApprovals)
    .where(eq(portalApprovals.clientId, clientId))
    .orderBy(asc(portalApprovals.position));
  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    detail: row.detail,
    due: row.dueLabel,
    amount: row.amountCents !== null ? row.amountCents / 100 : undefined,
  }));
}

export type PortalHistoryRow = {
  id: string;
  title: string;
  action: string;
  who: string;
  date: string;
};

export async function listPortalApprovalHistory(
  clientId: string = PORTAL_CLIENT_ID,
): Promise<PortalHistoryRow[]> {
  const rows = await db
    .select()
    .from(approvalHistory)
    .where(eq(approvalHistory.clientId, clientId))
    .orderBy(asc(approvalHistory.id));
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    action: row.action,
    who: row.who,
    date: row.dateLabel,
  }));
}

export type PortalReportRow = {
  id: string;
  title: string;
  period: string;
  published: string;
  highlights: string[];
};

export async function listPortalReports(
  clientId: string = PORTAL_CLIENT_ID,
): Promise<PortalReportRow[]> {
  const rows = await db
    .select()
    .from(portalReports)
    .where(eq(portalReports.clientId, clientId))
    .orderBy(asc(portalReports.position));
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    period: row.periodLabel,
    published: row.publishedLabel,
    highlights: (row.highlights as string[] | null) ?? [],
  }));
}

export type PortalCallData = {
  upcoming: {
    id: string;
    title: string;
    when: string;
    with: string;
    join: string;
  } | null;
  past: {
    id: string;
    title: string;
    when: string;
    notes: string;
    actions: string[];
  }[];
};

export async function listPortalCalls(
  clientId: string = PORTAL_CLIENT_ID,
): Promise<PortalCallData> {
  const rows = await db
    .select()
    .from(portalCalls)
    .where(eq(portalCalls.clientId, clientId))
    .orderBy(asc(portalCalls.position));

  const upcoming = rows.find((row) => row.kind === "upcoming");
  return {
    upcoming: upcoming
      ? {
          id: upcoming.id,
          title: upcoming.title,
          when: upcoming.whenLabel,
          with: upcoming.withLabel,
          join: upcoming.joinLabel,
        }
      : null,
    past: rows
      .filter((row) => row.kind === "past")
      .map((row) => ({
        id: row.id,
        title: row.title,
        when: row.whenLabel,
        notes: row.notes,
        actions: (row.actions as string[] | null) ?? [],
      })),
  };
}

export type PortalFileRow = {
  id: string;
  name: string;
  folder: string;
  project: string;
  size: string;
  updated: string;
  version: string;
};

export async function listPortalFiles(
  clientId: string = PORTAL_CLIENT_ID,
): Promise<PortalFileRow[]> {
  const rows = await db
    .select()
    .from(files)
    .where(
      and(
        eq(files.clientId, clientId),
        eq(files.visible, true),
      ),
    )
    .orderBy(asc(files.position));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    folder: row.folder,
    project: row.projectLabel,
    size: row.sizeLabel,
    updated: row.updatedLabel,
    version: row.version,
  }));
}

export type PortalContractRow = {
  id: string;
  name: string;
  status: string;
  date: string;
};

export async function listPortalContracts(
  clientId: string = PORTAL_CLIENT_ID,
): Promise<PortalContractRow[]> {
  const rows = await db
    .select()
    .from(contracts)
    .where(eq(contracts.clientId, clientId))
    .orderBy(asc(contracts.id));
  return rows.map((row) => ({
    id: row.id,
    name: row.type,
    status: row.status === "Signed" ? "Signed" : row.status === "Sent" ? "Pending signature" : "Draft",
    date:
      row.signedOn !== null
        ? new Date(`${row.signedOn}T00:00:00`).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "",
  }));
}

export type BlueprintDetail = {
  id: string;
  clientId: string;
  client: string;
  requirementId: string | null;
  title: string;
  status: string;
  version: string;
  validUntil: string | null;
  price: number;
  milestones: {
    id: string;
    title: string;
    tasks: {
      id: string;
      name: string;
      description: string;
      hours: number;
      visible: boolean;
    }[];
  }[];
};

export async function getBlueprintDetail(
  id: string,
): Promise<BlueprintDetail | null> {
  const [row] = await db
    .select({ blueprint: blueprintsTable, client: clients.name })
    .from(blueprintsTable)
    .innerJoin(clients, eq(clients.id, blueprintsTable.clientId))
    .where(eq(blueprintsTable.id, id));
  if (!row) return null;

  const milestones = await db
    .select()
    .from(blueprintMilestones)
    .where(eq(blueprintMilestones.blueprintId, id))
    .orderBy(asc(blueprintMilestones.position));

  const milestoneIds = milestones.map((milestone) => milestone.id);
  const tasks = milestoneIds.length
    ? await db
        .select()
        .from(blueprintTasks)
        .where(inArray(blueprintTasks.milestoneId, milestoneIds))
        .orderBy(asc(blueprintTasks.position))
    : [];

  return {
    id: row.blueprint.id,
    clientId: row.blueprint.clientId,
    client: row.client,
    requirementId: row.blueprint.requirementId,
    title: row.blueprint.title,
    status: row.blueprint.status,
    version: row.blueprint.version,
    validUntil: row.blueprint.validUntil,
    price: row.blueprint.priceCents / 100,
    milestones: milestones.map((milestone) => ({
      id: milestone.id,
      title: milestone.title,
      tasks: tasks
        .filter((task) => task.milestoneId === milestone.id)
        .map((task) => ({
          id: task.id,
          name: task.name,
          description: task.description,
          hours: task.hours,
          visible: task.visible,
        })),
    })),
  };
}

export type PortalUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  projectScope: string;
};

export async function listPortalUsers(
  clientId: string = PORTAL_CLIENT_ID,
): Promise<PortalUserRow[]> {
  const rows = await db
    .select()
    .from(portalUsers)
    .where(eq(portalUsers.clientId, clientId))
    .orderBy(asc(portalUsers.id));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    initials: row.initials,
    projectScope: row.projectScope,
  }));
}

export type RequirementDetailRow = {
  id: string;
  client: string;
  title: string;
  status: string;
  budget: string;
  submitted: string;
  due: string;
  overdue: boolean;
  points: number;
  sections: {
    id: string;
    title: string;
    points: { text: string; must: boolean; comment?: string }[];
  }[];
};

export async function getRequirementDetail(
  id: string,
): Promise<RequirementDetailRow | null> {
  const [row] = await db
    .select({ requirement: requirements, client: clients.name })
    .from(requirements)
    .innerJoin(clients, eq(clients.id, requirements.clientId))
    .where(eq(requirements.id, id));
  if (!row) return null;

  const sections = await db
    .select()
    .from(requirementSections)
    .where(eq(requirementSections.requirementId, id))
    .orderBy(asc(requirementSections.position));
  const sectionIds = sections.map((section) => section.id);
  const points = sectionIds.length
    ? await db
        .select()
        .from(requirementPoints)
        .where(inArray(requirementPoints.sectionId, sectionIds))
        .orderBy(asc(requirementPoints.position))
    : [];

  return {
    id: row.requirement.id,
    client: row.client,
    title: row.requirement.title,
    status: row.requirement.status,
    budget: row.requirement.budget,
    submitted: shortDate(row.requirement.submittedOn),
    due: shortDate(row.requirement.dueOn),
    overdue: row.requirement.overdue,
    points: row.requirement.pointsCount,
    sections: sections.map((section) => ({
      id: section.sectionKey,
      title: section.title,
      points: points
        .filter((point) => point.sectionId === section.id)
        .map((point) => ({
          text: point.text,
          must: point.mustHave,
          comment: point.comment ?? undefined,
        })),
    })),
  };
}


export type RetainerRow = {
  id: string;
  client: string;
  plan: string;
  amount: number;
  hours: number;
  used: number;
  next: string;
  status: string;
};

export async function listRetainers(): Promise<RetainerRow[]> {
  const rows = await db
    .select({ plan: retainers, client: clients.name })
    .from(retainers)
    .leftJoin(clients, eq(clients.id, retainers.clientId))
    .orderBy(asc(retainers.clientId));

  return rows.map(({ plan, client }) => ({
    id: plan.clientId,
    client: client ?? "",
    plan: plan.plan,
    amount: plan.priceCents / 100,
    hours: plan.hours,
    used: plan.used,
    next: plan.nextLabel,
    status: plan.status,
  }));
}

export type PortalRetainer = {
  plan: string;
  price: number;
  hours: number;
  used: number;
  next: string;
  sla: string;
  work: { id: string; title: string; hours: number; date: string }[];
};

export async function getPortalRetainer(
  clientId: string = PORTAL_CLIENT_ID,
): Promise<PortalRetainer | null> {
  const [row] = await db
    .select()
    .from(retainers)
    .where(eq(retainers.clientId, clientId));
  if (!row) return null;

  const work = await db
    .select()
    .from(retainerWork)
    .where(eq(retainerWork.clientId, clientId))
    .orderBy(asc(retainerWork.position));

  return {
    plan: row.plan,
    price: row.priceCents / 100,
    hours: row.hours,
    used: row.used,
    next: row.nextLabel,
    sla: row.sla,
    work: work.map((item) => ({
      id: item.id,
      title: item.title,
      hours: item.hours,
      date: item.dateLabel,
    })),
  };
}

export type CallNoteRow = {
  id: string;
  call: string;
  note: string;
  actions: number;
};

export async function listCallNotes(): Promise<CallNoteRow[]> {
  const rows = await db
    .select()
    .from(callNotes)
    .orderBy(asc(callNotes.position));
  return rows.map((row) => ({
    id: row.id,
    call: row.callTitle,
    note: row.note,
    actions: row.actions,
  }));
}

export type MarketingStatRow = {
  id: string;
  label: string;
  value: string;
  change: string;
};

export async function listMarketingStats(): Promise<MarketingStatRow[]> {
  const rows = await db
    .select()
    .from(marketingStats)
    .orderBy(asc(marketingStats.position));
  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    value: row.value,
    change: row.change,
  }));
}

export type HelpArticleRow = {
  id: string;
  title: string;
  type: string;
};

export async function listHelpArticles(): Promise<HelpArticleRow[]> {
  const rows = await db
    .select()
    .from(helpArticles)
    .orderBy(asc(helpArticles.position));
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type,
  }));
}

export async function listHandoverItems(): Promise<
  { id: string; label: string }[]
> {
  const rows = await db
    .select()
    .from(handoverItems)
    .orderBy(asc(handoverItems.position));
  return rows.map((row) => ({ id: row.id, label: row.label }));
}

export type DeletionRequestRow = {
  id: string;
  client: string;
  contact: string;
  requested: string;
  reason: string;
  status: string;
};

export async function listDeletionRequests(): Promise<DeletionRequestRow[]> {
  const rows = await db
    .select()
    .from(deletionRequests)
    .orderBy(asc(deletionRequests.position));
  return rows.map((row) => ({
    id: row.id,
    client: row.client,
    contact: row.contact,
    requested: row.requestLabel,
    reason: row.reason,
    status: row.status,
  }));
}


export async function listNotificationSettings(
  scope: "team" | "client",
): Promise<{ id: string; label: string; hint: string; enabled: boolean }[]> {
  const rows = await db
    .select()
    .from(notificationSettings)
    .where(eq(notificationSettings.scope, scope))
    .orderBy(asc(notificationSettings.position));
  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    hint: row.hint,
    enabled: row.enabled,
  }));
}

export async function listClientNotificationPrefs(
  clientId: string,
): Promise<{ id: string; label: string; hint: string; enabled: boolean }[]> {
  const rows = await db
    .select({ setting: notificationSettings, pref: clientNotificationPrefs })
    .from(clientNotificationPrefs)
    .innerJoin(
      notificationSettings,
      eq(notificationSettings.id, clientNotificationPrefs.settingId),
    )
    .where(eq(clientNotificationPrefs.clientId, clientId))
    .orderBy(asc(notificationSettings.position));
  return rows.map(({ setting, pref }) => ({
    id: setting.id,
    label: setting.label,
    hint: setting.hint,
    enabled: pref.enabled,
  }));
}

export async function listHealthRules(): Promise<
  { id: string; label: string; body: string; tone: string }[]
> {
  const rows = await db
    .select()
    .from(healthRules)
    .orderBy(asc(healthRules.position));
  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    body: row.body,
    tone: row.tone,
  }));
}

export type TaskDetailData = {
  task: AdminTask;
  checklist: { id: string; label: string; done: boolean }[];
  comments: { id: string; author: string; body: string; at: string }[];
};

export async function getTaskDetail(
  id: string,
): Promise<TaskDetailData | null> {
  const task = (await listTasks()).find((item) => item.id === id);
  if (!task) return null;

  const [checklist, comments] = await Promise.all([
    db
      .select()
      .from(taskChecklistItems)
      .where(eq(taskChecklistItems.taskId, id))
      .orderBy(asc(taskChecklistItems.position)),
    db
      .select()
      .from(taskComments)
      .where(eq(taskComments.taskId, id))
      .orderBy(asc(taskComments.position)),
  ]);

  return {
    task,
    checklist: checklist.map((item) => ({
      id: item.id,
      label: item.label,
      done: item.done,
    })),
    comments: comments.map((item) => ({
      id: item.id,
      author: item.author,
      body: item.body,
      at: item.atLabel,
    })),
  };
}


export type AdminSidebarCounts = {
  requirementsNew: number;
  blueprintsDue: number;
  projectsActive: number;
  callsToday: number;
  ticketsOpen: number;
  ticketsNearSla: number;
  messagesUnread: number;
  invoicesOverdue: number;
};

export async function getAdminSidebarCounts(): Promise<AdminSidebarCounts> {
  const [requirementRows, blueprintRows, projectRows, callRows, ticketRows, threadRows, invoiceRows] =
    await Promise.all([
      db.select({ status: requirements.status }).from(requirements),
      db.select({ status: blueprintsTable.status }).from(blueprintsTable),
      db.select({ status: projects.status }).from(projects),
      db.select({ day: calls.dayLabel }).from(calls),
      db.select({ status: tickets.status, sla: tickets.sla }).from(tickets),
      db
        .select({ unread: threads.unread })
        .from(threads)
        .where(eq(threads.scope, "admin")),
      db.select({ status: invoices.status }).from(invoices),
    ]);

  const openTickets = ticketRows.filter(
    (row) => row.status !== "Resolved" && row.status !== "Closed",
  );
  const now = new Date().toISOString();

  return {
    requirementsNew: requirementRows.filter(
      (row) => row.status === "Submitted",
    ).length,
    blueprintsDue: blueprintRows.filter(
      (row) =>
        row.status === "Waiting for approval" || row.status === "Draft",
    ).length,
    projectsActive: projectRows.filter(
      (row) =>
        row.status === "Planning" ||
        row.status === "Building" ||
        row.status === "Review",
    ).length,
    callsToday: callRows.filter((row) => row.day === "Today").length,
    ticketsOpen: openTickets.length,
    ticketsNearSla: openTickets.filter((row) => {
      const sla = row.sla as { resolutionDue?: string } | null;
      return Boolean(sla?.resolutionDue && sla.resolutionDue < now);
    }).length,
    messagesUnread: threadRows.reduce((total, row) => total + row.unread, 0),
    invoicesOverdue: invoiceRows.filter((row) => row.status === "Overdue")
      .length,
  };
}

export type PortalSidebarCounts = {
  approvals: number;
  blueprints: number;
  invoices: number;
  tickets: number;
  nextCall: string | null;
};

export async function getPortalSidebarCounts(
  clientId: string,
): Promise<PortalSidebarCounts> {
  const [approvals, blueprints, invoices, tickets, calls] = await Promise.all([
    listPortalApprovals(clientId),
    listPortalBlueprints(clientId),
    listPortalInvoices(clientId),
    listPortalTickets(clientId),
    listPortalCalls(clientId),
  ]);

  return {
    approvals: approvals.length,
    blueprints: blueprints.length,
    invoices: invoices.filter((invoice) => invoice.status !== "Paid").length,
    tickets: tickets.filter((ticket) => ticket.status !== "Resolved").length,
    nextCall: calls.upcoming?.when ?? null,
  };
}


export type BlueprintSuggestionRow = {
  id: string;
  blueprintId: string;
  milestoneId: string;
  taskId: string;
  name: string;
  description: string;
  hours: number;
  visible: boolean;
  note: string | null;
  status: string;
  by: string;
  finalName: string | null;
  finalDescription: string | null;
  finalHours: number | null;
  finalVisible: boolean | null;
  decisionNote: string | null;
};

export async function listBlueprintSuggestions(
  blueprintId: string,
): Promise<BlueprintSuggestionRow[]> {
  const rows = await db
    .select()
    .from(blueprintSuggestions)
    .where(eq(blueprintSuggestions.blueprintId, blueprintId))
    .orderBy(desc(blueprintSuggestions.createdAt));
  return rows.map((row) => ({
    id: row.id,
    blueprintId: row.blueprintId,
    milestoneId: row.milestoneId,
    taskId: row.taskId,
    name: row.name,
    description: row.description,
    hours: row.hours,
    visible: row.visible,
    note: row.note,
    status: row.status,
    by: row.by,
    finalName: row.finalName,
    finalDescription: row.finalDescription,
    finalHours: row.finalHours,
    finalVisible: row.finalVisible,
    decisionNote: row.decisionNote,
  }));
}
