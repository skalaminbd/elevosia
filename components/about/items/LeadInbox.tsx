"use client";

import { useEffect, useState } from "react";
import { Globe, Mail, Phone, Users } from "lucide-react";
import { aboutDemo } from "@/content/about";
import { AnimatedList } from "@/components/ui/animated-list";

const ICONS = {
  form: Globe,
  email: Mail,
  call: Phone,
  referral: Users,
} as const;

type LeadId = keyof typeof ICONS;

const isLeadId = (value: string): value is LeadId => value in ICONS;

type Lead = (typeof aboutDemo.leads)[number];

function LeadRow({ lead, index }: { lead: Lead; index: number }) {
  const Icon = isLeadId(lead.id) ? ICONS[lead.id] : Mail;

  return (
    <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {lead.name}
        </span>
        <span className="block text-xs text-muted-foreground">
          {lead.source} · {lead.meta}
        </span>
      </span>
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-warning/15 font-mono text-[10px] font-semibold text-warning">
        {index + 1}
      </span>
    </div>
  );
}

/**
 * Chapter 1 item: leads piling up in one inbox nobody is watching.
 */
export function LeadInbox({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  const [round, setRound] = useState(0);
  const leads = aboutDemo.leads;

  useEffect(() => {
    if (!active || reduceMotion) return;
    const timer = window.setInterval(
      () => setRound((value) => value + 1),
      leads.length * 1100 + 2600,
    );
    return () => window.clearInterval(timer);
  }, [active, reduceMotion, leads.length]);

  if (reduceMotion) {
    return (
      <div className="flex flex-col gap-2">
        {leads.map((lead, index) => (
          <LeadRow key={lead.id} lead={lead} index={index} />
        ))}
      </div>
    );
  }

  return (
    <AnimatedList key={round} delay={1100} className="gap-2">
      {leads.map((lead, index) => (
        <LeadRow key={lead.id} lead={lead} index={index} />
      ))}
    </AnimatedList>
  );
}
