// "Ask NPFTV": the platform-wide assistant (main website only, not Stream).
// Shared by the browser and the server: the action allowlist, the live snapshot type and the scripted engine.
// NPFTV is the police's media arm: the assistant informs and points to who can act. It never acts itself.

import { programmes } from "@/data/programmes";
import { stateSlug, states } from "@/data/places";
import { guides } from "@/data/public";
import { rightsTopics } from "@/data/rights";

export type ActionId =
  | "call_112"
  | "call_frsc"
  | "open_scam_assistant"
  | "send_report"
  | "track_report"
  | "rights_hub"
  | "rights_topic"
  | "investigations"
  | "complaints"
  | "safety_guide"
  | "missing_persons"
  | "wanted_persons"
  | "watch_live"
  | "tv_guide"
  | "on_demand"
  | "programme"
  | "state_command"
  | "news"
  | "contact";

export const ACTION_IDS: ActionId[] = [
  "call_112",
  "call_frsc",
  "open_scam_assistant",
  "send_report",
  "track_report",
  "rights_hub",
  "rights_topic",
  "investigations",
  "complaints",
  "safety_guide",
  "missing_persons",
  "wanted_persons",
  "watch_live",
  "tv_guide",
  "on_demand",
  "programme",
  "state_command",
  "news",
  "contact",
];

export interface AssistantAction {
  id: ActionId;
  param: string; // topic/guide/programme/state id where needed, else ""
}

export interface ResolvedAction {
  label: string;
  href: string;
  tel?: boolean;
  primary?: boolean;
}

/** Turns an action into a link, or null if it's not valid (unknown id or param). */
export function resolveAction(a: AssistantAction): ResolvedAction | null {
  switch (a.id) {
    case "call_112":
      return { label: "Call 112", href: "tel:112", tel: true, primary: true };
    case "call_frsc":
      return { label: "Call FRSC 122", href: "tel:122", tel: true };
    case "open_scam_assistant":
      return { label: "Open the scam assistant", href: "/safety/scam-check" };
    case "send_report":
      return { label: "Send a report to the newsroom", href: "/safety/report" };
    case "track_report":
      return { label: "Track a report", href: "/track" };
    case "rights_hub":
      return { label: "Know your rights", href: "/rights" };
    case "rights_topic": {
      const t = rightsTopics.find((x) => x.id === a.param);
      return t ? { label: `Read: ${t.title}`, href: `/rights/${t.id}` } : null;
    }
    case "investigations":
      return { label: "How investigations work", href: "/rights/investigations" };
    case "complaints":
      return { label: "How to complain about an officer", href: "/rights/complaints" };
    case "safety_guide": {
      const g = guides.find((x) => x.id === a.param);
      return g ? { label: `Guide: ${g.title}`, href: `/safety/guides/${g.id}` } : null;
    }
    case "missing_persons":
      return { label: "Missing persons", href: "/safety/missing" };
    case "wanted_persons":
      return { label: "Wanted persons", href: "/safety/wanted" };
    case "watch_live":
      return { label: "Watch live on NPFTV Stream", href: "/stream/live" };
    case "tv_guide":
      return { label: "Programme guide", href: "/stream/guide" };
    case "on_demand":
      return { label: "Watch on demand", href: "/stream/on-demand" };
    case "programme": {
      const p = programmes.find((x) => x.id === a.param);
      return p ? { label: p.title, href: `/programmes/${p.id}` } : null;
    }
    case "state_command": {
      const s = states.find((x) => x.id === a.param);
      return s ? { label: `${s.id === "FC" ? "FCT" : s.name} State Command`, href: `/state-commands/${stateSlug(s)}` } : null;
    }
    case "news":
      return { label: "Latest news", href: "/news" };
    case "contact":
      return { label: "Contact NPFTV", href: "/contact" };
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------

export interface ChatTurn {
  role: "user" | "assistant";
  text: string;
}

export interface AssistantReply {
  reply: string;
  actions: AssistantAction[];
  followUps: string[];
  isEmergency: boolean;
}

/** What the browser knows right now (changes with the demo state). Sent with each live request. */
export interface LiveSnapshot {
  now: string; // "Monday 23 November 2026, 19:12 WAT"
  onAir: string; // "The Beat (live, until 19:30)" or "Off air"
  next: string[]; // ["19:30 Cyber Sense: Spotting fake loan apps", …]
  headlines: string[];
  alerts: string[];
  missing: string[];
}

export const SUGGESTIONS = [
  "Someone is asking for my OTP",
  "Can police search my phone?",
  "There's flooding near me",
  "What's on NPFTV tonight?",
  "How do I complain about an officer?",
  "Someone I know is missing",
];

export const GREETING =
  "Hello! I'm Ask NPFTV. I can help with scams, your rights, staying safe, sending a report to our newsroom, missing persons, and what's on NPFTV. What do you need?";

// ---------------------------------------------------------------------------
// Scripted engine (fallback and "Scripted AI only" mode)

const has = (t: string, re: RegExp) => re.test(t);

export function scriptedReply(question: string, snap: LiveSnapshot): AssistantReply {
  const t = question.toLowerCase();
  const out = (reply: string, actions: AssistantAction[], followUps: string[] = [], isEmergency = false): AssistantReply => ({ reply, actions, followUps, isEmergency });
  const A = (id: ActionId, param = ""): AssistantAction => ({ id, param });

  if (has(t, /(kill myself|end my life|suicide|want to die)/))
    return out("I'm really sorry you're feeling this way. Please talk to someone you trust right now, a family member, a friend or a religious leader. If you're in immediate danger, call 112.", [A("call_112")], [], true);
  if (has(t, /(right now|happening now|in danger|attack(ed|ing)? me|being robbed|kidnap|gun|shooting|trapped|bleeding|on fire|help me|emergency)/))
    return out("If you or someone else is in danger now, call 112 first. It's free on every network. NPFTV is a television and news service, so we can't send help. When you're safe, I can help with what to do next.", [A("call_112")], ["How do I report a crime?"], true);

  if (has(t, /\b(otp|pin|bvn|password|scam|fraud|fake|loan app|wrong transfer|romance|lover|customs|investment|double (my )?money|crypto|forex|efcc)\b|say (they'?re|they are) (from )?(the )?police/))
    return out(
      "Never share your OTP, PIN, password or BVN details with anyone, not even someone who says they're from your bank or the police. If something feels off, stop and check. Our scam assistant can talk it through with you step by step.",
      [A("open_scam_assistant"), A("safety_guide", "keeping-your-otp-safe")],
      ["I've already paid. What now?", "Someone says they're from EFCC"],
    );
  if (has(t, /(already paid|sent (the )?money|lost money)/))
    return out("Call your bank now on the number printed on your card and ask them to block the transaction and your account. Then report it at your nearest police station with screenshots, phone numbers and receipts, or to the EFCC. NPFTV can't recover money, but those steps give you the best chance.", [A("open_scam_assistant")]);
  if (has(t, /(phone|password).*(search|check|look|unlock)|(search|check|look).*(phone)/))
    return out("Your phone and messages are private by law. Officers shouldn't go through your phone just because they stopped you; examining a phone should be part of a real investigation, done lawfully and on record.", [A("rights_topic", "phone-and-home"), A("rights_topic", "stop-and-search")]);
  if (has(t, /\bbail\b/))
    return out("Police bail is free. No one should pay money to be released, or for a bail form. You may be asked for a surety, a person who promises you'll come back.", [A("rights_topic", "bail"), A("complaints")]);
  if (has(t, /(arrest|detain|custody|held|cell|lawyer)/))
    return out("You must be told why you're being arrested, and you have the right to stay silent until you've spoken to a lawyer. Nobody can be arrested in your place or over a debt. A suspect must be taken to court within 24 hours if a court is within 40 km, otherwise within 48 hours.", [A("rights_topic", "being-arrested"), A("rights_topic", "held-too-long")]);
  if (has(t, /(checkpoint|stopped|road block|settlement|bribe|asked (me )?for money)/))
    return out("Officers can stop vehicles and check documents, but you never have to pay money at a checkpoint. Stay calm, ask politely for the officer's name and number, and don't pay. You can complain afterwards.", [A("rights_topic", "stopped-on-the-road"), A("complaints")]);
  if (has(t, /(complain|complaint|report (an |the )?officer|misconduct|brutal)/))
    return out("NPFTV can't take complaints, but we explain how they work. Start with the NPF Complaint Response Unit; the Police Service Commission and the National Human Rights Commission can also help. Our page can help you write your complaint down clearly.", [A("complaints"), A("rights_hub")]);
  if (has(t, /(investigat|my case|case file|follow up|ipo)/))
    return out("After you report a crime, an Investigating Police Officer (IPO) is assigned and gathers evidence; serious cases can move to the State or Force CID, and some go for legal advice before charge. If nothing is happening, ask the IPO first, then the Divisional Police Officer.", [A("investigations")]);
  if (has(t, /(report (a )?crime|robbed|rob(bery)?\b|stole|steal|burgl|theft|thief|break-?in)/))
    return out("To report a crime, go to your nearest police station. Reporting is free. NPFTV can't open a case. If anyone is in danger now, call 112.", [A("safety_guide", "how-to-report-a-crime"), A("call_112")]);
  if (has(t, /(flood|fire|crash|accident|collapse|power line|pole|protest|riot|happening near|in my area|my street)/))
    return out(
      `If anyone is in danger, call 112 first${has(t, /(crash|accident)/) ? " (or FRSC on 122 for road crashes)" : ""}. When you're safe, you can tell our newsroom so we can warn others. It's not a police report and NPFTV can't send help, but verified reports help us inform the public.`,
      [A("call_112"), ...(has(t, /(crash|accident)/) ? [A("call_frsc")] : []), A("send_report")].slice(0, 3),
      ["How do I track my report?"],
    );
  if (has(t, /(track|reference|my report)/)) return out("You can track a report you sent to our newsroom with its reference number, which looks like NPFTV-RPT-26-04817.", [A("track_report")]);
  if (has(t, /(missing|lost (my )?(child|son|daughter|brother|sister|father|mother))/))
    return out(
      `You don't need to wait 24 hours. Go to your nearest police station as soon as you're worried, with a recent photo and a description. NPFTV publishes missing person notices issued by police commands.${snap.missing.length ? ` Current notices include ${snap.missing.slice(0, 2).join(" and ")}.` : ""}`,
      [A("missing_persons")],
    );
  if (has(t, /(wanted)/)) return out("Wanted person notices come from police commands. Everyone is presumed innocent until proven guilty. If you recognise someone, don't approach them: call 112 or tell your nearest police station.", [A("wanted_persons")]);
  if (has(t, /(on (air|now|tonight)|tonight|watch|live|programme guide|schedule|what time|when is|the beat|cyber sense|community watch|safe nigeria|in conversation|force in focus)/)) {
    const prog = programmes.find((p) => t.includes(p.title.toLowerCase()));
    if (prog) return out(`${prog.title}: ${prog.short}. ${prog.scheduleText}.`, [A("programme", prog.id), A("watch_live")]);
    return out(`Right now on NPFTV: ${snap.onAir}.${snap.next.length ? ` Coming up: ${snap.next.slice(0, 3).join("; ")}.` : ""}`, [A("watch_live"), A("tv_guide")]);
  }
  if (has(t, /(news|latest|headline)/))
    return out(snap.headlines.length ? `Latest from NPFTV: ${snap.headlines.slice(0, 3).join("; ")}.` : "Here's the latest from our newsroom.", [A("news")]);
  const st = states.find((s) => t.includes(s.name.toLowerCase()) || (s.id === "FC" && /\b(abuja|fct)\b/.test(t)));
  if (st && has(t, /(command|station|police)/)) return out(`Here's the page for the ${st.id === "FC" ? "FCT" : st.name} command: its latest news and how to reach it.`, [A("state_command", st.id)]);
  if (has(t, /(home|house|travel|holiday|night|road safety)/)) {
    const g = guides.find((x) => x.keywords.some((k) => t.includes(k)));
    if (g) return out(`${g.steps[0]} ${g.steps[1] ?? ""}`.trim(), [A("safety_guide", g.id)]);
  }
  if (has(t, /(contact|phone number|email|partner|advertis)/)) return out("You can reach the right NPFTV desk from our contact page. NPFTV isn't an emergency line: in an emergency, call 112.", [A("contact")]);
  return out(
    "I can help with scams, your rights with the police, staying safe, sending a report to our newsroom, missing persons, and what's on NPFTV. Could you tell me a bit more about what you need?",
    [A("open_scam_assistant"), A("rights_hub"), A("send_report")],
    SUGGESTIONS.slice(0, 3),
  );
}
