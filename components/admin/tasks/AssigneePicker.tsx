"use client";

import { useMemo, useState } from "react";
import { Check, Search, UserMinus, UserPlus } from "lucide-react";
import { Avatar } from "@/components/admin/ui/Avatar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTeamOptions } from "@/hooks/use-team-options";
import { cn } from "@/lib/utils";

const ME = "Alamin";
const shortName = (name: string) => name.split(" ")[0];

/** Team picker with search, role and weekly load. Suggests the least loaded. */
export function AssigneePicker({
  value,
  onChange,
  label,
  compact = false,
  allowUnassign = true,
  members,
}: {
  value: string;
  onChange: (name: string) => void;
  label: string;
  compact?: boolean;
  allowUnassign?: boolean;
  /** Project team. When set, only these people can be picked. */
  members?: string[];
}) {
  const team = useTeamOptions();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const people = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pool = members
      ? team.filter(
          (person) =>
            members.includes(person.name) ||
            members.includes(shortName(person.name)),
        )
      : team;
    return [...pool]
      .filter(
        (person) =>
          needle.length === 0 ||
          person.name.toLowerCase().includes(needle) ||
          person.role.toLowerCase().includes(needle),
      )
      .sort((a, b) => a.planned / a.capacity - b.planned / b.capacity);
  }, [query, members, team]);

  const current = team.find((person) => shortName(person.name) === value);

  function choose(name: string) {
    onChange(name);
    setOpen(false);
    setQuery("");
    setActive(0);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${label}: ${value || "Unassigned"}`}
          className={cn(
            "flex items-center gap-2 rounded-lg border border-transparent px-1.5 py-1 text-left transition-colors hover:border-border hover:bg-secondary/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
            compact ? "text-[11px]" : "text-sm",
          )}
        >
          {current ? (
            <Avatar initials={current.initials} className="size-6 text-[9px]" />
          ) : (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-dashed border-muted-foreground/50 text-muted-foreground">
              <UserPlus className="size-3" aria-hidden="true" />
            </span>
          )}
          <span className={cn("truncate", !current && "text-muted-foreground")}>
            {value || "Unassigned"}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={6} className="w-72 p-0">
        <div className="border-b border-border p-2">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActive((index) => Math.min(index + 1, people.length - 1));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActive((index) => Math.max(index - 1, 0));
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  const person = people[active];
                  if (person) choose(shortName(person.name));
                }
              }}
              placeholder="Search team"
              aria-label="Search team"
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        {!value ? (
          <div className="border-b border-border p-1">
            <button
              type="button"
              onClick={() => choose(ME)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium transition-colors hover:bg-secondary"
            >
              <UserPlus
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              Take this task
            </button>
          </div>
        ) : null}

        <ul
          role="listbox"
          aria-label="Project team"
          className="max-h-64 overflow-y-auto p-1"
        >
          {people.length === 0 ? (
            <li className="px-2 py-3 text-center text-xs text-muted-foreground">
              No one matches that search.
            </li>
          ) : (
            people.map((person, index) => {
              const short = shortName(person.name);
              const percent = Math.round(
                (person.planned / person.capacity) * 100,
              );
              return (
                <li key={person.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === short}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(short)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors",
                      active === index && "bg-secondary",
                    )}
                  >
                    <Avatar
                      initials={person.initials}
                      className="size-7 text-[9px]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-medium">
                          {person.name}
                        </span>
                        {value === short ? (
                          <Check
                            className="size-3 text-success"
                            aria-hidden="true"
                          />
                        ) : null}
                      </span>
                      <span className="block truncate text-[10px] text-muted-foreground">
                        {person.role}
                      </span>
                      <span className="mt-1 block h-1 overflow-hidden rounded-full bg-secondary">
                        <span
                          className={cn(
                            "block h-full rounded-full",
                            percent > 100
                              ? "bg-destructive"
                              : percent >= 80
                                ? "bg-warning"
                                : "bg-primary",
                          )}
                          style={{ width: `${Math.min(100, percent)}%` }}
                        />
                      </span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[10px]",
                        percent > 100
                          ? "text-destructive"
                          : "text-muted-foreground",
                      )}
                    >
                      {person.planned}/{person.capacity}h
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {allowUnassign && value ? (
          <div className="border-t border-border p-1">
            <button
              type="button"
              onClick={() => choose("")}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
            >
              <UserMinus className="size-3.5" aria-hidden="true" />
              Unassign
            </button>
          </div>
        ) : null}

        <p className="border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
          {members
            ? "Only this project's team shows here. Admin and PM can add someone in Project settings."
            : "Every staff member shows here."}
        </p>
      </PopoverContent>
    </Popover>
  );
}
