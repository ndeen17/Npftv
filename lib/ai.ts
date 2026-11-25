// The AI layer.
//
// This demo has no backend, so every AI feature is answered in the browser by the
// scripted engines below: exact canned answers for the demo-script inputs, and
// simple rules for anything else. All AI calls go through `runAI`, so a real
// server route can be dropped in later without touching the UI.

import { captionCues } from "@/data/programmes";
import { CORRESPONDENT_DESKS, CORRESPONDENT_TOTAL, states } from "@/data/places";
import { guides } from "@/data/public";
import { budget, fmtNaira } from "@/data/ops";
import { toMin } from "@/lib/time";

export type ScamVerdict = "very_likely_scam" | "possibly_scam" | "no_obvious_signs";

export interface ScamResult {
  verdict: ScamVerdict;
  signs: string[];
  whatToDo: string;
  isEmergency?: boolean;
}

export interface AskResult {
  answer: string;
  sources: string[];
  isEmergency: boolean;
}

export interface AskDataResult {
  answer: string;
  figuresUsed: string[];
}

/** Simulated thinking time, so the "Checking…" state is visible in the demo. */
export async function runAI<T>(fn: () => T, instant = false): Promise<T> {
  const ms = instant ? 150 : 900 + Math.random() * 700;
  await new Promise((r) => setTimeout(r, ms));
  return fn();
}

// ---------------------------------------------------------------------------
// Scam checker

export const DEMO_SCAM_SMS =
  "URGENT: Your BVN has been blocked. Verify now at bvn-update-ng.co or your account will be closed in 24hrs. Send the OTP you receive to confirm.";

export function scamCheck(input: string): ScamResult {
  const t = input.toLowerCase();
  const signs: string[] = [];

  if (/\b(urgent|immediately|within \d+|24 ?hrs?|24 ?hours|today only|final warning|act now|expires?)\b/.test(t)) {
    signs.push(/24/.test(t) ? "It rushes you with a 24-hour deadline." : "It rushes you with a deadline or a threat.");
  }
  if (/(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|co|ng|net|org|info|xyz|link|top|site|online)\b)/.test(t)) {
    signs.push(/bvn|bank|cbn|account/.test(t) ? "The link doesn't belong to your bank or the Central Bank." : "It contains a link you didn't ask for.");
  }
  if (/\b(otp|one[- ]time|pin|password|cvv|token)\b/.test(t)) {
    signs.push("It asks for your OTP. No bank or police officer will ever ask for it.");
  } else if (/\bbvn\b/.test(t) && /(send|share|confirm|verify|update)/.test(t)) {
    signs.push("It asks you to confirm your BVN details. Banks don't do this by text.");
  }
  if (/(won|winner|prize|lottery|promo|reward|congratulations|gift)/.test(t)) {
    signs.push("It says you've won something you didn't enter.");
  }
  if (/(send|pay|transfer|deposit).{0,30}(₦|naira|n\d|money|fee|charge|recharge|airtime)/.test(t) || /(processing|release|clearance) fee/.test(t)) {
    signs.push("It asks you to pay a fee before you receive money or a service.");
  }
  if (/(loan|instant cash|no collateral|credit approved)/.test(t)) {
    signs.push("It offers a loan you didn't apply for.");
  }
  if (/(police|officer|efcc|arrest|warrant|court)/.test(t) && /(pay|send|transfer|bail|settle)/.test(t)) {
    signs.push("It threatens arrest unless you pay. Officers never ask for money by message.");
  }
  if (/(blocked|suspended|closed|deactivated|restricted)/.test(t) && !signs.some((s) => s.includes("rushes"))) {
    signs.push("It says your account has been blocked, to frighten you into acting.");
  }

  const unique = Array.from(new Set(signs)).slice(0, 5);
  const verdict: ScamVerdict = unique.length >= 2 ? "very_likely_scam" : unique.length === 1 ? "possibly_scam" : "no_obvious_signs";
  const whatToDo =
    verdict === "very_likely_scam"
      ? "don't reply or click the link. Delete the message and tell your bank."
      : verdict === "possibly_scam"
        ? "don't reply yet. Contact the organisation using a number you already trust, not one in the message."
        : "we didn't find the usual warning signs, but stay careful. Never share your PIN or OTP, and if in doubt, call your bank on the number on your card.";
  return { verdict, signs: unique, whatToDo };
}

// ---------------------------------------------------------------------------
// Ask NPFTV (public safety assistant)

const EMERGENCY = /(right now|happening now|in danger|attack(ed|ing)?|being robbed|kidnap|gun|shoot|bleeding|fire|someone is (breaking|outside)|help me|emergency|trapped|threaten(ed|ing) me)/i;

export function askNpftv(question: string): AskResult {
  const q = question.toLowerCase();
  if (EMERGENCY.test(q)) {
    return {
      answer:
        "If you or someone else is in danger now, call 112 straight away. It is free on every network. NPFTV is a television network, not an emergency service, and we can't send help. When you are safe, you can report what happened at your nearest police station.",
      sources: ["how-to-report-a-crime"],
      isEmergency: true,
    };
  }
  const scored = guides
    .map((g) => ({ g, score: g.keywords.reduce((n, k) => n + (q.includes(k) ? 1 : 0), 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  if (!scored.length) {
    return {
      answer:
        "I can only answer from NPFTV's public safety guides, and I couldn't find one that covers that. Try asking about scams and your OTP, protecting your home, travelling at night, or reporting a crime. For anything urgent, call 112.",
      sources: [],
      isEmergency: false,
    };
  }
  const top = scored[0].g;
  const steps = top.steps.slice(0, 3).join(" ");
  return {
    answer: `${steps} There's more in our guide, "${top.title}".`,
    sources: scored.slice(0, 2).map((x) => x.g.id),
    isEmergency: false,
  };
}

// ---------------------------------------------------------------------------
// Catch me up (from caption cues so far)

export function catchMeUp(nowHHMM: string, start = "19:00") {
  const now = toMin(nowHHMM);
  const picks = [
    { time: "19:01", text: "Commands will increase night patrols on major highways through the festive season." },
    { time: "19:05", text: "Night-time travel advice for the festive season: plan your route and avoid unofficial stops." },
    { time: "19:09", text: "Viewers warned about loan apps that demand access to phone contacts." },
    { time: "19:11", text: "The bomb disposal unit has completed its advanced field certification." },
    { time: "19:15", text: "News from the state commands, starting with Enugu's neighbourhood watch groups." },
  ];
  const sofar = picks.filter((p) => toMin(p.time) < now && toMin(p.time) >= toMin(start));
  return { bullets: sofar.slice(0, 3), minutes: Math.max(0, now - toMin(start)) };
}

export function captionAt(hhmm: string) {
  const m = toMin(hhmm);
  let cue = captionCues[0];
  for (const c of captionCues) if (toMin(c.time) <= m) cue = c;
  return cue.text;
}

// ---------------------------------------------------------------------------
// Translation drafts (always labelled "AI draft, needs review")

const PIDGIN: Record<string, string> = {
  "Bomb disposal unit completes advanced field certification": "Bomb disposal unit don finish advanced field training",
  "Formed police unit prepares for peacekeeping posting": "Police unit dey prepare for peacekeeping work for abroad",
  "Five signs a text message is a scam": "Five signs wey go show say text message na scam",
  "Kano opens safety forums in all 44 local government areas": "Kano don open safety forum for all 44 local government",
  "Festive season: commands step up night patrols on major highways": "Festive season: police go increase night patrol for major highway",
};
const HAUSA: Record<string, string> = {
  "Kano opens safety forums in all 44 local government areas": "Rundunar 'yan sandan Jihar Kano ta ƙaddamar da tarukan tsaron unguwanni a ƙananan hukumomi 44",
  "Kano command launches neighbourhood safety forums in 44 LGAs": "Rundunar 'yan sandan Jihar Kano ta ƙaddamar da tarukan tsaron unguwanni a ƙananan hukumomi 44",
};

export type Lang = "en" | "ha" | "pcm" | "yo" | "ig";
export const LANGS: { id: Lang; name: string; ready: boolean }[] = [
  { id: "en", name: "English", ready: true },
  { id: "ha", name: "Hausa", ready: true },
  { id: "pcm", name: "Pidgin", ready: true },
  { id: "yo", name: "Yoruba", ready: true },
  { id: "ig", name: "Igbo", ready: true },
];

export function translate(text: string, lang: Lang): string | null {
  if (lang === "en") return text;
  const table = lang === "ha" ? HAUSA : lang === "pcm" ? PIDGIN : null;
  return table?.[text] ?? null;
}

// ---------------------------------------------------------------------------
// Plain-language search

export interface SearchDoc {
  id: string;
  kind: "story" | "programme" | "guide" | "episode" | "state" | "rights";
  title: string;
  text: string;
  href: string;
}

const SYN: Record<string, string[]> = {
  scam: ["fraud", "otp", "bvn", "fake", "loan"],
  fraud: ["scam", "otp", "fake"],
  road: ["travel", "highway", "night", "motor"],
  travel: ["road", "highway", "festive"],
  christmas: ["festive"],
  holiday: ["festive", "home"],
  bomb: ["disposal", "eod"],
  kidnap: ["kidnapping"],
  report: ["reporting", "station"],
};

export function search(query: string, docs: SearchDoc[]) {
  const words = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["the", "and", "for", "how", "what", "can", "you", "are", "about", "with", "does", "who", "where", "when", "into", "from"].includes(w));
  const expanded = new Set(words.flatMap((w) => [w, ...(SYN[w] ?? [])]));
  return docs
    .map((d) => {
      const hay = `${d.title} ${d.text}`.toLowerCase();
      let score = 0;
      for (const w of expanded) {
        if (d.title.toLowerCase().includes(w)) score += 3;
        else if (hay.includes(w)) score += 1;
      }
      return { d, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((x) => x.d);
}

// ---------------------------------------------------------------------------
// Network Director: ask about the data

export const DIRECTOR_CHIPS = ["How often was OB Van 1 used in November?", "Which states sent the fewest stories?", "What's left in the Digital budget?"];

export function askData(question: string): AskDataResult {
  const q = question.toLowerCase();
  if (/ob ?van ?1|ob van one/.test(q)) {
    return { answer: "OB Van 1 was used on 11 days in November: 7 live events and 4 recorded shoots. It's booked again for Thursday's press briefing.", figuresUsed: ["OB Van 1: 11 days (7 live, 4 recorded)"] };
  }
  if (/ob ?van ?2/.test(q)) {
    return { answer: "OB Van 2 is available. A request for tyres and servicing (₦6.2m) is waiting for your approval.", figuresUsed: ["OB Van 2: available", "Servicing request: ₦6.2m"] };
  }
  if (/(fewest|least|lowest).*(stor|state|desk)|(stor|state|desk).*(fewest|least|lowest)/.test(q)) {
    const low = [...states].sort((a, b) => a.stories - b.stories).slice(0, 4);
    return {
      answer: `The four desks that sent the fewest stories in November were ${low.map((s) => `${s.name} (${s.stories})`).join(", ").replace(/, ([^,]*)$/, " and $1")}.`,
      figuresUsed: low.map((s) => `${s.name}: ${s.stories}`),
    };
  }
  if (/(most|highest|top).*(stor|state|desk)/.test(q)) {
    const top = [...states].sort((a, b) => b.stories - a.stories).slice(0, 4);
    return { answer: `The busiest desks in November were ${top.map((s) => `${s.name} (${s.stories})`).join(", ").replace(/, ([^,]*)$/, " and $1")}.`, figuresUsed: top.map((s) => `${s.name}: ${s.stories}`) };
  }
  const dept = budget.find((b) => q.includes(b.department.toLowerCase().split(" ")[0]));
  if (dept && /(budget|left|spent|used|remain)/.test(q)) {
    const left = dept.budget - dept.used;
    const pct = Math.round((dept.used / dept.budget) * 100);
    return {
      answer: `${dept.department} has used ${fmtNaira(dept.used)} of its ${fmtNaira(dept.budget)} Q4 budget (${pct}%), so ${fmtNaira(left)} is left with five weeks to go in the quarter.`,
      figuresUsed: [`${dept.department}: ${fmtNaira(dept.used)} of ${fmtNaira(dept.budget)}`],
    };
  }
  if (/(budget|spend|spent)/.test(q)) {
    return { answer: "₦184.2m of the ₦270m Q4 budget has been used (68%). No department is over 80%, with five weeks left in the quarter.", figuresUsed: ["Q4: ₦184.2m of ₦270m"] };
  }
  if (/(watch|viewer|audience|peak)/.test(q)) {
    return { answer: "12,480 people are watching live now, 18% more than last Monday. Last night's peak for The Beat was 31,200.", figuresUsed: ["Live now: 12,480", "Peak: 31,200"] };
  }
  if (/(drone)/.test(q)) {
    return { answer: "2 of 3 drones are available. Drone 2 is in repair until 30 November, so the Air Wing premiere will use archive aerial footage.", figuresUsed: ["Drones: 2 of 3"] };
  }
  if (/(approv|waiting)/.test(q)) {
    return { answer: "9 items are waiting for your approval. 3 of them are purchases over ₦5m: two broadcast cameras (₦7.4m), OB Van 2 servicing (₦6.2m) and the Studio B lighting upgrade (₦9.8m).", figuresUsed: ["Waiting: 9", "Over ₦5m: 3"] };
  }
  if (/(correspondent|stories|desks)/.test(q)) {
    return { answer: `${CORRESPONDENT_TOTAL} stories came in from ${CORRESPONDENT_DESKS} desks in November. Lagos sent the most (34).`, figuresUsed: [`${CORRESPONDENT_TOTAL} stories, ${CORRESPONDENT_DESKS} desks`] };
  }
  if (/(uptime|outage)/.test(q)) {
    return { answer: "Stream uptime in November is 99.6%, with 2 short outages, both under 4 minutes.", figuresUsed: ["Uptime: 99.6%"] };
  }
  return { answer: "I can't find that in today's data snapshot. I can answer questions about audiences, budgets, assets, approvals and the correspondent network.", figuresUsed: [] };
}

// ---------------------------------------------------------------------------
// Complaint helper (information only: nothing is stored or sent to NPFTV)

export type ComplaintSectionId = "when" | "where" | "officer" | "what" | "evidence" | "witnesses" | "outcome";
export type ComplaintChannel = "cru" | "psc" | "nhrc" | "courts";

export interface ComplaintDraft {
  sections: Record<ComplaintSectionId, string>;
  missing: ComplaintSectionId[];
  channel: ComplaintChannel;
  channelReason: string;
  isEmergency: boolean;
}

export const COMPLAINT_EXAMPLE =
  "Yesterday evening around 7pm at the checkpoint near Berger junction in Abuja, an officer stopped our bus. He said our papers were not complete and asked the driver for N5,000. When I asked his name he covered his name tag. The patrol van number was ABC-123XY. Two other passengers saw it.";

const NG_STATES = ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "Abuja", "FCT"];

/** Scripted fallback: pulls obvious details out of the citizen's words and keeps the full account. */
export function complaintHelper(text: string): ComplaintDraft {
  const t = text.trim();
  const sentences = t.split(/(?<=[.!?])\s+/);
  const pick = (re: RegExp) => sentences.filter((s) => re.test(s)).join(" ");
  const when = (t.match(/\b(yesterday|today|last night|this morning|last week|on (mon|tues|wednes|thurs|fri|satur|sun)day|(mon|tues|wednes|thurs|fri|satur|sun)day|\d{1,2}(st|nd|rd|th)? (of )?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*|(around|at|about) \d{1,2}([:.]\d{2})? ?(am|pm)?|\d{1,2}([:.]\d{2})? ?(am|pm)|morning|afternoon|evening|night)\b/gi) ?? []).join(", ");
  const state = NG_STATES.find((s) => new RegExp(`\\b${s}\\b`, "i").test(t));
  // Place phrases: "at the checkpoint near Berger junction", "along the Lagos-Ibadan Expressway".
  const places = Array.from(
    new Set(
      (t.match(/\b(?:at|near|along|around|opposite|beside|by|in front of)\s+(?:the\s+)?[^,.;]{3,60}?(?=[,.;]| an? | the | when | and | where |$)/gi) ?? [])
        .map((p) => p.trim())
        .filter((p) => /junction|road|street|expressway|market|checkpoint|motor park|station|bus stop|roundabout|bridge|estate|park|garage|[A-Z][a-z]+/.test(p)),
    ),
  );
  const where = [places.join(", "), state && !places.join(" ").includes(state) ? state : ""].filter(Boolean).join(", ");
  const plate = t.match(/\b[A-Z]{2,3}[- ]?\d{2,3}[- ]?[A-Z]{2}\b/);
  // Force numbers look like "54321" or "AP/12345". Case-sensitive so words like "was" aren't taken as a prefix.
  const number = t.match(/\b(?:[Ff]orce )?(?:[Nn]o\.?|[Nn]umber)(?: was| is)?\s*[:#]?\s*((?:[A-Z]{1,3}\/)?\d{3,})\b/);
  const plain = t.replace(/(\d),(\d{3})/g, "$1$2"); // "N20,000" -> "N20000", so commas only split clauses
  const officerClauses = (plain.match(/[^.,;]*\b(officer|policeman|policewoman|inspector|sergeant|corporal|constable|dpo|ipo|name tag|uniform)\b[^.,;]*/gi) ?? [])
    .map((c) => c.trim())
    .filter((c) => /name tag|uniform|inspector|sergeant|corporal|constable|rank|wore|wearing|tall|short|covered/i.test(c));
  const officerBits = [...officerClauses, plate ? `Vehicle number: ${plate[0]}` : "", number ? `Number: ${number[1]}` : ""];
  const officer = Array.from(new Set(officerBits.filter(Boolean))).join(". ");
  const evidence = pick(/\b(photos?|pictures?|videos?|recordings?|recorded|receipts?|screenshots?|transfers?|bank alert|medical (report|records?))\b/i);
  const witnesses = pick(/\b(witness|saw it|passengers?|friend|neighbou?r|people (saw|were there))\b/i);
  const sections: ComplaintDraft["sections"] = { when, where, officer, what: t, evidence, witnesses, outcome: "" };
  const missing = (Object.keys(sections) as ComplaintSectionId[]).filter((k) => !sections[k]);
  const abuse = /\b(beat|beaten|hit|slap|tortur|shot|injur|wound|stripped|sexual|rape)/i.test(t);
  return {
    sections,
    missing,
    channel: "cru",
    channelReason: abuse
      ? "The NPF Complaint Response Unit is the first stop. Because this involves violence, you can also take it to the National Human Rights Commission."
      : "The NPF Complaint Response Unit is the first stop for complaints like this.",
    isEmergency: EMERGENCY.test(t),
  };
}
