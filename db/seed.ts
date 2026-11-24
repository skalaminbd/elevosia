/**
 * Seeds the pilot tables from the demo data in lib/. Safe to re-run: every
 * insert is onConflictDoNothing, so existing rows stay untouched.
 *
 * Run with: npx tsx db/seed.ts   (or node db/seed.ts on Node 22.6+)
 */

import { eq, sql } from "drizzle-orm";
import {
  activity as activityData,
  adminClients,
  adminInvoices,
  adminProjects,
  adminTasks as tasksData,
  blueprints,
  calls as callsData,
  campaigns as campaignData,
  cannedReplies as cannedReplyData,
  contracts,
  files as filesData,
  installments as installmentData,
  onboardingPipeline,
  requirementDetails,
  requirements,
  team as teamData,
  threads as threadData,
  ticketRecords,
  tickets as queueTickets,
  timesheet as timesheetData,
  workRequests as workRequestData,
} from "../lib/admin-data";
import {
  approvalHistory as approvalHistoryData,
  portalApprovals as portalApprovalData,
  portalCalls as portalCallsData,
  portalContracts as portalContractData,
  portalFiles as portalFileData,
  portalReports as portalReportsData,
  portalTeam as portalTeamData,
} from "../lib/portal-data";
import { buildMilestones } from "../lib/blueprint-seed";
import { CONTRACT_TEMPLATES } from "../lib/contract-store";
import { initialTeam } from "../lib/team-data";
import { db } from "./index";
import {
  activities,
  approvalHistory,
  blueprintMilestones,
  blueprintTasks,
  blueprints as blueprintsTable,
  calls,
  campaigns,
  cannedReplies,
  clientCompanies,
  callNotes,
  clientNotificationPrefs,
  clients,
  contractTemplates,
  contracts as contractsTable,
  deletionRequests,
  handoverItems,
  healthRules,
  helpArticles,
  files,
  installments,
  invoices,
  marketingStats,
  notificationSettings,
  onboardingCards,
  portalApprovals,
  portalCalls,
  portalReports,
  portalUsers,
  projects,
  projectAccess,
  retainers,
  retainerWork,
  projectChanges,
  projectMilestones,
  requirementPoints,
  requirementSections,
  requirements as requirementsTable,
  taskChecklistItems,
  taskComments,
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

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "17 Nov" or "2 Dec 2026" → ISO date (2026 when no year is given). */
function parseDate(value: string): string | null {
  const match = /^(\d{1,2})\s+([A-Za-z]{3})(?:\s+(\d{4}))?$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = MONTHS.indexOf(match[2]);
  if (month === -1) return null;
  const year = Number(match[3] ?? 2026);
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function clientIdFor(name: string): string | null {
  const client = adminClients.find(
    (item) =>
      item.name === name ||
      item.companies.some((company) => company.name === name),
  );
  return client?.id ?? null;
}

function requirementFor(client: string, title: string) {
  return (
    requirements.find(
      (item) => item.client === client && item.title === title,
    ) ?? requirements.find((item) => item.client === client)
  );
}

async function seedClients() {
  await db
    .insert(clients)
    .values(
      adminClients.map((client) => ({
        id: client.id,
        name: client.name,
        contact: client.contact,
        email: client.email,
        phone: client.phone,
        industry: client.industry,
        status: client.status,
        pm: client.pm,
        timezone: client.timezone,
        initials: client.initials,
        plan: client.plan,
        balanceCents: client.balance * 100,
        source: client.source,
        clientSince: client.clientSince,
        sinceLabel: client.since,
      })),
    )
    .onConflictDoUpdate({
      target: clients.id,
      set: {
        name: sql`excluded.name`,
        contact: sql`excluded.contact`,
        email: sql`excluded.email`,
        phone: sql`excluded.phone`,
        industry: sql`excluded.industry`,
        status: sql`excluded.status`,
        pm: sql`excluded.pm`,
        timezone: sql`excluded.timezone`,
        initials: sql`excluded.initials`,
        plan: sql`excluded.plan`,
        balanceCents: sql`excluded.balance_cents`,
        source: sql`excluded.source`,
        clientSince: sql`excluded.client_since`,
        sinceLabel: sql`excluded.since_label`,
      },
    });

  for (const client of adminClients) {
    await db
      .insert(clientCompanies)
      .values(
        client.companies.map((company, index) => ({
          clientId: client.id,
          name: company.name,
          address: company.address,
          city: company.city,
          region: company.region,
          zip: company.zip,
          phone: company.phone,
          website: company.website,
          position: index,
        })),
      )
      .onConflictDoNothing();
  }
  console.log(`clients: ${adminClients.length}`);
}

async function seedRequirements() {
  const rows = requirements
    .map((requirement) => {
      const clientId = clientIdFor(requirement.client);
      if (!clientId) return null;
      return {
        id: requirement.id,
        clientId,
        title: requirement.title,
        submittedOn: parseDate(requirement.submitted),
        dueOn: parseDate(requirement.due),
        overdue: requirement.overdue ?? false,
        status: requirement.status,
        budget: requirement.budget,
        pointsCount: requirement.points,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  await db.insert(requirementsTable).values(rows).onConflictDoNothing();

  for (const [requirementId, detail] of Object.entries(requirementDetails)) {
    await db
      .insert(requirementSections)
      .values(
        detail.sections.map((section, index) => ({
          requirementId,
          sectionKey: section.id,
          title: section.title,
          position: index,
        })),
      )
      .onConflictDoNothing();

    const storedSections = await db
      .select()
      .from(requirementSections)
      .where(eq(requirementSections.requirementId, requirementId));

    for (const section of detail.sections) {
      const stored = storedSections.find(
        (item) => item.sectionKey === section.id,
      );
      if (!stored) continue;
      await db
        .insert(requirementPoints)
        .values(
          section.points.map((point, index) => ({
            sectionId: stored.id,
            text: point.text,
            mustHave: point.must,
            comment: point.comment ?? null,
            position: index,
          })),
        )
        .onConflictDoNothing();
    }
  }
  console.log(`requirements: ${requirements.length}`);
}

async function seedBlueprints() {
  const rows = blueprints
    .map((blueprint) => {
      const clientId = clientIdFor(blueprint.client);
      if (!clientId) return null;
      return {
        id: blueprint.id,
        clientId,
        requirementId:
          requirementFor(blueprint.client, blueprint.title)?.id ?? null,
        title: blueprint.title,
        status: blueprint.status,
        version: blueprint.version,
        validUntil: parseDate(blueprint.validUntil),
        priceCents: blueprint.price * 100,
        milestoneCount: blueprint.milestones,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  await db.insert(blueprintsTable).values(rows).onConflictDoNothing();

  for (const blueprint of blueprints) {
    const milestones = buildMilestones(blueprint.milestones);
    await db
      .insert(blueprintMilestones)
      .values(
        milestones.map((milestone, index) => ({
          id: `${blueprint.id}-${milestone.id}`,
          blueprintId: blueprint.id,
          title: milestone.title,
          position: index,
        })),
      )
      .onConflictDoNothing();

    for (const milestone of milestones) {
      await db
        .insert(blueprintTasks)
        .values(
          milestone.tasks.map((task, taskIndex) => ({
            id: `${blueprint.id}-${task.id}`,
            milestoneId: `${blueprint.id}-${milestone.id}`,
            name: task.name,
            description: task.description,
            hours: task.hours,
            visible: task.visible,
            position: taskIndex,
          })),
        )
        .onConflictDoNothing();
    }
  }
  console.log(`blueprints: ${blueprints.length}`);
}

async function seedProjects() {
  const rows = adminProjects
    .map((project) => {
      const clientId = clientIdFor(project.client);
      if (!clientId) return null;
      return {
        id: project.id,
        clientId,
        name: project.name,
        blueprintId: null,
        pm: project.pm,
        status: project.status,
        health: project.health,
        progress: project.progress,
        modules: project.modules,
        priceCents: project.price * 100,
        usedCents: project.used * 100,
        dueLabel: project.due,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  await db
    .insert(projects)
    .values(rows)
    .onConflictDoUpdate({
      target: projects.id,
      set: {
        clientId: sql`excluded.client_id`,
        name: sql`excluded.name`,
        pm: sql`excluded.pm`,
        status: sql`excluded.status`,
        health: sql`excluded.health`,
        progress: sql`excluded.progress`,
        modules: sql`excluded.modules`,
        priceCents: sql`excluded.price_cents`,
        usedCents: sql`excluded.used_cents`,
        dueLabel: sql`excluded.due_label`,
      },
    });
  console.log(`projects: ${adminProjects.length}`);
}

async function seedContracts() {
  await db
    .insert(contractTemplates)
    .values(
      CONTRACT_TEMPLATES.map((template) => ({
        id: template.id,
        name: template.name,
        body: template.body,
        usedCount: template.used,
        updatedOn: parseDate(template.updated),
      })),
    )
    .onConflictDoNothing();

  const rows = contracts
    .map((contract) => {
      const clientId = clientIdFor(contract.client);
      if (!clientId) return null;
      return {
        id: contract.id,
        clientId,
        projectId: contract.projectId
          ? (adminProjects.find(
              (project) => project.id === contract.projectId,
            )?.id ?? null)
          : null,
        type: contract.type,
        status: contract.status,
        signedOn: contract.status === "Signed" ? parseDate(contract.date) : null,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  await db.insert(contractsTable).values(rows).onConflictDoNothing();
  console.log(`contracts: ${contracts.length}`);
}

async function seedInvoices() {
  const rows = adminInvoices
    .map((invoice) => {
      const clientId = clientIdFor(invoice.client);
      if (!clientId) return null;
      return {
        id: invoice.id,
        clientId,
        projectId: null,
        kind: invoice.kind,
        amountCents: invoice.amount * 100,
        dueOn: parseDate(invoice.due),
        dueLabel: invoice.due,
        status: invoice.status,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  await db.insert(invoices).values(rows).onConflictDoNothing();
  console.log(`invoices: ${adminInvoices.length}`);
}

function projectIdFor(name: string): string | null {
  return adminProjects.find((project) => project.name === name)?.id ?? null;
}

async function seedActivity() {
  await db
    .insert(activities)
    .values(
      activityData.map((entry, index) => ({
        id: entry.id,
        title: entry.title,
        detail: entry.detail,
        timeLabel: entry.time,
        kind: entry.kind,
        position: index,
      })),
    )
    .onConflictDoNothing();
  console.log(`activity: ${activityData.length}`);
}

async function seedTasks() {
  const rows = tasksData
    .map((task) => ({
      id: task.id,
      projectId: projectIdFor(task.project),
      clientId: clientIdFor(task.client),
      title: task.title,
      assignee: task.assignee,
      reviewer: task.reviewer ?? null,
      milestone: task.milestone ?? null,
      linkedType: task.linked?.type ?? null,
      linkedId: task.linked?.id ?? null,
      linkedTitle: task.linked?.title ?? null,
      week: task.week,
      status: task.status,
      dueLabel: task.due,
      priority: task.priority,
      estimate: task.estimate,
      logged: task.logged,
      clientVisible: task.clientVisible,
    }))
    .filter((row) => row.clientId !== null);
  await db.insert(tasks).values(rows).onConflictDoNothing();
  console.log(`tasks: ${rows.length}`);
}

async function seedCalls() {
  await db
    .insert(calls)
    .values(
      callsData.map((call, index) => ({
        id: call.id,
        clientId:
          call.client === "Internal" ? null : clientIdFor(call.client),
        dayLabel: call.day,
        timeLabel: call.time,
        title: call.title,
        kind: call.kind,
        owner: call.owner,
        position: index,
      })),
    )
    .onConflictDoNothing();
  console.log(`calls: ${callsData.length}`);
}

async function seedFiles() {
  await db
    .insert(files)
    .values(
      filesData.map((file, index) => ({
        id: file.id,
        clientId: clientIdFor(file.client),
        projectId: null,
        projectLabel: "",
        name: file.name,
        folder: file.folder,
        sizeLabel: file.size,
        updatedLabel: file.updated,
        visible: file.visible,
        version: "v1",
        position: index,
      })),
    )
    .onConflictDoNothing();
  console.log(`files: ${filesData.length}`);
}

async function seedTickets() {
  for (const record of ticketRecords) {
    const clientId =
      clientIdFor(record.client.company) ?? record.client.id;
    await db
      .insert(tickets)
      .values({
        id: record.id,
        clientId,
        projectId: record.project ? projectIdFor(record.project) : null,
        projectLabel: record.project,
        subject: record.subject,
        description: record.description,
        status: record.status,
        priority: record.priority,
        category: record.category,
        assignee: record.assignee,
        carePlan: record.client.carePlan,
        warranty: record.warranty,
        billableHours: record.billableHours,
        channel: record.channel,
        sla: record.sla,
        requester: record.requester,
        cc: record.cc,
        followers: record.followers,
        tags: record.tags,
        linked: record.linked,
        rating: record.rating ?? null,
        unread: record.unread,
        createdAt: new Date(record.createdAt),
        updatedAt: new Date(record.updatedAt),
      })
      .onConflictDoNothing();

    await db
      .insert(ticketMessages)
      .values(
        record.messages.map((message) => ({
          id: message.id,
          ticketId: record.id,
          author: message.author,
          sender: message.sender,
          channel: message.channel,
          body: message.body,
          unread: message.unread ?? false,
          internal: message.internal ?? false,
          at: new Date(message.at),
        })),
      )
      .onConflictDoNothing();

    await db
      .insert(ticketEvents)
      .values(
        record.events.map((event) => ({
          id: event.id,
          ticketId: record.id,
          kind: event.kind,
          text: event.text,
          actor: event.actor,
          at: new Date(event.at),
        })),
      )
      .onConflictDoNothing();
  }

  const recorded = new Set(ticketRecords.map((record) => record.id));
  const extra = queueTickets.filter((ticket) => !recorded.has(ticket.id));
  if (extra.length > 0) {
    await db
      .insert(tickets)
      .values(
        extra.map((ticket) => ({
          id: ticket.id,
          clientId: clientIdFor(ticket.client),
          projectLabel: null,
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
          carePlan: ticket.care,
          warranty: ticket.warranty,
          assignee: ticket.assignee,
        })),
      )
      .onConflictDoNothing();
  }
  console.log(`tickets: ${recorded.size + extra.length}`);
}

async function seedThreads() {
  for (const [index, thread] of threadData.entries()) {
    await db
      .insert(threads)
      .values({
        id: thread.id,
        clientId: clientIdFor(thread.client),
        preview: thread.preview,
        timeLabel: thread.time,
        unread: thread.unread,
        scope: "admin",
        position: index,
      })
      .onConflictDoNothing();

    await db
      .insert(threadMessages)
      .values(
        thread.messages.map((message, messageIndex) => ({
          id: message.id,
          threadId: thread.id,
          author: message.from,
          self: message.self,
          body: message.body,
          timeLabel: message.time,
          position: messageIndex,
        })),
      )
      .onConflictDoNothing();
  }
  console.log(`threads: ${threadData.length}`);
}

async function seedCampaigns() {
  await db
    .insert(campaigns)
    .values(
      campaignData.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        channel: campaign.channel,
        status: campaign.status,
        dueLabel: campaign.due,
        owner: campaign.owner,
        progress: campaign.progress,
      })),
    )
    .onConflictDoNothing();
  console.log(`campaigns: ${campaignData.length}`);
}

async function seedTeam() {
  await db
    .insert(teamMembers)
    .values(
      initialTeam.map((member) => {
        const capacity = teamData.find((entry) =>
          member.name.startsWith(entry.name),
        );
        return {
          id: member.id,
          name: member.name,
          role: member.role,
          initials: member.initials,
          email: member.email,
          access: member.access,
          status: member.status,
          lastActive: member.lastActive,
          added: member.added,
          planned: capacity?.planned ?? 0,
          capacity: capacity?.capacity ?? 40,
          projectCount: capacity?.projects ?? 0,
        };
      }),
    )
    .onConflictDoUpdate({
      target: teamMembers.id,
      set: {
        name: sql`excluded.name`,
        role: sql`excluded.role`,
        initials: sql`excluded.initials`,
        email: sql`excluded.email`,
        access: sql`excluded.access`,
        status: sql`excluded.status`,
        lastActive: sql`excluded.last_active`,
        added: sql`excluded.added`,
        planned: sql`excluded.planned`,
        capacity: sql`excluded.capacity`,
        projectCount: sql`excluded.project_count`,
      },
    });

  await db
    .insert(timesheets)
    .values(
      timesheetData.map((entry) => ({
        id: entry.id,
        member: entry.member,
        projectLabel: entry.project,
        task: entry.task,
        hours: entry.hours,
        weekLabel: entry.week,
      })),
    )
    .onConflictDoNothing();
  console.log(`team: ${teamData.length}`);
}

async function seedOnboarding() {
  const rows = onboardingPipeline.flatMap((stage, stageIndex) =>
    stage.cards.map((card, index) => ({
      id: card.id,
      stage: stage.stage,
      clientId: clientIdFor(card.client),
      client: card.client,
      missing: card.missing,
      daysLabel: card.days,
      position: stageIndex * 10 + index,
    })),
  );
  await db.insert(onboardingCards).values(rows).onConflictDoNothing();
  console.log(`onboarding: ${rows.length}`);
}

async function seedWorkRequests() {
  await db
    .insert(workRequests)
    .values(
      workRequestData.map((request) => ({
        id: request.id,
        clientId: clientIdFor(request.client),
        title: request.title,
        detail: request.detail,
        hours: request.hours,
        submittedLabel: request.submitted,
        status: request.status,
        pm: request.pm,
      })),
    )
    .onConflictDoNothing();
  console.log(`work requests: ${workRequestData.length}`);
}

async function seedCannedReplies() {
  await db
    .insert(cannedReplies)
    .values(
      cannedReplyData.map((reply) => ({
        id: reply.id,
        title: reply.title,
        category: reply.category,
        body: reply.body,
      })),
    )
    .onConflictDoNothing();
  console.log(`canned replies: ${cannedReplyData.length}`);
}

async function seedInstallments() {
  await db
    .insert(installments)
    .values(
      installmentData.map((plan) => ({
        id: plan.id,
        clientId: clientIdFor(plan.client),
        totalCents: plan.total * 100,
        paidCents: plan.paid * 100,
        nextLabel: plan.next,
        months: plan.months,
        missed: plan.missed,
      })),
    )
    .onConflictDoNothing();
  console.log(`installments: ${installmentData.length}`);
}

async function seedPortal() {
  const brightline = clientIdFor("Brightline Care");
  if (!brightline) return;

  await db
    .insert(portalUsers)
    .values(
      portalTeamData.map((member) => ({
        id: member.id,
        clientId: brightline,
        name: member.name,
        email: member.email,
        role: member.role,
        initials: member.initials,
        projectScope: member.projects,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(portalApprovals)
    .values(
      portalApprovalData.map((approval, index) => ({
        id: approval.id,
        clientId: brightline,
        type: approval.type,
        title: approval.title,
        detail: approval.detail,
        dueLabel: approval.due,
        amountCents: approval.amount ? approval.amount * 100 : null,
        position: index,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(approvalHistory)
    .values(
      approvalHistoryData.map((entry) => ({
        id: entry.id,
        clientId: brightline,
        title: entry.title,
        action: entry.action,
        who: entry.who,
        dateLabel: entry.date,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(portalReports)
    .values(
      portalReportsData.map((report, index) => ({
        id: report.id,
        clientId: brightline,
        title: report.title,
        periodLabel: report.period,
        publishedLabel: report.published,
        highlights: report.highlights,
        position: index,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(portalCalls)
    .values([
      {
        id: portalCallsData.upcoming.id,
        clientId: brightline,
        kind: "upcoming",
        title: portalCallsData.upcoming.title,
        whenLabel: portalCallsData.upcoming.when,
        withLabel: portalCallsData.upcoming.with,
        joinLabel: portalCallsData.upcoming.join,
        position: 0,
      },
      ...portalCallsData.past.map((call, index) => ({
        id: call.id,
        clientId: brightline,
        kind: "past",
        title: call.title,
        whenLabel: call.when,
        notes: call.notes,
        actions: call.actions,
        position: index + 1,
      })),
    ])
    .onConflictDoNothing();
  await db
    .insert(files)
    .values(
      portalFileData.map((file, index) => ({
        id: file.id,
        clientId: brightline,
        projectLabel: file.project,
        name: file.name,
        folder: file.folder,
        sizeLabel: file.size,
        updatedLabel: file.updated,
        visible: true,
        version: file.version,
        position: 100 + index,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(contractsTable)
    .values(
      portalContractData.map((contract, index) => ({
        id: contract.id,
        clientId: brightline,
        projectId: null,
        type: contract.name,
        status:
          contract.status === "Signed" ? "Signed" : "Sent",
        signedOn: contract.status === "Signed" ? "2026-11-01" : null,
        createdAt: new Date(2026, 10, 1 + index),
      })),
    )
    .onConflictDoNothing();
  console.log("portal client-level tables seeded");
}

async function seedProjectDetails() {
  await db
    .insert(projectChanges)
    .values({
      id: "CH-18",
      projectId: "brightline-portal",
      title: "Family access additions",
      scope:
        "Second family contact, invoice visibility without care notes.",
      priceCents: 90000,
      days: 3,
      status: "Waiting for client",
    })
    .onConflictDoNothing();

  await db
    .insert(projectAccess)
    .values(
      [
        ["Hosting", "Client", "Handed over"],
        ["Domain", "Client", "Handed over"],
        ["Repository", "Client", "Invite sent"],
        ["Database", "Client", "Pending"],
        ["Email delivery", "Client", "Handed over"],
      ].map(([name, owner, status], position) => ({
        projectId: "brightline-portal",
        name,
        owner,
        status,
        position,
      })),
    )
    .onConflictDoNothing();
  console.log("project changes and access seeded");
}

async function seedFinancePlans() {
  await db
    .insert(retainers)
    .values([
      {
        clientId: "harbor",
        plan: "Growth care",
        status: "Active",
        priceCents: 69900,
        hours: 6,
        used: 2.5,
        nextLabel: "1 Dec 2026",
        sla: "Same-business-day support",
      },
      {
        clientId: "lumen",
        plan: "Retainer · 20 h",
        status: "Active",
        priceCents: 240000,
        hours: 20,
        used: 11,
        nextLabel: "1 Dec 2026",
        sla: "Next-business-day support",
      },
      {
        clientId: "brightline",
        plan: "Growth care",
        status: "Active",
        priceCents: 69900,
        hours: 6,
        used: 2.5,
        nextLabel: "1 Dec 2026",
        sla: "Same-business-day support",
      },
      {
        clientId: "ridgeline",
        plan: "Care plan",
        status: "Paused",
        priceCents: 0,
        hours: 0,
        used: 0,
        nextLabel: "—",
        sla: "",
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(retainerWork)
    .values([
      { id: "w1", clientId: "brightline", title: "Small copy changes on the booking page", hours: 0.5, dateLabel: "12 Nov", position: 0 },
      { id: "w2", clientId: "brightline", title: "Add a second calendar rule", hours: 1.5, dateLabel: "8 Nov", position: 1 },
      { id: "w3", clientId: "brightline", title: "Review invoice reminder wording", hours: 0.5, dateLabel: "5 Nov", position: 2 },
    ])
    .onConflictDoNothing();
  console.log("retainers and retainer work seeded");
}

async function seedReferenceContent() {
  await db
    .insert(callNotes)
    .values([
      { id: "N-1", callTitle: "Brightline weekly", note: "Family access roles approved. Reminder wording to review before Friday.", actions: 2, position: 0 },
      { id: "N-2", callTitle: "Northwind launch", note: "Training Thursday. Dale will confirm the crew accounts by Wednesday.", actions: 1, position: 1 },
    ])
    .onConflictDoNothing();

  await db
    .insert(marketingStats)
    .values([
      { id: "M-1", label: "Google impressions", value: "18.4k", change: "+12%", position: 0 },
      { id: "M-2", label: "Clicks from search", value: "1,120", change: "+8%", position: 1 },
      { id: "M-3", label: "AI answers citing us", value: "14", change: "+5", position: 2 },
    ])
    .onConflictDoNothing();

  await db
    .insert(helpArticles)
    .values([
      { id: "HA-1", title: "Sharing the handover folder", type: "Article", position: 0 },
      { id: "HA-2", title: "Adding a second portal contact", type: "User guide", position: 1 },
      { id: "HA-3", title: "Where invoice exports live", type: "FAQ", position: 2 },
      { id: "HA-4", title: "Report spacing settings", type: "Tutorial", position: 3 },
    ])
    .onConflictDoNothing();

  await db
    .insert(handoverItems)
    .values([
      { id: "HI-1", label: "All accounts are in the client's name", position: 0 },
      { id: "HI-2", label: "Credentials handed over and rotated", position: 1 },
      { id: "HI-3", label: "Final files shared in the portal", position: 2 },
      { id: "HI-4", label: "Final invoice paid", position: 3 },
      { id: "HI-5", label: "All milestones approved", position: 4 },
    ])
    .onConflictDoNothing();

  await db
    .insert(deletionRequests)
    .values([
      { id: "DR-7", clientId: "atlas", client: "Atlas Property", contact: "Ray Khan", requestLabel: "14 Nov 2026", reason: "Closed the business, wants all data removed.", position: 0 },
      { id: "DR-6", clientId: "ridgeline", client: "Ridgeline Cleaning", contact: "Marco Reyes", requestLabel: "9 Nov 2026", reason: "Moved to another provider, asks for an export first.", position: 1 },
    ])
    .onConflictDoNothing();
  console.log("reference content seeded");
}


async function seedSettingsAndTaskDetail() {
  await db
    .insert(notificationSettings)
    .values([
      { id: "briefing", label: "Daily AI briefing", hint: "Every weekday at 7:30 am", scope: "team", enabled: true, position: 0 },
      { id: "sla", label: "SLA breach alerts", hint: "When a ticket is close to breaching", scope: "team", enabled: true, position: 1 },
      { id: "replies", label: "Client replies", hint: "Portal and email replies", scope: "team", enabled: true, position: 2 },
      { id: "digest", label: "Weekly board digest", hint: "Friday summary of all projects", scope: "team", enabled: false, position: 3 },
      { id: "updates", label: "Weekly board updates", hint: "Tasks, demos and reports", scope: "client", enabled: true, position: 10 },
      { id: "approvals", label: "Approvals and Blueprints", hint: "When something needs your answer", scope: "client", enabled: true, position: 11 },
      { id: "invoices", label: "Invoices and payments", hint: "Due dates and receipts", scope: "client", enabled: true, position: 12 },
      { id: "news", label: "Product news", hint: "New modules and features", scope: "client", enabled: false, position: 13 },
    ])
    .onConflictDoNothing();

  await db
    .insert(clientNotificationPrefs)
    .values([
      { clientId: "brightline", settingId: "updates", enabled: true },
      { clientId: "brightline", settingId: "approvals", enabled: true },
      { clientId: "brightline", settingId: "invoices", enabled: true },
      { clientId: "brightline", settingId: "news", enabled: false },
    ])
    .onConflictDoNothing();

  await db
    .insert(healthRules)
    .values([
      { id: "on-track", label: "On track", body: "No milestone overdue and no task past its week.", tone: "success", position: 0 },
      { id: "at-risk", label: "At risk", body: "One milestone overdue, or two client approvals waiting over 3 days.", tone: "warning", position: 1 },
      { id: "late", label: "Late", body: "More than one milestone overdue, or launch date passed.", tone: "danger", position: 2 },
    ])
    .onConflictDoNothing();

  await db
    .insert(taskChecklistItems)
    .values([
      { id: "TC-1", taskId: "T-901", label: "Implementation finished", done: true, position: 0 },
      { id: "TC-2", taskId: "T-901", label: "Checked against the Blueprint", done: true, position: 1 },
      { id: "TC-3", taskId: "T-901", label: "PM reviewed the copy", done: false, position: 2 },
    ])
    .onConflictDoNothing();

  await db
    .insert(taskComments)
    .values([
      { id: "TCM-1", taskId: "T-901", author: "Maya", body: "Copy is approved. Sam, can you keep the export behind the PM role?", atLabel: "2 hrs ago", position: 0 },
      { id: "TCM-2", taskId: "T-901", author: "Sam", body: "Yes, done. Adding the test case now.", atLabel: "1 hr ago", position: 1 },
    ])
    .onConflictDoNothing();

  await db
    .insert(projectMilestones)
    .values([
      { id: "brightline-portal-m1", projectId: "brightline-portal", title: "Foundation", dueOn: "2026-11-04", position: 0 },
      { id: "brightline-portal-m2", projectId: "brightline-portal", title: "Scheduling", dueOn: "2026-11-11", position: 1 },
      { id: "brightline-portal-m3", projectId: "brightline-portal", title: "Clients and portal", dueOn: "2026-11-22", position: 2 },
      { id: "brightline-portal-m4", projectId: "brightline-portal", title: "Billing", dueOn: "2026-12-02", position: 3 },
      { id: "brightline-portal-m5", projectId: "brightline-portal", title: "Launch", dueOn: "2026-12-12", position: 4 },
    ])
    .onConflictDoNothing();
  console.log("settings, task detail and project milestones seeded");
}

async function main() {
  await seedClients();
  await seedRequirements();
  await seedBlueprints();
  await seedProjects();
  await seedProjectDetails();
  await seedContracts();
  await seedInvoices();
  await seedActivity();
  await seedTasks();
  await seedCalls();
  await seedFiles();
  await seedTickets();
  await seedThreads();
  await seedCampaigns();
  await seedTeam();
  await seedOnboarding();
  await seedWorkRequests();
  await seedCannedReplies();
  await seedInstallments();
  await seedPortal();
  await seedFinancePlans();
  await seedReferenceContent();
  await seedSettingsAndTaskDetail();
  console.log("Seed complete.");
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
