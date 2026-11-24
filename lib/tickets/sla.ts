/**
 * Business-hours SLA maths: first response and resolution clocks.
 *
 * All helpers take `now` explicitly so nothing reads the clock during render.
 */

import type {
  CarePlan,
  TicketPriority,
  TicketRecord,
  TicketSla,
} from "@/lib/tickets/types";

export const BUSINESS_START_HOUR = 9;
export const BUSINESS_END_HOUR = 17;
export const BUSINESS_MINUTES_PER_DAY = (BUSINESS_END_HOUR - BUSINESS_START_HOUR) * 60;

/** First response target by priority, in business minutes. */
export const PRIORITY_TARGET_MINUTES: Record<TicketPriority, number> = {
  P1: 60,
  P2: 240,
  P3: 480,
};

/** The care plan can only make the promise faster, never slower than urgency. */
export const CARE_PLAN_TARGET_MINUTES: Record<CarePlan, number> = {
  None: BUSINESS_MINUTES_PER_DAY,
  Essential: BUSINESS_MINUTES_PER_DAY,
  Growth: 240,
  Partner: 60,
};

export function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function isBusinessTime(date: Date): boolean {
  if (!isBusinessDay(date)) return false;
  const hour = date.getHours() + date.getMinutes() / 60;
  return hour >= BUSINESS_START_HOUR && hour < BUSINESS_END_HOUR;
}

/** Add business minutes, skipping nights and weekends. */
export function addBusinessMinutes(start: Date, minutes: number): Date {
  if (minutes <= 0) return new Date(start);
  const cursor = new Date(start);
  let remaining = minutes;

  // Move into business hours first.
  while (remaining > 0) {
    if (!isBusinessDay(cursor)) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(BUSINESS_START_HOUR, 0, 0, 0);
      continue;
    }
    const hour = cursor.getHours() + cursor.getMinutes() / 60;
    if (hour < BUSINESS_START_HOUR) {
      cursor.setHours(BUSINESS_START_HOUR, 0, 0, 0);
      continue;
    }
    if (hour >= BUSINESS_END_HOUR) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(BUSINESS_START_HOUR, 0, 0, 0);
      continue;
    }

    const minutesLeftToday =
      (BUSINESS_END_HOUR - cursor.getHours()) * 60 - cursor.getMinutes();
    const step = Math.min(remaining, minutesLeftToday);
    cursor.setMinutes(cursor.getMinutes() + step);
    remaining -= step;

    if (remaining > 0) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(BUSINESS_START_HOUR, 0, 0, 0);
    }
  }
  return cursor;
}

/** Business minutes between two dates (never negative). */
export function businessMinutesBetween(start: Date, end: Date): number {
  if (end <= start) return 0;
  const cursor = new Date(start);
  let total = 0;
  while (cursor < end) {
    if (!isBusinessDay(cursor)) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(BUSINESS_START_HOUR, 0, 0, 0);
      continue;
    }
    const hour = cursor.getHours() + cursor.getMinutes() / 60;
    if (hour < BUSINESS_START_HOUR) {
      cursor.setHours(BUSINESS_START_HOUR, 0, 0, 0);
      continue;
    }
    if (hour >= BUSINESS_END_HOUR) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(BUSINESS_START_HOUR, 0, 0, 0);
      continue;
    }
    const minutesLeftToday =
      (BUSINESS_END_HOUR - cursor.getHours()) * 60 - cursor.getMinutes();
    const step = Math.min(
      minutesLeftToday,
      (end.getTime() - cursor.getTime()) / 60_000,
    );
    total += step;
    cursor.setMinutes(cursor.getMinutes() + step);
  }
  return Math.round(total);
}

export type SlaTimerState = "met" | "ok" | "warning" | "breached";

export type SlaTimer = {
  due: string;
  state: SlaTimerState;
  percent: number;
  minutesLeft: number;
  label: string;
};

export function slaTargets(priority: TicketPriority, carePlan: CarePlan) {
  const firstResponseMinutes = Math.min(
    PRIORITY_TARGET_MINUTES[priority],
    CARE_PLAN_TARGET_MINUTES[carePlan],
  );
  return {
    firstResponseMinutes,
    resolutionMinutes: firstResponseMinutes * 3,
  };
}

/** Human label for a number of minutes, e.g. "48 min", "1 hr 20", "2 days". */
export function formatMinutes(minutes: number): string {
  const value = Math.max(0, Math.round(minutes));
  if (value < 60) return `${value} min`;
  if (value < BUSINESS_MINUTES_PER_DAY) {
    const hours = Math.floor(value / 60);
    const rest = value % 60;
    return rest === 0 ? `${hours} hr` : `${hours} hr ${rest}`;
  }
  const days = Math.round(value / BUSINESS_MINUTES_PER_DAY);
  return `${days} ${days === 1 ? "day" : "days"}`;
}

function timerState(
  startedAt: Date,
  due: Date,
  respondedAt: Date | undefined,
  now: Date,
): Pick<SlaTimer, "state" | "percent" | "minutesLeft"> {
  const total = Math.max(1, businessMinutesBetween(startedAt, due));
  const elapsedEnd = respondedAt ?? now;
  const elapsed = businessMinutesBetween(startedAt, elapsedEnd);
  const percent = Math.min(100, Math.round((elapsed / total) * 100));
  const minutesLeft = businessMinutesBetween(now, due);
  if (respondedAt) {
    return {
      state: "met",
      percent,
      minutesLeft,
    };
  }
  if (now >= due) return { state: "breached", percent: 100, minutesLeft: 0 };
  return {
    state: percent >= 80 ? "warning" : "ok",
    percent,
    minutesLeft,
  };
}

function labelFor(
  state: SlaTimerState,
  minutesLeft: number,
  due: Date,
  now: Date,
): string {
  if (state === "met") return "Met";
  if (state === "breached") {
    return `Breached ${formatMinutes(businessMinutesBetween(due, now))}`;
  }
  return `${formatMinutes(minutesLeft)} left`;
}

export function firstResponseTimer(
  ticket: Pick<TicketRecord, "sla" | "createdAt">,
  now: Date,
): SlaTimer {
  const startedAt = new Date(ticket.createdAt);
  const due = new Date(ticket.sla.firstResponseDue);
  const respondedAt = ticket.sla.firstRespondedAt
    ? new Date(ticket.sla.firstRespondedAt)
    : undefined;
  const state = timerState(startedAt, due, respondedAt, now);
  return {
    due: ticket.sla.firstResponseDue,
    ...state,
    label: labelFor(state.state, state.minutesLeft, due, now),
  };
}

export function resolutionTimer(
  ticket: Pick<TicketRecord, "sla" | "createdAt">,
  now: Date,
): SlaTimer {
  const startedAt = new Date(ticket.createdAt);
  const due = new Date(ticket.sla.resolutionDue);
  const resolvedAt = ticket.sla.resolvedAt
    ? new Date(ticket.sla.resolvedAt)
    : undefined;
  const state = timerState(startedAt, due, resolvedAt, now);
  return {
    due: ticket.sla.resolutionDue,
    ...state,
    label: labelFor(state.state, state.minutesLeft, due, now),
  };
}

export type TicketSlaState = {
  firstResponse: SlaTimer;
  resolution: SlaTimer;
  worst: SlaTimerState;
};

const SEVERITY: Record<SlaTimerState, number> = {
  ok: 0,
  warning: 1,
  breached: 2,
  met: -1,
};

export function ticketSlaState(
  ticket: Pick<TicketRecord, "sla" | "createdAt">,
  now: Date,
): TicketSlaState {
  const firstResponse = firstResponseTimer(ticket, now);
  const resolution = resolutionTimer(ticket, now);
  const worst =
    SEVERITY[firstResponse.state] >= SEVERITY[resolution.state]
      ? firstResponse.state
      : resolution.state;
  return { firstResponse, resolution, worst };
}

/** Build a ticket's SLA deadlines from its start and targets. */
export function buildTicketSla(
  createdAt: Date,
  priority: TicketPriority,
  carePlan: CarePlan,
): TicketSla {
  const targets = slaTargets(priority, carePlan);
  return {
    firstResponseDue: addBusinessMinutes(
      createdAt,
      targets.firstResponseMinutes,
    ).toISOString(),
    resolutionDue: addBusinessMinutes(
      createdAt,
      targets.resolutionMinutes,
    ).toISOString(),
  };
}
