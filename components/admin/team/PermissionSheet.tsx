"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/admin/ui/Avatar";
import { AppDialog } from "@/components/ui/app-dialog";
import { FormSelect } from "@/components/ui/form-field";
import {
  PERMISSION_KEYS,
  PERMISSION_SECTIONS,
  TEAM_ROLES,
  type Permissions,
  type PermissionKey,
  type TeamMember,
  type TeamRole,
} from "@/lib/team-data";
import { cn } from "@/lib/utils";

/**
 * Member mode edits one teammate. Role mode edits a global role with no
 * member picker; saving it applies to everyone who has that role.
 */
export function PermissionSheet({
  open,
  onOpenChange,
  mode,
  members,
  memberId,
  initialRole = "Developer",
  roleDefaults,
  onSaveMember,
  onSaveRole,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "member" | "role";
  members: TeamMember[];
  memberId?: string;
  initialRole?: TeamRole;
  roleDefaults: Record<TeamRole, Permissions>;
  onSaveMember: (id: string, role: TeamRole, permissions: Permissions) => void;
  onSaveRole: (role: TeamRole, permissions: Permissions) => void;
}) {
  const member =
    mode === "member"
      ? (members.find((item) => item.id === memberId) ?? members[0])
      : undefined;
  const [role, setRole] = useState<TeamRole>(member?.role ?? initialRole);
  const [permissions, setPermissions] = useState<Permissions>(() =>
    structuredClone(member ? member.permissions : roleDefaults[initialRole]),
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (mode === "member" && !member) return null;

  const roleCount = member
    ? 0
    : members.filter((item) => item.role === role).length;

  function toggle(sectionId: string, key: PermissionKey) {
    setPermissions((current) => ({
      ...current,
      [sectionId]: {
        ...current[sectionId],
        [key]: !current[sectionId]?.[key],
      },
    }));
    setDirty(true);
  }

  function changeRole(nextRole: TeamRole) {
    setRole(nextRole);
    setPermissions(structuredClone(roleDefaults[nextRole]));
    setDirty(true);
  }

  function discard() {
    if (member) {
      setRole(member.role);
      setPermissions(structuredClone(member.permissions));
    } else {
      setRole(initialRole);
      setPermissions(structuredClone(roleDefaults[initialRole]));
    }
    setDirty(false);
  }

  function save() {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setDirty(false);
      if (member) {
        onSaveMember(member.id, role, permissions);
        toast.success("Role and permissions updated", {
          description: `${member.name} now has ${role.toLowerCase()} access.`,
        });
      } else {
        onSaveRole(role, permissions);
        toast.success(`${role} role updated`, {
          description: `${roleCount} ${roleCount === 1 ? "member" : "members"} now use these permissions.`,
        });
      }
      window.setTimeout(() => onOpenChange(false), 2000);
    }, 450);
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      dirty={dirty && !saved}
      initialFocus="first"
    >
      <AppDialog.Header
        icon={ShieldCheck}
        title={mode === "member" ? "User permissions" : "Global role permissions"}
        subtitle={
          mode === "member"
            ? "Select what this teammate can see or do in the app."
            : "Set what everyone with this role can see or do. Individual members can still be adjusted from the team list."
        }
      />
      <AppDialog.Body>
        {member ? (
          <div className="flex items-center gap-3 rounded-[var(--radius-dialog-preview)] border border-border bg-card p-3">
            <Avatar initials={member.initials} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{member.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {member.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-[var(--radius-dialog-preview)] border border-border bg-card p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{role}</p>
              <p className="truncate text-xs text-muted-foreground">
                {roleCount} {roleCount === 1 ? "member" : "members"} · applies
                globally
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormSelect
            id="permission-role"
            label={member ? "Role" : "Global role"}
            hint={
              member
                ? undefined
                : "Saving updates every member with this role."
            }
            value={role}
            onChange={(event) => changeRole(event.target.value as TeamRole)}
          >
            {TEAM_ROLES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FormSelect>
        </div>

        <div className="overflow-x-auto rounded-[var(--radius-dialog-preview)] border border-border">
          <table className="w-full min-w-[300px] text-left text-sm sm:min-w-[560px]">
            <thead className="border-b border-border bg-secondary/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 font-medium">Section</th>
                {PERMISSION_KEYS.map((key) => (
                  <th
                    key={key}
                    className="w-12 px-1 py-2.5 text-center font-medium capitalize sm:w-[92px] sm:px-2"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PERMISSION_SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <tr key={section.id}>
                    <td className="px-3 py-2.5">
                      <span className="flex items-center gap-2 text-xs font-medium">
                        <Icon
                          className="size-3.5 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        {section.label}
                      </span>
                    </td>
                    {PERMISSION_KEYS.map((key) => {
                      const available = section.available.includes(key);
                      return (
                        <td
                          key={key}
                          className="px-1 py-2.5 text-center sm:px-2"
                        >
                          {available ? (
                            <PermissionToggle
                              checked={permissions[section.id]?.[key] ?? false}
                              label={`${section.label} ${key} access`}
                              onChange={() => toggle(section.id, key)}
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              -
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AppDialog.Body>
      <AppDialog.Footer
        status={saved ? "saved" : dirty ? "dirty" : undefined}
        secondary={{ label: "Discard", onClick: discard }}
        primary={{
          label: "Save changes",
          onClick: save,
          disabled: !dirty || saving,
          loading: saving,
        }}
      />
    </AppDialog>
  );
}

function PermissionToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="inline-flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span
        className={cn(
          "relative inline-flex h-4 w-7 shrink-0 items-center rounded-full border transition-colors",
          checked ? "border-primary bg-primary" : "border-border bg-input",
        )}
      >
        <span
          className={cn(
            "block size-3 rounded-full border border-border bg-card shadow-sm transition-transform",
            checked ? "translate-x-3.5" : "translate-x-0.5",
          )}
        />
      </span>
      <span
        className={cn(
          "hidden text-[11px] sm:inline",
          checked ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {checked ? "Active" : "Disabled"}
      </span>
    </button>
  );
}
