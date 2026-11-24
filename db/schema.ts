/**
 * Elevosia database schema (Neon Postgres + Drizzle).
 *
 * Money is stored in cents. Display code converts to dollars.
 * Pilot module: requirements → blueprints → projects → custom invoices.
 */

import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  industry: text("industry").notNull().default(""),
  status: text("status").notNull().default("Active"),
  pm: text("pm").notNull().default(""),
  timezone: text("timezone").notNull().default(""),
  initials: text("initials").notNull().default(""),
  plan: text("plan").notNull().default(""),
  balanceCents: integer("balance_cents").notNull().default(0),
  source: text("source").notNull().default(""),
  clientSince: date("client_since", { mode: "string" }),
  sinceLabel: text("since_label").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const clientCompanies = pgTable(
  "client_companies",
  {
    id: serial("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    address: text("address").notNull().default(""),
    city: text("city").notNull().default(""),
    region: text("region").notNull().default(""),
    zip: text("zip").notNull().default(""),
    phone: text("phone").notNull().default(""),
    website: text("website").notNull().default(""),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    uniqueIndex("client_companies_position_idx").on(
      table.clientId,
      table.position,
    ),
  ],
);

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    blueprintId: text("blueprint_id"),
    pm: text("pm").notNull().default(""),
    status: text("status").notNull().default("Planning"),
    startDate: date("start_date", { mode: "string" }),
    health: text("health").notNull().default("On track"),
    progress: integer("progress").notNull().default(0),
    phase: text("phase").notNull().default(""),
    nextMilestone: text("next_milestone").notNull().default(""),
    modules: integer("modules").notNull().default(0),
    priceCents: integer("price_cents").notNull().default(0),
    usedCents: integer("used_cents").notNull().default(0),
    dueLabel: text("due_label").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("projects_client_idx").on(table.clientId)],
);

export const projectMilestones = pgTable(
  "project_milestones",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    dueOn: date("due_on", { mode: "string" }),
    approval: text("approval"),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    uniqueIndex("project_milestones_position_idx").on(
      table.projectId,
      table.position,
    ),
  ],
);

export const projectTasks = pgTable(
  "project_tasks",
  {
    id: text("id").primaryKey(),
    milestoneId: text("milestone_id")
      .notNull()
      .references(() => projectMilestones.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    hours: integer("hours").notNull().default(0),
    visible: boolean("visible").notNull().default(true),
    done: boolean("done").notNull().default(false),
    week: text("week").notNull().default(""),
    state: text("state").notNull().default("next"),
    assignee: text("assignee").notNull().default(""),
    priority: text("priority").notNull().default("Normal"),
    dueLabel: text("due_label").notNull().default(""),
    estimate: real("estimate").notNull().default(0),
    logged: real("logged").notNull().default(0),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    uniqueIndex("project_tasks_position_idx").on(
      table.milestoneId,
      table.position,
    ),
  ],
);

export const projectScopes = pgTable("project_scopes", {  projectId: text("project_id")
    .primaryKey()
    .references(() => projects.id, { onDelete: "cascade" }),
  requirementId: text("requirement_id").notNull(),
  requirementTitle: text("requirement_title").notNull().default(""),
  blueprintId: text("blueprint_id").notNull(),
  approvedAt: timestamp("approved_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  invoiceId: text("invoice_id"),
});

export const projectScopePoints = pgTable(
  "project_scope_points",
  {
    id: serial("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projectScopes.projectId, { onDelete: "cascade" }),
    text: text("text").notNull(),
    mustHave: boolean("must_have").notNull().default(false),
    milestoneId: text("milestone_id").notNull(),
    milestoneTitle: text("milestone_title").notNull().default(""),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    uniqueIndex("project_scope_points_position_idx").on(
      table.projectId,
      table.position,
    ),
  ],
);

export const blueprints = pgTable(
  "blueprints",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    requirementId: text("requirement_id"),
    title: text("title").notNull(),
    status: text("status").notNull().default("Draft"),
    version: text("version").notNull().default("v1"),
    validUntil: date("valid_until", { mode: "string" }),
    priceCents: integer("price_cents").notNull().default(0),
    milestoneCount: integer("milestone_count").notNull().default(0),
  },
  (table) => [index("blueprints_client_idx").on(table.clientId)],
);

export const blueprintMilestones = pgTable(
  "blueprint_milestones",
  {
    id: text("id").primaryKey(),
    blueprintId: text("blueprint_id")
      .notNull()
      .references(() => blueprints.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    uniqueIndex("blueprint_milestones_position_idx").on(
      table.blueprintId,
      table.position,
    ),
  ],
);

export const blueprintTasks = pgTable(
  "blueprint_tasks",
  {
    id: text("id").primaryKey(),
    milestoneId: text("milestone_id")
      .notNull()
      .references(() => blueprintMilestones.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    hours: integer("hours").notNull().default(0),
    visible: boolean("visible").notNull().default(true),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    uniqueIndex("blueprint_tasks_position_idx").on(
      table.milestoneId,
      table.position,
    ),
  ],
);

export const blueprintSuggestions = pgTable(
  "blueprint_suggestions",
  {
    id: text("id").primaryKey(),
    blueprintId: text("blueprint_id")
      .notNull()
      .references(() => blueprints.id, { onDelete: "cascade" }),
    milestoneId: text("milestone_id").notNull(),
    taskId: text("task_id").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    hours: integer("hours").notNull().default(0),
    visible: boolean("visible").notNull().default(true),
    note: text("note"),
    status: text("status").notNull().default("pending"),
    by: text("by").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    finalName: text("final_name"),
    finalDescription: text("final_description"),
    finalHours: integer("final_hours"),
    finalVisible: boolean("final_visible"),
    decisionNote: text("decision_note"),
  },
  (table) => [index("blueprint_suggestions_blueprint_idx").on(table.blueprintId)],
);

export const requirements = pgTable(
  "requirements",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    submittedOn: date("submitted_on", { mode: "string" }),
    dueOn: date("due_on", { mode: "string" }),
    overdue: boolean("overdue").notNull().default(false),
    status: text("status").notNull().default("Submitted"),
    budget: text("budget").notNull().default(""),
    pointsCount: integer("points_count").notNull().default(0),
  },
  (table) => [index("requirements_client_idx").on(table.clientId)],
);

export const requirementSections = pgTable(
  "requirement_sections",
  {
    id: serial("id").primaryKey(),
    requirementId: text("requirement_id")
      .notNull()
      .references(() => requirements.id, { onDelete: "cascade" }),
    sectionKey: text("section_key").notNull(),
    title: text("title").notNull(),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    uniqueIndex("requirement_sections_key_idx").on(
      table.requirementId,
      table.sectionKey,
    ),
  ],
);

export const requirementPoints = pgTable(
  "requirement_points",
  {
    id: serial("id").primaryKey(),
    sectionId: integer("section_id")
      .notNull()
      .references(() => requirementSections.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    mustHave: boolean("must_have").notNull().default(false),
    comment: text("comment"),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    uniqueIndex("requirement_points_position_idx").on(
      table.sectionId,
      table.position,
    ),
  ],
);

export const requirementReviews = pgTable(
  "requirement_reviews",
  {
    requirementId: text("requirement_id")
      .notNull()
      .references(() => requirements.id, { onDelete: "cascade" }),
    sectionKey: text("section_key").notNull(),
    pointIndex: integer("point_index").notNull(),
    blueprintId: text("blueprint_id").notNull(),
    milestoneId: text("milestone_id"),
    state: text("state").notNull().default("skipped"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.requirementId, table.sectionKey, table.pointIndex],
    }),
    index("requirement_reviews_blueprint_idx").on(table.blueprintId),
  ],
);

export const contracts = pgTable(
  "contracts",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    type: text("type").notNull(),
    status: text("status").notNull().default("Draft"),
    signedOn: date("signed_on", { mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("contracts_client_idx").on(table.clientId)],
);

export const contractTemplates = pgTable("contract_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  body: text("body").notNull().default(""),
  usedCount: integer("used_count").notNull().default(0),
  updatedOn: date("updated_on", { mode: "string" }),
});

export const invoices = pgTable(
  "invoices",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    kind: text("kind").notNull().default("Custom"),
    lineItem: text("line_item").notNull().default(""),
    amountCents: integer("amount_cents").notNull().default(0),
    dueOn: date("due_on", { mode: "string" }),
    dueLabel: text("due_label").notNull().default(""),
    status: text("status").notNull().default("Due"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("invoices_client_idx").on(table.clientId),
    index("invoices_project_idx").on(table.projectId),
  ],
);

export const activities = pgTable("activities", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  detail: text("detail").notNull().default(""),
  timeLabel: text("time_label").notNull().default(""),
  kind: text("kind").notNull().default("client"),
  position: integer("position").notNull().default(0),
});

export const tasks = pgTable(
  "tasks",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id"),
    clientId: text("client_id"),
    title: text("title").notNull(),
    assignee: text("assignee").notNull().default(""),
    reviewer: text("reviewer"),
    milestone: text("milestone"),
    linkedType: text("linked_type"),
    linkedId: text("linked_id"),
    linkedTitle: text("linked_title"),
    week: text("week").notNull().default(""),
    status: text("status").notNull().default("todo"),
    dueLabel: text("due_label").notNull().default(""),
    priority: text("priority").notNull().default("Normal"),
    estimate: real("estimate").notNull().default(0),
    logged: real("logged").notNull().default(0),
    clientVisible: boolean("client_visible").notNull().default(false),
  },
  (table) => [index("tasks_project_idx").on(table.projectId)],
);

export const calls = pgTable("calls", {
  id: text("id").primaryKey(),
  clientId: text("client_id"),
  dayLabel: text("day_label").notNull().default(""),
  timeLabel: text("time_label").notNull().default(""),
  title: text("title").notNull(),
  kind: text("kind").notNull().default("Weekly"),
  owner: text("owner").notNull().default(""),
  position: integer("position").notNull().default(0),
});

export const files = pgTable(
  "files",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id"),
    projectId: text("project_id"),
    projectLabel: text("project_label").notNull().default(""),
    name: text("name").notNull(),
    folder: text("folder").notNull().default(""),
    sizeLabel: text("size_label").notNull().default(""),
    updatedLabel: text("updated_label").notNull().default(""),
    visible: boolean("visible").notNull().default(true),
    version: text("version").notNull().default("v1"),
    position: integer("position").notNull().default(0),
  },
  (table) => [index("files_client_idx").on(table.clientId)],
);

export const tickets = pgTable(
  "tickets",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id"),
    projectId: text("project_id"),
    projectLabel: text("project_label"),
    subject: text("subject").notNull(),
    description: text("description").notNull().default(""),
    status: text("status").notNull().default("New"),
    priority: text("priority").notNull().default("P3"),
    category: text("category").notNull().default(""),
    assignee: text("assignee"),
    carePlan: text("care_plan").notNull().default(""),
    warranty: boolean("warranty").notNull().default(false),
    billableHours: real("billable_hours").notNull().default(0),
    channel: text("channel").notNull().default("Portal"),
    sla: jsonb("sla"),
    requester: jsonb("requester"),
    cc: jsonb("cc"),
    followers: jsonb("followers"),
    tags: jsonb("tags"),
    linked: jsonb("linked"),
    rating: jsonb("rating"),
    unread: integer("unread").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("tickets_client_idx").on(table.clientId)],
);

export const ticketMessages = pgTable(
  "ticket_messages",
  {
    id: text("id").primaryKey(),
    ticketId: text("ticket_id")
      .notNull()
      .references(() => tickets.id, { onDelete: "cascade" }),
    author: text("author").notNull(),
    sender: text("sender").notNull().default("Staff"),
    channel: text("channel").notNull().default("Portal"),
    body: text("body").notNull(),
    unread: boolean("unread").notNull().default(false),
    internal: boolean("internal").notNull().default(false),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("ticket_messages_ticket_idx").on(table.ticketId)],
);

export const ticketEvents = pgTable(
  "ticket_events",
  {
    id: text("id").primaryKey(),
    ticketId: text("ticket_id")
      .notNull()
      .references(() => tickets.id, { onDelete: "cascade" }),
    kind: text("kind").notNull().default("created"),
    text: text("text").notNull(),
    actor: text("actor").notNull().default(""),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("ticket_events_ticket_idx").on(table.ticketId)],
);

export const threads = pgTable(
  "threads",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id"),
    projectId: text("project_id"),
    title: text("title").notNull().default(""),
    withLabel: text("with_label").notNull().default(""),
    preview: text("preview").notNull().default(""),
    timeLabel: text("time_label").notNull().default(""),
    unread: integer("unread").notNull().default(0),
    scope: text("scope").notNull().default("admin"),
    position: integer("position").notNull().default(0),
  },
  (table) => [index("threads_client_idx").on(table.clientId)],
);

export const threadMessages = pgTable(
  "thread_messages",
  {
    id: text("id").primaryKey(),
    threadId: text("thread_id")
      .notNull()
      .references(() => threads.id, { onDelete: "cascade" }),
    author: text("author").notNull(),
    self: boolean("self").notNull().default(false),
    body: text("body").notNull(),
    timeLabel: text("time_label").notNull().default(""),
    at: timestamp("at", { withTimezone: true }),
    position: integer("position").notNull().default(0),
  },
  (table) => [index("thread_messages_thread_idx").on(table.threadId)],
);

export const campaigns = pgTable("campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  channel: text("channel").notNull().default(""),
  status: text("status").notNull().default("Planned"),
  dueLabel: text("due_label").notNull().default(""),
  owner: text("owner").notNull().default(""),
  progress: integer("progress").notNull().default(0),
});

export const teamMembers = pgTable("team_members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  initials: text("initials").notNull().default(""),
  email: text("email"),
  access: jsonb("access"),
  status: text("status").notNull().default("active"),
  lastActive: date("last_active", { mode: "string" }),
  added: date("added", { mode: "string" }),
  planned: real("planned").notNull().default(0),
  capacity: real("capacity").notNull().default(40),
  projectCount: integer("project_count").notNull().default(0),
});

export const timesheets = pgTable("timesheets", {
  id: text("id").primaryKey(),
  member: text("member").notNull(),
  projectLabel: text("project_label").notNull().default(""),
  task: text("task").notNull().default(""),
  hours: real("hours").notNull().default(0),
  weekLabel: text("week_label").notNull().default(""),
});

export const onboardingCards = pgTable("onboarding_cards", {
  id: text("id").primaryKey(),
  stage: text("stage").notNull(),
  clientId: text("client_id"),
  client: text("client").notNull(),
  missing: text("missing").notNull().default(""),
  daysLabel: text("days_label").notNull().default(""),
  position: integer("position").notNull().default(0),
});

export const workRequests = pgTable("work_requests", {
  id: text("id").primaryKey(),
  clientId: text("client_id"),
  title: text("title").notNull(),
  detail: text("detail").notNull().default(""),
  hours: real("hours").notNull().default(0),
  submittedLabel: text("submitted_label").notNull().default(""),
  status: text("status").notNull().default("Submitted"),
  pm: text("pm").notNull().default(""),
});

export const cannedReplies = pgTable("canned_replies", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull().default(""),
  body: text("body").notNull(),
});

export const installments = pgTable("installments", {
  id: text("id").primaryKey(),
  clientId: text("client_id"),
  totalCents: integer("total_cents").notNull().default(0),
  paidCents: integer("paid_cents").notNull().default(0),
  nextLabel: text("next_label").notNull().default(""),
  months: integer("months").notNull().default(1),
  missed: integer("missed").notNull().default(0),
});

export const retainers = pgTable("retainers", {
  clientId: text("client_id").primaryKey(),
  plan: text("plan").notNull(),
  status: text("status").notNull().default("Active"),
  priceCents: integer("price_cents").notNull().default(0),
  hours: real("hours").notNull().default(0),
  used: real("used").notNull().default(0),
  nextLabel: text("next_label").notNull().default(""),
  sla: text("sla").notNull().default(""),
});

export const retainerWork = pgTable("retainer_work", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  title: text("title").notNull(),
  hours: real("hours").notNull().default(0),
  dateLabel: text("date_label").notNull().default(""),
  position: integer("position").notNull().default(0),
});

export const projectChanges = pgTable(
  "project_changes",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").notNull(),
    title: text("title").notNull(),
    scope: text("scope").notNull().default(""),
    priceCents: integer("price_cents").notNull().default(0),
    days: integer("days").notNull().default(0),
    status: text("status").notNull().default("Waiting for client"),
    position: integer("position").notNull().default(0),
  },
  (table) => [index("project_changes_project_idx").on(table.projectId)],
);

export const projectAccess = pgTable(
  "project_access",
  {
    id: serial("id").primaryKey(),
    projectId: text("project_id").notNull(),
    name: text("name").notNull(),
    owner: text("owner").notNull().default(""),
    status: text("status").notNull().default(""),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    uniqueIndex("project_access_position_idx").on(
      table.projectId,
      table.position,
    ),
  ],
);

export const portalUsers = pgTable("portal_users", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  role: text("role").notNull().default("Member"),
  initials: text("initials").notNull().default(""),
  projectScope: text("project_scope").notNull().default(""),
});

export const portalApprovals = pgTable("portal_approvals", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  type: text("type").notNull().default("Milestone"),
  title: text("title").notNull(),
  detail: text("detail").notNull().default(""),
  dueLabel: text("due_label").notNull().default(""),
  amountCents: integer("amount_cents"),
  status: text("status").notNull().default("Pending"),
  position: integer("position").notNull().default(0),
});

export const approvalHistory = pgTable("approval_history", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  title: text("title").notNull(),
  action: text("action").notNull().default("Approved"),
  who: text("who").notNull().default(""),
  dateLabel: text("date_label").notNull().default(""),
});

export const portalReports = pgTable("portal_reports", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  title: text("title").notNull(),
  periodLabel: text("period_label").notNull().default(""),
  publishedLabel: text("published_label").notNull().default(""),
  highlights: jsonb("highlights"),
  position: integer("position").notNull().default(0),
});

export const callNotes = pgTable("call_notes", {
  id: text("id").primaryKey(),
  callTitle: text("call_title").notNull(),
  note: text("note").notNull().default(""),
  actions: integer("actions").notNull().default(0),
  position: integer("position").notNull().default(0),
});

export const marketingStats = pgTable("marketing_stats", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull().default(""),
  change: text("change").notNull().default(""),
  position: integer("position").notNull().default(0),
});

export const helpArticles = pgTable("help_articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull().default("Article"),
  position: integer("position").notNull().default(0),
});

export const handoverItems = pgTable("handover_items", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  position: integer("position").notNull().default(0),
});

export const notificationSettings = pgTable("notification_settings", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  hint: text("hint").notNull().default(""),
  scope: text("scope").notNull().default("team"),
  enabled: boolean("enabled").notNull().default(true),
  position: integer("position").notNull().default(0),
});

export const clientNotificationPrefs = pgTable(
  "client_notification_prefs",
  {
    clientId: text("client_id").notNull(),
    settingId: text("setting_id")
      .notNull()
      .references(() => notificationSettings.id, { onDelete: "cascade" }),
    enabled: boolean("enabled").notNull().default(true),
  },
  (table) => [
    primaryKey({ columns: [table.clientId, table.settingId] }),
  ],
);

export const healthRules = pgTable("health_rules", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  body: text("body").notNull().default(""),
  tone: text("tone").notNull().default("success"),
  position: integer("position").notNull().default(0),
});

export const taskChecklistItems = pgTable("task_checklist_items", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull(),
  label: text("label").notNull(),
  done: boolean("done").notNull().default(false),
  position: integer("position").notNull().default(0),
});

export const taskComments = pgTable("task_comments", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull(),
  author: text("author").notNull(),
  body: text("body").notNull(),
  atLabel: text("at_label").notNull().default(""),
  position: integer("position").notNull().default(0),
});

export const deletionRequests = pgTable("deletion_requests", {
  id: text("id").primaryKey(),
  clientId: text("client_id"),
  client: text("client").notNull().default(""),
  contact: text("contact").notNull().default(""),
  requestLabel: text("request_label").notNull().default(""),
  reason: text("reason").notNull().default(""),
  status: text("status").notNull().default("Pending"),
  position: integer("position").notNull().default(0),
});

export const portalCalls = pgTable("portal_calls", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  kind: text("kind").notNull().default("past"),
  title: text("title").notNull(),
  whenLabel: text("when_label").notNull().default(""),
  withLabel: text("with_label").notNull().default(""),
  joinLabel: text("join_label").notNull().default(""),
  notes: text("notes").notNull().default(""),
  actions: jsonb("actions"),
  position: integer("position").notNull().default(0),
});

/**
 * Public intake: what a visitor chose in the /start-project form. One row per
 * submission, with the selected modules, features, add-ons and services beside
 * it and any uploaded files linked to it. The Blueprint is built from these.
 */
export const intakeSubmissions = pgTable(
  "intake_submissions",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    serviceType: text("service_type").notNull(),
    teamSize: text("team_size").notNull().default(""),
    budget: text("budget").notNull().default(""),
    description: text("description").notNull(),
    deadline: date("deadline", { mode: "string" }),
    websiteNeeded: boolean("website_needed").notNull().default(false),
    websitePages: text("website_pages").notNull().default(""),
    nda: boolean("nda").notNull().default(false),
    status: text("status").notNull().default("Submitted"),
    source: text("source").notNull().default("Start a project"),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("intake_submissions_client_idx").on(table.clientId)],
);

export const intakeSelections = pgTable(
  "intake_selections",
  {
    id: serial("id").primaryKey(),
    submissionId: text("submission_id")
      .notNull()
      .references(() => intakeSubmissions.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    moduleKey: text("module_key").notNull().default(""),
    key: text("key").notNull(),
    label: text("label").notNull(),
    priceCents: integer("price_cents").notNull().default(0),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    uniqueIndex("intake_selections_key_idx").on(
      table.submissionId,
      table.kind,
      table.key,
    ),
    index("intake_selections_submission_idx").on(table.submissionId),
  ],
);

export const intakeFiles = pgTable(
  "intake_files",
  {
    id: serial("id").primaryKey(),
    submissionId: text("submission_id")
      .notNull()
      .references(() => intakeSubmissions.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    url: text("url").notNull(),
    contentType: text("content_type").notNull().default(""),
    sizeBytes: integer("size_bytes").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("intake_files_submission_idx").on(table.submissionId)],
);

// Better Auth tables (user, session, account, verification, twoFactor).
export * from "./auth-schema";
