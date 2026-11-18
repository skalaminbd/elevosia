"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Plus, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Point = { id: string; text: string; must: boolean };
type Section = { id: string; title: string; points: Point[] };

const seed: Section[] = [
  {
    id: "s1",
    title: "Scheduling",
    points: [
      { id: "p1", text: "Clients can book a visit online and get a text reminder the day before.", must: true },
      { id: "p2", text: "Open shifts show in one weekly board for the office team.", must: true },
      { id: "p3", text: "Caregivers can see their day on a phone.", must: false },
    ],
  },
  {
    id: "s2",
    title: "Clients and billing",
    points: [
      { id: "p4", text: "Invoices go out from completed visits without retyping.", must: true },
      { id: "p5", text: "Families can see visit updates in a portal.", must: false },
    ],
  },
];

let counter = 100;

export function RequirementsBuilder() {
  const [name, setName] = useState("");
  const [sections, setSections] = useState<Section[]>(seed);
  const [budget, setBudget] = useState("$10,000 to $20,000");
  const [deadline, setDeadline] = useState("");
  const [nda, setNda] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const points = sections.flatMap((section) => section.points);
  const filledPoints = points.filter((point) => point.text.trim().length > 0);
  const mustCount = filledPoints.filter((point) => point.must).length;

  function addSection() {
    counter += 1;
    setSections((current) => [
      ...current,
      { id: `s${counter}`, title: "New section", points: [] },
    ]);
  }

  function addPoint(sectionId: string) {
    counter += 1;
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              points: [
                ...section.points,
                { id: `p${counter}`, text: "", must: true },
              ],
            }
          : section,
      ),
    );
  }

  function updateSection(sectionId: string, title: string) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId ? { ...section, title } : section,
      ),
    );
  }

  function updatePoint(sectionId: string, pointId: string, text: string) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              points: section.points.map((point) =>
                point.id === pointId ? { ...point, text } : point,
              ),
            }
          : section,
      ),
    );
  }

  function togglePoint(sectionId: string, pointId: string) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              points: section.points.map((point) =>
                point.id === pointId ? { ...point, must: !point.must } : point,
              ),
            }
          : section,
      ),
    );
  }

  function removePoint(sectionId: string, pointId: string) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              points: section.points.filter((point) => point.id !== pointId),
            }
          : section,
      ),
    );
  }

  function removeSection(sectionId: string) {
    setSections((current) => current.filter((section) => section.id !== sectionId));
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-success/30 bg-card p-6 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-heading text-xl font-semibold">Requirements submitted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your PM has it. Your Blueprint is due by <strong>26 Nov 2026</strong>, five
          business days from today. You can reply to comments on each point while it is in
          review.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/portal"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground"
          >
            Back to home
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/portal/approvals"
            className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-xs font-medium hover:bg-secondary"
          >
            See approvals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="space-y-4 xl:col-span-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <Label htmlFor="project-name" className="text-xs font-medium">
            Project name
          </Label>
          <input
            id="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="For example: Care team dashboard"
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Write it the way you would say it to your team.
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.id} className="rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border p-4">
              <input
                value={section.title}
                onChange={(event) => updateSection(section.id, event.target.value)}
                aria-label="Section title"
                className="h-9 min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 text-sm font-semibold outline-none hover:border-border focus-visible:border-ring"
              />
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                aria-label={`Remove ${section.title}`}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </button>
            </div>
            <ul className="divide-y divide-border">
              {section.points.map((point) => (
                <li key={point.id} className="flex items-start gap-2 p-3">
                  <textarea
                    value={point.text}
                    onChange={(event) => updatePoint(section.id, point.id, event.target.value)}
                    rows={2}
                    aria-label="Feature point"
                    placeholder="What should it do, in plain words?"
                    className="min-w-0 flex-1 resize-none rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm outline-none hover:border-border focus-visible:border-ring"
                  />
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => togglePoint(section.id, point.id)}
                      aria-pressed={point.must}
                      className={cn(
                        "h-7 rounded-full px-2.5 text-[10px] font-medium",
                        point.must
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {point.must ? "Must-have" : "Nice-to-have"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removePoint(section.id, point.id)}
                      aria-label="Remove point"
                      className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive"
                    >
                      <Trash2 className="size-3" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-3">
              <button
                type="button"
                onClick={() => addPoint(section.id)}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-primary hover:bg-primary/5"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                Add point
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addSection}
          className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add section
        </button>

        <div className="grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="budget" className="text-xs font-medium">
              Rough budget
            </Label>
            <select
              id="budget"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option>Under $5,000</option>
              <option>$5,000 to $10,000</option>
              <option>$10,000 to $20,000</option>
              <option>$20,000+</option>
              <option>Not sure yet</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deadline" className="text-xs font-medium">
              Deadline (optional)
            </Label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="flex items-start gap-2 sm:col-span-2">
            <Checkbox
              id="nda"
              checked={nda}
              onCheckedChange={(value) => setNda(value === true)}
            />
            <div>
              <Label htmlFor="nda" className="text-sm font-medium">
                Request an NDA first
              </Label>
              <p className="text-xs text-muted-foreground">
                We send it for e-signature before anyone reads the requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSaved(true)}
              className="h-10 rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary"
            >
              Save draft
            </button>
            <button
              type="button"
              onClick={() => {
                if (!name.trim() || filledPoints.length === 0) return;
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-40"
              disabled={!name.trim() || filledPoints.length === 0}
            >
              Submit requirements
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {saved ? "Draft saved in this browser · " : ""}
            {filledPoints.length} points · {mustCount} must-have
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <SectionCard title="How to write a good point" description="Plain words win">
          <div className="space-y-3 p-5 text-sm text-muted-foreground">
            <p>Start with what happens today, then what should happen instead.</p>
            <div className="rounded-md bg-secondary/60 p-3 text-xs">
              <p className="font-medium text-foreground">Example</p>
              <p className="mt-1">
                “Clients can book a visit online and get a text reminder the day before.”
              </p>
            </div>
            <p>Mark a point must-have if the build cannot launch without it.</p>
          </div>
        </SectionCard>

        <SectionCard title="This submission" description="Live count">
          <div className="space-y-2 p-5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sections</span>
              <span className="font-mono">{sections.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Points</span>
              <span className="font-mono">{filledPoints.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Must-have</span>
              <span className="font-mono">{mustCount}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge tone="neutral">Draft</StatusBadge>
            </div>
          </div>
        </SectionCard>

        <p className="px-1 text-[11px] text-muted-foreground">
          A Blueprint is due within 5 business days of submitting. You can reply to
          comments while it is in review.
        </p>
      </div>
    </div>
  );
}
