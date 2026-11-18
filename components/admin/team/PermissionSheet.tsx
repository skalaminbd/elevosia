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
  permissionsFor,
  type Permissions,
  type PermissionKey,
  type TeamMember,
  type TeamRole,
} from "@/lib/team-data";
import { cn } from "@/lib/utils";

export function PermissionSheet({
  open,
  onOpenChange,
  members,
  memberId,
  onMemberChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: TeamMember[];
  memberId: string;
  onMemberChange: (id: string) => void;
  onSave: (id: string, role: TeamRole, permissions: Permissions) => void;
}) {
  const member = members.find((item) => item.id === memberId) ?? members[0];
  const [role, setRole] = useState<TeamRole>(member?.role ?? "Developer");
  const [permissions, setPermissions] = useState<Permissions>(() =>
    structuredClone(member?.permissions ?? permissionsFor("Developer")),
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!member) return null;

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
    setPermissions(permissionsFor(nextRole));
    setDirty(true);
  }

  function discard() {
    setRole(member.role);
    setPermissions(structuredClone(member.permissions));
    setDirty(false);
  }

  function save() {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setDirty(false);
      onSave(member.id, role, permissions);
      toast.success("Role and permissions updated", {
        description: `${member.name} now has ${role.toLowerCase()} access.`,
      });
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
        title="User permissions"
        subtitle="Select what a user can see or do in the app."
      />
      <AppDialog.Body>
        <div className="flex items-center gap-3 rounded-[var(--radius-dialog-preview)] border border-border bg-card p-3">
          <Avatar initials={member.initials} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{member.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {member.email}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormSelect
            id="permission-member"
            label="Team member"
            value={member.id}
            onChange={(event) => onMemberChange(event.target.value)}
          >
            {members.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </FormSelect>
          <FormSelect
            id="permission-role"
            label="Role"
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
