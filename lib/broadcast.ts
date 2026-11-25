import { CHANNEL_CLOSE, CHANNEL_OPEN } from "@/data/schedule";
import { toMin, watParts } from "@/lib/time";
import type { LiveState, ScheduleSlot } from "@/lib/types";

export interface OnAir {
  /** What viewers should see: the presenter's state, or off air outside channel hours. */
  state: LiveState;
  outsideHours: boolean;
  current?: ScheduleSlot;
  next: ScheduleSlot[];
  progress: number; // 0..1
  minutesLeft: number;
  nowHHMM: string;
  date: string;
}

export function onAir(schedule: ScheduleSlot[], now: Date, live: LiveState, nextCount = 3): OnAir {
  const { date, minutes, hhmm } = watParts(now);
  const outsideHours = minutes < toMin(CHANNEL_OPEN) || minutes >= toMin(CHANNEL_CLOSE);
  const today = schedule.filter((s) => s.date === date);
  const current = outsideHours ? undefined : today.find((s) => toMin(s.start) <= minutes && minutes < toMin(s.end));
  const upcoming = schedule.filter((s) => s.date > date || (s.date === date && toMin(s.start) > minutes));
  const next = upcoming.slice(0, nextCount);
  let progress = 0;
  let minutesLeft = 0;
  if (current) {
    const st = toMin(current.start);
    const en = toMin(current.end);
    progress = (minutes - st) / (en - st);
    minutesLeft = en - minutes;
  }
  return {
    state: outsideHours ? "off-air" : live,
    outsideHours,
    current,
    next,
    progress,
    minutesLeft,
    nowHHMM: hhmm,
    date,
  };
}

/** Upcoming live events and premieres, soonest first. */
export function upcomingEvents(schedule: ScheduleSlot[], now: Date) {
  const { date, minutes } = watParts(now);
  return schedule.filter((s) => (s.event || (s.programmeId === "safe-nigeria" && s.location)) && (s.date > date || (s.date === date && toMin(s.end) > minutes)));
}

export const WATCHING_NOW = 12480;
