"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Code2,
  FolderKanban,
  LifeBuoy,
  Megaphone,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Avatar } from "@/components/admin/ui/Avatar";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  StatusBadge,
  type BadgeTone,
} from "@/components/admin/ui/StatusBadge";
import { FilterDisclosure } from "@/components/shared/FilterDisclosure";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormField, FormSelect } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PermissionSheet } from "@/components/admin/team/PermissionSheet";
import { inviteStaff } from "@/app/admin/team/actions";
import {
  TEAM_ROLES,
  formatTeamDate,
  permissionsFor,
  type Permissions,
  type TeamMember,
  type TeamRole,
} from "@/lib/team-data";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;
let memberIdSeq = 100;

const ROLE_TONE: Record<TeamRole, BadgeTone> = {
  Admin: "accent",
  "Project manager": "info",
  Developer: "success",
  Marketing: "warning",
  Support: "neutral",
};

const ROLE_OPTIONS = [
  { id: "Admin", label: "Admin", icon: ShieldCheck },
  { id: "Project manager", label: "Project manager", icon: FolderKanban },
  { id: "Developer", label: "Developer", icon: Code2 },
  { id: "Marketing", label: "Marketing", icon: Megaphone },
  { id: "Support", label: "Support", icon: LifeBuoy },
];

const memberSchema = z.object({
  name: z.string().trim().min(2, "Enter the full name"),
  email: z.string().trim().email("Enter a valid email"),
  role: z.enum(TEAM_ROLES),
});

type MemberValues = z.infer<typeof memberSchema>;
type MemberErrors = Partial<Record<keyof MemberValues, string>>;

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TeamManagement({ initialMembers }: { initialMembers: TeamMember[] }) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [query, setQuery] = useState("");
  const [roleFilters, setRoleFilters] = useState<string[]>([]);
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [addSession, setAddSession] = useState(0);
  const [editSession, setEditSession] = useState(0);
  const confirm = useConfirm();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMemberId, setSheetMemberId] = useState(
    initialMembers[0]?.id ?? "",
  );
  const [permissionSession, setPermissionSession] = useState(0);
  const [roleSheetOpen, setRoleSheetOpen] = useState(false);
  const [roleSheetSession, setRoleSheetSession] = useState(0);
  const [roleDefaults, setRoleDefaults] = useState<
    Record<TeamRole, Permissions>
  >(
    () =>
      Object.fromEntries(
        TEAM_ROLES.map((role) => [role, permissionsFor(role)]),
      ) as Record<TeamRole, Permissions>,
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return members
      .filter((member) => {
        const matchesRole =
          roleFilters.length === 0 || roleFilters.includes(member.role);
        const matchesQuery =
          needle.length === 0 ||
          member.name.toLowerCase().includes(needle) ||
          member.email.toLowerCase().includes(needle);
        return matchesRole && matchesQuery;
      })
      .sort((a, b) =>
        sortDesc
          ? b.lastActive.localeCompare(a.lastActive)
          : a.lastActive.localeCompare(b.lastActive),
      );
  }, [members, query, roleFilters, sortDesc]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);
  const allOnPageSelected =
    pageRows.length > 0 &&
    pageRows.every((member) => selected.includes(member.id));

  function toggleOne(id: string, checked: boolean) {
    setSelected((current) =>
      checked
        ? [...new Set([...current, id])]
        : current.filter((item) => item !== id),
    );
  }

  function togglePage(checked: boolean) {
    const ids = pageRows.map((member) => member.id);
    setSelected((current) =>
      checked
        ? [...new Set([...current, ...ids])]
        : current.filter((id) => !ids.includes(id)),
    );
  }

  function openAdd() {
    setAddSession((value) => value + 1);
    setAddOpen(true);
  }

  function openEdit(member: TeamMember) {
    setEditing(member);
    setEditSession((value) => value + 1);
  }

  function openPermissions(memberId?: string) {
    const target = memberId ?? selected[0] ?? members[0]?.id;
    if (!target) return;
    setSheetMemberId(target);
    setPermissionSession((value) => value + 1);
    setSheetOpen(true);
  }

  function openRolePermissions() {
    setRoleSheetSession((value) => value + 1);
    setRoleSheetOpen(true);
  }

  async function addMember(values: MemberValues) {
    const invited = await inviteStaff({
      name: values.name,
      email: values.email,
      role: values.role,
    });
    if (!invited.ok) {
      toast.error(invited.error);
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const member: TeamMember = {
      id: `TM-${++memberIdSeq}`,
      name: values.name,
      email: values.email,
      initials: initialsOf(values.name),
      role: values.role,
      status: "active",
      access: [],
      lastActive: today,
      added: today,
      permissions: structuredClone(roleDefaults[values.role]),
    };
    setMembers((current) => [member, ...current]);
    setPage(1);
    toast.success("Invite sent", {
      description: `${values.email} can sign in with Google or an email code.`,
    });
  }

  function updateMember(member: TeamMember, values: MemberValues) {
    setMembers((current) =>
      current.map((item) => {
        if (item.id !== member.id) return item;
        const roleChanged = item.role !== values.role;
        return {
          ...item,
          name: values.name,
          email: values.email,
          initials: initialsOf(values.name),
          role: values.role,
          permissions: roleChanged
            ? structuredClone(roleDefaults[values.role])
            : item.permissions,
        };
      }),
    );

  }

  function toggleStatus(member: TeamMember) {
    const next = member.status === "active" ? "disabled" : "active";
    setMembers((current) =>
      current.map((item) =>
        item.id === member.id ? { ...item, status: next } : item,
      ),
    );
    toast.success(
      next === "active" ? "User activated" : "User disabled",
      { description: member.name },
    );
  }

  async function deleteMember(member: TeamMember) {
    const ok = await confirm({
      icon: Trash2,
      title: `Remove ${member.name}?`,
      subtitle: "They lose access immediately. This cannot be undone.",
      confirmLabel: "Remove user",
      tone: "danger",
    });
    if (!ok) return;
    setMembers((current) => current.filter((item) => item.id !== member.id));
    setSelected((current) => current.filter((id) => id !== member.id));
    toast.success("User removed", { description: member.name });
  }

  function savePermissions(
    id: string,
    role: TeamRole,
    permissions: Permissions,
  ) {
    setMembers((current) =>
      current.map((item) =>
        item.id === id ? { ...item, role, permissions } : item,
      ),
    );
  }

  function saveRolePermissions(role: TeamRole, permissions: Permissions) {
    setRoleDefaults((current) => ({
      ...current,
      [role]: structuredClone(permissions),
    }));
    setMembers((current) =>
      current.map((item) =>
        item.role === role
          ? { ...item, permissions: structuredClone(permissions) }
          : item,
      ),
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="Team management"
        description="Manage your team members and their account permissions here."
      >
        <Button variant="outline" onClick={openRolePermissions}>
          <ShieldCheck className="size-4" aria-hidden="true" />
          Update role &amp; permissions
        </Button>
      </PageHeader>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">All team</p>
            <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {filtered.length}
            </span>
            {selected.length > 0 ? (
              <span className="text-xs text-muted-foreground">
                {selected.length} selected
              </span>
            ) : null}
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="relative w-full sm:w-56">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search name or email"
                aria-label="Search team"
                className="w-full pl-9"
              />
            </div>
            <FilterDisclosure
              label="Filter"
              values={roleFilters}
              options={ROLE_OPTIONS}
              onChange={(values) => {
                setRoleFilters(values);
                setPage(1);
              }}
            />
            <Button onClick={openAdd}>
              <Plus className="size-4" aria-hidden="true" />
              Add user
            </Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <Users className="size-4" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-medium">No team members found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different name or clear the role filter.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setRoleFilters([]);
                setPage(1);
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[840px] text-left text-sm">
                <thead className="border-b border-border bg-secondary/40 text-xs text-muted-foreground">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <Checkbox
                        checked={allOnPageSelected}
                        onCheckedChange={(checked) =>
                          togglePage(checked === true)
                        }
                        aria-label="Select all team members on this page"
                      />
                    </th>
                    <th className="px-3 py-3 font-medium">User name</th>
                    <th className="px-3 py-3 font-medium">Access</th>
                    <th className="px-3 py-3 font-medium">
                      <button
                        type="button"
                        onClick={() => setSortDesc((value) => !value)}
                        aria-label={`Sort by last active ${sortDesc ? "ascending" : "descending"}`}
                        className="inline-flex items-center gap-1.5 hover:text-foreground"
                      >
                        Last active
                        {sortDesc ? (
                          <ArrowDown className="size-3.5" aria-hidden="true" />
                        ) : (
                          <ArrowUp className="size-3.5" aria-hidden="true" />
                        )}
                      </button>
                    </th>
                    <th className="px-3 py-3 font-medium">Date added</th>
                    <th className="w-14 px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pageRows.map((member) => (
                    <tr
                      key={member.id}
                      className={cn(
                        "transition-colors hover:bg-secondary/30",
                        member.status === "disabled" && "opacity-60",
                      )}
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selected.includes(member.id)}
                          onCheckedChange={(checked) =>
                            toggleOne(member.id, checked === true)
                          }
                          aria-label={`Select ${member.name}`}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar initials={member.initials} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {member.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                          {member.status === "disabled" ? (
                            <StatusBadge tone="neutral">Disabled</StatusBadge>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          <StatusBadge tone={ROLE_TONE[member.role]}>
                            {member.role}
                          </StatusBadge>
                          {member.access.map((access) => (
                            <StatusBadge key={access} tone="neutral">
                              {access}
                            </StatusBadge>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        {formatTeamDate(member.lastActive)}
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        {formatTeamDate(member.added)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <MemberActions
                          member={member}
                          onEdit={openEdit}
                          onPermissions={(item) => openPermissions(item.id)}
                          onToggle={toggleStatus}
                          onDelete={deleteMember}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {pageRows.map((member) => (
                <li
                  key={member.id}
                  className={cn(
                    "p-4",
                    member.status === "disabled" && "opacity-60",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selected.includes(member.id)}
                      onCheckedChange={(checked) =>
                        toggleOne(member.id, checked === true)
                      }
                      aria-label={`Select ${member.name}`}
                      className="mt-1"
                    />
                    <Avatar initials={member.initials} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate text-sm font-medium">
                          {member.name}
                        </p>
                        {member.status === "disabled" ? (
                          <StatusBadge tone="neutral">Disabled</StatusBadge>
                        ) : null}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                    <MemberActions
                      member={member}
                      onEdit={openEdit}
                      onPermissions={(item) => openPermissions(item.id)}
                      onToggle={toggleStatus}
                      onDelete={deleteMember}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <StatusBadge tone={ROLE_TONE[member.role]}>
                      {member.role}
                    </StatusBadge>
                    {member.access.map((access) => (
                      <StatusBadge key={access} tone="neutral">
                        {access}
                      </StatusBadge>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span>Last active {formatTeamDate(member.lastActive)}</span>
                    <span>Added {formatTeamDate(member.added)}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Showing {start + 1}–
                {Math.min(start + PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  <ChevronLeft className="size-3.5" aria-hidden="true" />
                </Button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                  (number) => (
                    <Button
                      key={number}
                      variant={number === currentPage ? "default" : "ghost"}
                      size="icon-sm"
                      aria-label={`Page ${number}`}
                      aria-current={
                        number === currentPage ? "page" : undefined
                      }
                      onClick={() => setPage(number)}
                    >
                      {number}
                    </Button>
                  ),
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Next page"
                  disabled={currentPage === pageCount}
                  onClick={() =>
                    setPage((value) => Math.min(pageCount, value + 1))
                  }
                >
                  <ChevronRight className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <MemberDialog
        key={`add-${addSession}`}
        mode="add"
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={(values) => addMember(values)}
      />

      <MemberDialog
        key={`edit-${editSession}`}
        mode="edit"
        member={editing ?? undefined}
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        onSave={(values) => {
          if (editing) updateMember(editing, values);
        }}
      />

      <PermissionSheet
        key={`permissions-${permissionSession}-${sheetMemberId}`}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode="member"
        members={members}
        memberId={sheetMemberId}
        roleDefaults={roleDefaults}
        onSaveMember={savePermissions}
        onSaveRole={saveRolePermissions}
      />

      <PermissionSheet
        key={`role-permissions-${roleSheetSession}`}
        open={roleSheetOpen}
        onOpenChange={setRoleSheetOpen}
        mode="role"
        members={members}
        roleDefaults={roleDefaults}
        onSaveMember={savePermissions}
        onSaveRole={saveRolePermissions}
      />
    </div>
  );
}


function MemberActions({
  member,
  onEdit,
  onPermissions,
  onToggle,
  onDelete,
}: {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onPermissions: (member: TeamMember) => void;
  onToggle: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${member.name}`}
        >
          <MoreVertical className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          onSelect={() => onEdit(member)}
          className="gap-2"
        >
          <Pencil aria-hidden="true" />
          Edit user
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onPermissions(member)}
          className="gap-2"
        >
          <ShieldCheck aria-hidden="true" />
          Role &amp; permissions
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => onToggle(member)}
          className="gap-2"
        >
          {member.status === "active" ? (
            <UserX aria-hidden="true" />
          ) : (
            <UserCheck aria-hidden="true" />
          )}
          {member.status === "active" ? "Disable user" : "Activate user"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => onDelete(member)}
          className="gap-2"
        >
          <Trash2 aria-hidden="true" />
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MemberDialog({
  mode,
  member,
  open,
  onOpenChange,
  onSave,
}: {
  mode: "add" | "edit";
  member?: TeamMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: MemberValues) => void;
}) {
  const [form, setForm] = useState<MemberValues>({
    name: member?.name ?? "",
    email: member?.email ?? "",
    role: member?.role ?? "Developer",
  });
  const [errors, setErrors] = useState<MemberErrors>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const formId = mode === "add" ? "add-member-dialog" : "edit-member-dialog";

  function update<K extends keyof MemberValues>(key: K, value: MemberValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setDirty(true);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = memberSchema.safeParse(form);
    if (!parsed.success) {
      const next: MemberErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof MemberValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setDirty(false);
      onSave(parsed.data);
      window.setTimeout(() => onOpenChange(false), 2000);
    }, 450);
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      dirty={dirty && !saved}
      initialFocus="first"
    >
      <AppDialog.Header
        icon={mode === "add" ? UserPlus : Pencil}
        title={mode === "add" ? "Add user" : "Edit user"}
        subtitle={
          mode === "add"
            ? "Invite a teammate and set their starting role."
            : "Update the name, email or role for this teammate."
        }
      />
      <AppDialog.Body>
        <form id={formId} onSubmit={submit} className="flex flex-col gap-[18px]" noValidate>
          <FormField
            id={`${mode}-member-name`}
            label="Full name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            error={errors.name}
          />
          <FormField
            id={`${mode}-member-email`}
            label="Work email"
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            error={errors.email}
          />
          <FormSelect
            id={`${mode}-member-role`}
            label="Role"
            value={form.role}
            onChange={(event) =>
              update("role", event.target.value as TeamRole)
            }
          >
            {TEAM_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </FormSelect>
        </form>
      </AppDialog.Body>
      <AppDialog.Footer
        status={saved ? "saved" : dirty ? "dirty" : undefined}
        secondary={{ label: "Cancel" }}
        primary={{
          label: mode === "add" ? "Add user" : "Save changes",
          type: "submit",
          form: formId,
          disabled:
            mode === "edit"
              ? !dirty || saving
              : !form.name.trim() || !form.email.includes("@") || saving,
          loading: saving,
        }}
      />
    </AppDialog>
  );
}
