import {
  Bell,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Receipt,
  Settings,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export const TEAM_ROLES = [
  "Admin",
  "Project manager",
  "Developer",
  "Marketing",
  "Support",
] as const;

export type TeamRole = (typeof TEAM_ROLES)[number];
export type PermissionKey = "read" | "edit" | "import" | "export";
export type SectionPermissions = Partial<Record<PermissionKey, boolean>>;
export type Permissions = Record<string, SectionPermissions>;

export const PERMISSION_KEYS: PermissionKey[] = [
  "read",
  "edit",
  "import",
  "export",
];

export type PermissionSection = {
  id: string;
  label: string;
  icon: LucideIcon;
  available: PermissionKey[];
};

export const PERMISSION_SECTIONS: PermissionSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    available: ["read"],
  },
  {
    id: "clients",
    label: "Clients",
    icon: UsersRound,
    available: ["read", "edit", "import", "export"],
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    available: ["read", "edit"],
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: ListChecks,
    available: ["read", "edit"],
  },
  {
    id: "invoices",
    label: "Invoices",
    icon: Receipt,
    available: ["read", "edit", "import", "export"],
  },
  {
    id: "team",
    label: "Team",
    icon: Users,
    available: ["read", "edit"],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    available: ["read", "edit"],
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: Bell,
    available: ["read"],
  },
];

const ALL_SECTIONS = PERMISSION_SECTIONS.map((section) => section.id);

const ROLE_GRANTS: Record<
  TeamRole,
  Record<PermissionKey, string[]>
> = {
  Admin: {
    read: ALL_SECTIONS,
    edit: ALL_SECTIONS,
    import: ALL_SECTIONS,
    export: ALL_SECTIONS,
  },
  "Project manager": {
    read: ALL_SECTIONS,
    edit: ["clients", "projects", "tasks", "invoices", "team"],
    import: ["clients", "invoices"],
    export: ["clients", "invoices"],
  },
  Developer: {
    read: ["dashboard", "clients", "projects", "tasks", "alerts"],
    edit: ["projects", "tasks"],
    import: [],
    export: [],
  },
  Marketing: {
    read: ["dashboard", "clients", "projects", "settings", "alerts"],
    edit: ["settings"],
    import: [],
    export: [],
  },
  Support: {
    read: ["dashboard", "clients", "tasks", "invoices", "alerts"],
    edit: ["clients", "tasks"],
    import: [],
    export: [],
  },
};

export function permissionsFor(role: TeamRole): Permissions {
  const result: Permissions = {};
  for (const section of PERMISSION_SECTIONS) {
    const row: SectionPermissions = {};
    for (const key of section.available) {
      row[key] = ROLE_GRANTS[role][key].includes(section.id);
    }
    result[section.id] = row;
  }
  return result;
}

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: TeamRole;
  status: "active" | "disabled";
  access: string[];
  lastActive: string;
  added: string;
  permissions: Permissions;
};

export const initialTeam: TeamMember[] = [
  {
    id: "TM-1",
    name: "Alamin Rahman",
    email: "alamin@elevosia.co",
    initials: "AR",
    role: "Admin",
    status: "active",
    access: ["Data export", "Billing"],
    lastActive: "2026-11-19",
    added: "2024-02-12",
    permissions: permissionsFor("Admin"),
  },
  {
    id: "TM-2",
    name: "Maya Chen",
    email: "maya@elevosia.co",
    initials: "MC",
    role: "Project manager",
    status: "active",
    access: ["Data import", "Delivery"],
    lastActive: "2026-11-18",
    added: "2024-03-04",
    permissions: permissionsFor("Project manager"),
  },
  {
    id: "TM-3",
    name: "Sam Okafor",
    email: "sam@elevosia.co",
    initials: "SO",
    role: "Developer",
    status: "active",
    access: ["Delivery"],
    lastActive: "2026-11-17",
    added: "2024-04-22",
    permissions: permissionsFor("Developer"),
  },
  {
    id: "TM-4",
    name: "Lena Ortiz",
    email: "lena@elevosia.co",
    initials: "LO",
    role: "Marketing",
    status: "active",
    access: ["Campaigns"],
    lastActive: "2026-11-15",
    added: "2024-06-10",
    permissions: permissionsFor("Marketing"),
  },
  {
    id: "TM-5",
    name: "Rafi Ahmed",
    email: "rafi@elevosia.co",
    initials: "RA",
    role: "Support",
    status: "active",
    access: ["Data import"],
    lastActive: "2026-11-14",
    added: "2024-08-19",
    permissions: permissionsFor("Support"),
  },
  {
    id: "TM-6",
    name: "Ava Martins",
    email: "ava@elevosia.co",
    initials: "AM",
    role: "Developer",
    status: "active",
    access: ["Delivery"],
    lastActive: "2026-11-12",
    added: "2025-01-07",
    permissions: permissionsFor("Developer"),
  },
  {
    id: "TM-7",
    name: "Priya Nair",
    email: "priya@elevosia.co",
    initials: "PN",
    role: "Project manager",
    status: "disabled",
    access: ["Data export", "Delivery"],
    lastActive: "2026-10-28",
    added: "2025-02-11",
    permissions: permissionsFor("Project manager"),
  },
  {
    id: "TM-8",
    name: "Jonah Reed",
    email: "jonah@elevosia.co",
    initials: "JR",
    role: "Developer",
    status: "active",
    access: ["Delivery"],
    lastActive: "2026-11-09",
    added: "2025-03-25",
    permissions: permissionsFor("Developer"),
  },
  {
    id: "TM-9",
    name: "Tessa Wong",
    email: "tessa@elevosia.co",
    initials: "TW",
    role: "Marketing",
    status: "active",
    access: ["Campaigns", "Data export"],
    lastActive: "2026-11-05",
    added: "2025-05-14",
    permissions: permissionsFor("Marketing"),
  },
];

export function formatTeamDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
