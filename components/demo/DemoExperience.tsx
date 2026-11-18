"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  Check,
  LayoutGrid,
  MonitorSmartphone,
  ReceiptText,
  Sparkles,
  Users,
} from "lucide-react";
import {
  demoAiQuestions,
  demoClient,
  demoPrompts,
  demoPromptsTitle,
} from "@/content/demo";
import { Section } from "@/components/shared/Section";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  AiView,
  ClientsView,
  InvoicesView,
  OverviewView,
  PortalView,
  ScheduleView,
  type DemoViewProps,
} from "@/components/demo/DemoViews";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type Tab = "overview" | "schedule" | "clients" | "invoices" | "ai" | "portal";

const TABS: { id: Tab; label: string; short: string; icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Overview", short: "Overview", icon: LayoutGrid },
  { id: "schedule", label: "Schedule", short: "Schedule", icon: CalendarDays },
  { id: "clients", label: "Clients", short: "Clients", icon: Users },
  { id: "invoices", label: "Invoices", short: "Invoices", icon: ReceiptText },
  { id: "ai", label: "Ask AI", short: "Ask AI", icon: Sparkles },
  { id: "portal", label: "Client portal", short: "Portal", icon: MonitorSmartphone },
];

/**
 * The interactive demo. All state lives in memory; every action is local and
 * reversible with Reset. Views are presentational so the prompts column can
 * drive the same state.
 */
export function DemoExperience() {
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState<Tab>("overview");
  const [filled, setFilled] = useState(false);
  const [filling, setFilling] = useState(false);
  const [reminded, setReminded] = useState(false);
  const [sending, setSending] = useState(false);
  const [approved, setApproved] = useState(false);
  const [portalPaid, setPortalPaid] = useState(false);
  const [query, setQuery] = useState("");
  const [aiId, setAiId] = useState<string | null>(null);
  const [aiText, setAiText] = useState("");
  const [portalVisited, setPortalVisited] = useState(false);

  useEffect(() => {
    if (!aiId || reduceMotion) return;
    const answer =
      demoAiQuestions.find((item) => item.id === aiId)?.answer ?? "";
    let index = 0;
    const interval = window.setInterval(() => {
      index += 2;
      setAiText(answer.slice(0, index));
      if (index >= answer.length) window.clearInterval(interval);
    }, 18);
    return () => window.clearInterval(interval);
  }, [aiId, reduceMotion]);

  function selectTab(next: Tab) {
    setTab(next);
    if (next === "portal") setPortalVisited(true);
  }

  function onAutoFill() {
    if (filled || filling) return;
    if (reduceMotion) {
      setFilled(true);
      return;
    }
    setFilling(true);
    window.setTimeout(() => {
      setFilling(false);
      setFilled(true);
    }, 1500);
  }

  function onRemind() {
    if (reminded || sending) return;
    setSending(true);
    window.setTimeout(
      () => {
        setSending(false);
        setReminded(true);
      },
      reduceMotion ? 0 : 1200,
    );
  }

  function onAsk(id: string) {
    const answer =
      demoAiQuestions.find((item) => item.id === id)?.answer ?? "";
    setAiId(id);
    setAiText(reduceMotion ? answer : "");
  }

  function reset() {
    setTab("overview");
    setFilled(false);
    setFilling(false);
    setReminded(false);
    setSending(false);
    setApproved(false);
    setPortalPaid(false);
    setQuery("");
    setAiId(null);
    setAiText("");
    setPortalVisited(false);
  }

  const done = {
    schedule: filled,
    portal: portalVisited,
    ai: aiId !== null,
  } as Record<string, boolean>;

  const viewProps: DemoViewProps = {
    filled,
    filling,
    reminded,
    sending,
    approved,
    portalPaid,
    query,
    aiId,
    aiText,
    onQuery: setQuery,
    onAutoFill,
    onRemind,
    onAsk,
    onApprove: () => setApproved(true),
    onPay: () => setPortalPaid(true),
    onGoAsk: () => selectTab("ai"),
  };

  return (
    <Section id="demo">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-9">
          <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-md">
            {!reduceMotion ? (
              <BorderBeam
                size={90}
                duration={16}
                borderWidth={1.5}
                colorFrom="var(--primary)"
                colorTo="var(--success)"
              />
            ) : null}

            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-primary font-heading text-[11px] font-bold text-primary-foreground">
                  B
                </span>
                <span className="text-xs font-semibold">Brightline Care</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] text-muted-foreground">
                  Sample
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden text-[10px] text-muted-foreground sm:block">
                  {demoClient.user} · {demoClient.role}
                </span>
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 font-mono text-[9px] font-semibold text-primary">
                  {demoClient.initials}
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[180px_1fr]">
              <nav
                aria-label="Demo dashboard"
                className="hidden border-r border-border p-2.5 lg:block"
              >
                <ul className="space-y-0.5">
                  {TABS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => selectTab(item.id)}
                          aria-current={tab === item.id ? "page" : undefined}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors",
                            tab === item.id
                              ? "bg-primary/10 font-medium text-primary"
                              : "text-muted-foreground hover:bg-secondary/60",
                          )}
                        >
                          <Icon className="size-3.5" aria-hidden="true" />
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 rounded-md border border-border bg-background p-3">
                  <p className="text-[11px] font-medium">Yours, not ours</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                    Every screen is built from modules we customize.
                  </p>
                </div>
              </nav>

              <div className="min-w-0">
                <div className="min-h-[520px] p-4 sm:p-5">
                  {tab === "overview" ? (
                    <OverviewView
                      filled={filled}
                      reminded={reminded}
                      onGoAsk={viewProps.onGoAsk}
                    />
                  ) : null}
                  {tab === "schedule" ? (
                    <ScheduleView
                      filled={filled}
                      filling={filling}
                      onAutoFill={onAutoFill}
                    />
                  ) : null}
                  {tab === "clients" ? (
                    <ClientsView
                      query={query}
                      onQuery={setQuery}
                      filled={filled}
                    />
                  ) : null}
                  {tab === "invoices" ? (
                    <InvoicesView
                      reminded={reminded}
                      sending={sending}
                      onRemind={onRemind}
                    />
                  ) : null}
                  {tab === "ai" ? (
                    <AiView aiId={aiId} aiText={aiText} onAsk={onAsk} />
                  ) : null}
                  {tab === "portal" ? (
                    <PortalView
                      approved={approved}
                      portalPaid={portalPaid}
                      onApprove={() => setApproved(true)}
                      onPay={() => setPortalPaid(true)}
                    />
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2.5">
                  <p className="text-[10px] text-muted-foreground">
                    Demo data. Not a real company. Nothing is saved.
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="text-[10px] font-medium text-muted-foreground hover:text-foreground"
                  >
                    Reset demo
                  </button>
                </div>

                <div className="grid grid-cols-6 border-t border-border lg:hidden">
                  {TABS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectTab(item.id)}
                        aria-current={tab === item.id ? "page" : undefined}
                        className={cn(
                          "flex flex-col items-center gap-1 py-2.5 text-[9px] transition-colors",
                          tab === item.id
                            ? "font-medium text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        <Icon className="size-3.5" aria-hidden="true" />
                        {item.short}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-3">
          <div className="rounded-lg border border-border bg-card p-4 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{demoPromptsTitle}</h3>
              <span className="font-mono text-[10px] text-muted-foreground">
                {Object.values(done).filter(Boolean).length}/3
              </span>
            </div>

            <ul className="mt-3 space-y-2">
              {demoPrompts.map((prompt, index) => {
                const complete = done[prompt.id];
                const isNext =
                  !complete && !demoPrompts.slice(0, index).some((p) => !done[p.id]);

                return (
                  <li key={prompt.id}>
                    <button
                      type="button"
                      onClick={() => selectTab(prompt.target as Tab)}
                      className={cn(
                        "relative w-full rounded-md border p-3 text-left transition-colors",
                        complete
                          ? "border-success/30 bg-success/5"
                          : isNext
                            ? "border-primary/40 bg-background"
                            : "border-border bg-background hover:bg-secondary/50",
                      )}
                    >
                      {isNext && !reduceMotion ? (
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-md border border-primary/40"
                          animate={{ opacity: [0.2, 0.7, 0.2] }}
                          transition={{ duration: 2.6, repeat: Infinity }}
                        />
                      ) : null}
                      <span className="flex items-start gap-2">
                        <span
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                            complete
                              ? "bg-success text-success-foreground"
                              : "border border-muted-foreground/40",
                          )}
                        >
                          {complete ? (
                            <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                          ) : (
                            <span className="font-mono text-[8px] text-muted-foreground">
                              {index + 1}
                            </span>
                          )}
                        </span>
                        <span>
                          <span className="block text-xs font-medium">
                            {prompt.title}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
                            {prompt.body}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
              This is a front-end demo of the modules. The real build runs on
              your data, your roles and your rules.
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}
