// Citizen reporting: shared types and the scripted fallbacks for the report-intake and report-triage AI features.
// Live versions are in lib/server/features.ts; the browser falls back to these (lib/ai-client.ts).

import { CATEGORIES, categoryInfo, type ReportCategory } from "@/data/agencies";
import { LGAS, PLACE_HINTS } from "@/data/lgas";
import { states } from "@/data/places";
import type { CitizenReport, Urgency } from "@/data/reports";

export interface ReportIntake {
  category: ReportCategory;
  summary: string;
  state: string; // state id or ""
  lga: string;
  landmark: string;
  when: string;
  urgency: Urgency;
  followUp: string;
  isEmergency: boolean;
}

export type ReportTriage = NonNullable<CitizenReport["triage"]>;

export const REPORT_EXAMPLE = "Water is entering houses on our street near the Ganaja junction in Lokoja. The drain is overflowing and people are carrying their things upstairs. It started about an hour ago.";

const DANGER_NOW = /(right now|happening now|trapped|drowning|bleeding|unconscious|on fire now|still burning|shooting|someone is (hurt|injured)|help us|we need help|people (are )?inside)/i;

function firstSentence(t: string, max = 140) {
  const s = t.split(/(?<=[.!?])\s+/)[0] ?? t;
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

/** Scripted intake: keyword category, place hints, landmark phrase, urgency. */
export function reportIntake(text: string, hint?: ReportCategory): ReportIntake {
  const t = text.trim();
  const category = hint ?? CATEGORIES.find((c) => c.keywords.test(t))?.id ?? "other";
  const place = PLACE_HINTS.find((p) => p.re.test(t));
  const stateHit = place?.state ?? states.find((s) => new RegExp(`\\b${s.name}\\b`, "i").test(t) || (s.id === "FC" && /\b(abuja|fct)\b/i.test(t)))?.id ?? "";
  const lgaHit = place?.lga ?? (stateHit && LGAS[stateHit] ? LGAS[stateHit].find((l) => new RegExp(`\\b${l.split(/[ /(]/)[0]}\\b`, "i").test(t)) ?? "" : "");
  const landmark = (t.match(/\b(?:near|at|opposite|beside|behind|by|along)\s+(?:the\s+)?([^,.;]{3,50}?)(?=[,.;]| in | and | where |$)/i)?.[1] ?? "").trim();
  const when = t.match(/\b(right now|now|this (morning|afternoon|evening)|tonight|today|yesterday|(about|around) (an hour|\d+ (hours?|minutes?)) ago|since (about )?\d{1,2}(:\d{2})? ?(am|pm)?|(about|around|at) \d{1,2}(:\d{2})? ?(am|pm))\b/i)?.[0] ?? "";
  const high = category === "fire" || category === "building-collapse" || category === "power-line" || (category === "flood" && /\b(entering|rising|homes?|houses?|families|people)\b/i.test(t));
  const urgency: Urgency = high ? "high" : category === "community" ? "low" : "medium";
  return {
    category,
    summary: firstSentence(t),
    state: stateHit,
    lga: lgaHit,
    landmark,
    when,
    urgency,
    followUp: categoryInfo(category).followUp,
    isEmergency: DANGER_NOW.test(t),
  };
}

/** Scripted triage for the newsroom. */
export function reportTriage(r: Pick<CitizenReport, "category" | "summary" | "details">): ReportTriage {
  const text = `${r.summary} ${r.details}`;
  const abuse = /\b(fuck|shit|idiot|stupid|useless police|test test|asdf)\b/i.test(text) || text.trim().length < 20;
  const urgency: Urgency = ["fire", "building-collapse", "power-line"].includes(r.category) || (r.category === "flood" && /\b(homes?|houses?|families|rising|entering)\b/i.test(text)) ? "high" : r.category === "community" ? "low" : "medium";
  const newsworthy = !abuse && r.category !== "other";
  return {
    urgency,
    newsworthy,
    abuse,
    reason: abuse
      ? "Looks like a test or abusive message. Check before acting."
      : r.category === "community"
        ? "Positive community story; could suit Community Watch."
        : `${categoryInfo(r.category).label} report; check with the state command before publishing.`,
  };
}

/** Reports in the same category and LGA (or state) within 6 hours form a cluster. */
export function clusterKey(r: CitizenReport) {
  return `${r.category}|${r.state}|${(r.lga || "").toLowerCase()}`;
}

export function clusters(reports: CitizenReport[]) {
  const SIX_H = 6 * 60 * 60 * 1000;
  const groups = new Map<string, CitizenReport[]>();
  for (const r of reports.filter((x) => x.status !== "not-used")) {
    const k = clusterKey(r);
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }
  return Array.from(groups.values())
    .map((g) => g.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1)))
    .filter((g) => g.length >= 2 && new Date(g[g.length - 1].createdAt).getTime() - new Date(g[0].createdAt).getTime() <= SIX_H);
}
