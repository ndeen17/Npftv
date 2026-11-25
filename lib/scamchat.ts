// Conversational scam assistant (Phase 5): shared types, safety guards, and the scripted engine
// used as the fallback (and when the presenter turns on "Scripted AI only").
// Tone rules: plain, kind, never blaming. NPFTV can't take reports or get money back: it points to who can.

import { scamCheck } from "./ai";

export type ScenarioId = "message" | "call" | "romance" | "job" | "investment" | "police" | "other";
export type Risk = "high" | "medium" | "low";

export interface ChatMsg {
  role: "user" | "assistant";
  text: string;
}

export interface RiskCardData {
  risk: Risk;
  title: string;
  signs: string[];
  doNow: string[];
  ifPaid: string[];
  talkTo: string;
  reportTo: string[];
}

export interface ScamTurn {
  kind: "question" | "result";
  question: string;
  quickReplies: string[];
  card: RiskCardData | null;
  isEmergency: boolean;
}

export const SCENARIOS: { id: ScenarioId; label: string; opener: string }[] = [
  { id: "message", label: "I got a message", opener: "I got a message I'm not sure about." },
  { id: "call", label: "Someone is calling me", opener: "Someone is calling me and I'm not sure they're genuine." },
  { id: "romance", label: "Someone I met online wants money", opener: "Someone I met online is asking me for money." },
  { id: "job", label: "A job, visa or loan offer", opener: "I've been offered a job, a visa or a loan." },
  { id: "investment", label: "An investment that sounds too good", opener: "Someone is offering me an investment." },
  { id: "police", label: "Someone says they're police or EFCC", opener: "Someone says they're from the police or the EFCC." },
  { id: "other", label: "Something else", opener: "Something else is worrying me." },
];

export const MAX_QUESTIONS = 4;

// ---------------------------------------------------------------------------
// Safety guards (run in the browser before anything is sent anywhere)

/** Long digit runs (OTP, PIN, BVN, card, account numbers) and "my pin is…" phrases. */
export function containsSecret(text: string) {
  return /\b(my )?(pin|otp|password|passcode|cvv)\s*(is|:|=)\s*\S+/i.test(text) || /\b\d{6,}\b/.test(text) || /\b\d{4}\b(?=.*\b(pin|code)\b)|\b(pin|code)\b.*\b\d{4}\b/i.test(text);
}

export function redact(text: string) {
  return text.replace(/\b(pin|otp|password|passcode|cvv|bvn)\s*(is|:|=)?\s*\S+/gi, "$1 [removed]").replace(/\b\d{6,}\b/g, "[number removed]");
}

const SELF_HARM_RE = /\b(kill myself|end my life|suicide|want to die|take my (own )?life)\b/i;
const DANGER_RE = /(threaten(ed|ing)? to (kill|hurt|harm)|outside my (house|door)|coming to (my house|get me)|kidnap|holding me|in danger now|right now.*(hurt|attack))/i;

export function emergencyKind(text: string): "self-harm" | "danger" | null {
  if (SELF_HARM_RE.test(text)) return "self-harm";
  if (DANGER_RE.test(text)) return "danger";
  return null;
}

// ---------------------------------------------------------------------------
// Scripted engine

interface Q {
  q: string;
  quick: string[];
}

const PAID_Q: Q = { q: "Have you already sent money or shared any personal or bank details?", quick: ["Not yet", "Yes, I sent money", "Yes, I shared bank or card details", "Yes, I shared a code or OTP"] };

const TREE: Record<ScenarioId, Q[]> = {
  message: [{ q: "What does the message say? You can paste it, but please remove any codes, PINs or account numbers first.", quick: [] }, PAID_Q],
  call: [
    { q: "Who do they say they are?", quick: ["My bank", "Police or EFCC", "My network provider", "A relative or friend", "Someone else"] },
    { q: "What do they want you to do?", quick: ["Give a code, PIN or OTP", "Send money", "Install an app or click a link", "Confirm my BVN or card details", "Something else"] },
    PAID_Q,
  ],
  romance: [
    { q: "I'm sorry you're dealing with this. How did you meet, and have you met in person?", quick: ["Online only, we've never met", "We've video-called", "We've met in person"] },
    { q: "What are they asking you for?", quick: ["Money for customs or a parcel", "Money for travel or a visa", "Money for an emergency or hospital", "Gift cards or crypto", "Nothing yet"] },
    PAID_Q,
  ],
  job: [
    { q: "What's being offered?", quick: ["A job abroad", "A job in Nigeria", "A visa or travel deal", "A loan"] },
    { q: "Are they asking you to pay anything first?", quick: ["Yes, an application or processing fee", "Yes, for training, a uniform or a medical", "No"] },
    PAID_Q,
  ],
  investment: [
    { q: "What are they promising?", quick: ["To double my money quickly", "Fixed high returns every week", "Crypto or forex trading", "Pay to join and recruit others"] },
    { q: "How did you hear about it?", quick: ["A friend or family member", "Social media", "A WhatsApp or Telegram group", "Someone called me"] },
    PAID_Q,
  ],
  police: [
    { q: "What are they saying?", quick: ["I'll be arrested unless I pay", "A relative has been arrested", "My account is under investigation", "Something else"] },
    { q: "How are they contacting you?", quick: ["Phone call", "WhatsApp or SMS", "In person"] },
    PAID_Q,
  ],
  // "Something else" always starts with the person's own description, so go straight to the follow-ups.
  other: [
    { q: "Thank you for explaining. Are they asking for money, codes or personal details?", quick: ["Money", "A code, PIN or OTP", "Personal or bank details", "No"] },
    { q: "How are they contacting you?", quick: ["Phone call", "SMS or WhatsApp", "Social media", "In person"] },
    PAID_Q,
  ],
};

const DO_NOT = "Don't send money and don't share any code, PIN, OTP, password or BVN details, with anyone.";
const BANK = "Call your bank on the number printed on your card (not a number they gave you).";
const REPORT_TO = ["Your bank, straight away if money or details were shared", "Your nearest police station: bring screenshots, phone numbers, account numbers and receipts", "The EFCC, for financial fraud"];
const IF_PAID = [
  "Call your bank now and ask them to block the transaction and your account or card.",
  "Report it at your nearest police station. Bring screenshots, the scammer's phone and account numbers, and your receipts.",
  "You can also report financial fraud to the EFCC.",
  "Change any PIN or password you shared, and warn friends and family so the scammer can't use your name.",
];

/** The person's answers, without the scenario chip's own opener text (which isn't information about their case). */
function answered(history: ChatMsg[]) {
  const openers = new Set(SCENARIOS.map((s) => s.opener));
  return history.filter((m) => m.role === "user" && !openers.has(m.text)).map((m) => m.text.toLowerCase());
}

function buildCard(scenario: ScenarioId, history: ChatMsg[]): RiskCardData {
  const a = answered(history).join(" | ");
  const base = { ifPaid: IF_PAID, reportTo: REPORT_TO, talkTo: "" };

  switch (scenario) {
    case "romance":
      return {
        ...base,
        risk: /never met|online only/.test(a) && !/nothing yet/.test(a) ? "high" : "medium",
        title: "This has the signs of a romance scam",
        signs: [
          /never met|online only/.test(a) ? "You've only met online, and they're asking for money." : "They're asking for money in a relationship.",
          /customs|parcel/.test(a) ? "A \"parcel\" or \"customs fee\" is one of the commonest romance scam stories." : /gift card|crypto/.test(a) ? "Gift cards and crypto are hard to trace, which is why scammers ask for them." : "Emergencies, travel costs and hospital bills are stories scammers use to get money quickly.",
          "Scammers often build trust for weeks before asking. It isn't your fault.",
        ],
        doNow: [DO_NOT, "Stop sending messages for now and don't reply to pressure or guilt.", "Keep screenshots of the chat, their profile and any account numbers.", BANK],
        talkTo: "Talk to someone you trust before you decide anything. Scammers try to keep you secret and isolated. Telling someone breaks their hold.",
      };
    case "police":
      return {
        ...base,
        risk: /arrested unless i pay|relative has been arrested|under investigation/.test(a) || /phone|whatsapp|sms/.test(a) ? "high" : "medium",
        title: "Real officers don't ask for money like this",
        signs: [
          "Police officers and the EFCC don't ask for money by phone, SMS or WhatsApp to stop an arrest or close an investigation.",
          "Police bail is free. No one should pay to have a relative released.",
          "Fear and urgency are used to stop you checking.",
        ],
        doNow: [DO_NOT, "End the call. Don't argue or negotiate.", "If you're worried about a relative, go to the police station yourself, or call the station on a number you find independently.", "Keep the phone number and any messages."],
      };
    case "investment":
      return {
        ...base,
        risk: "high",
        title: "This looks like an investment scam",
        signs: [
          /double|fixed high|returns/.test(a) ? "Guaranteed or very high returns are the clearest warning sign. Real investments carry risk." : "Pressure to invest quickly is a warning sign.",
          /recruit/.test(a) ? "Paying to join and recruiting others is how Ponzi schemes work: early members are paid with new members' money." : "Crypto and forex \"trading\" schemes are often used to take money that can't be traced.",
          /friend|family|group/.test(a) ? "Scams spread through friends, family and groups, so a trusted person can share one without knowing." : "Unsolicited offers by phone or social media are a common route.",
        ],
        doNow: [DO_NOT, "Don't invest more to \"unlock\" or withdraw your money. That's part of the scam.", "Check whether the company is registered with the Securities and Exchange Commission (SEC) before investing anything.", "Keep screenshots and payment records."],
      };
    case "job":
      return {
        ...base,
        risk: /yes, an application|yes, for training/.test(a) ? "high" : "medium",
        title: /loan/.test(a) ? "Be careful with this loan offer" : "This offer has warning signs",
        signs: [
          /yes, an application|yes, for training/.test(a) ? "Genuine employers and embassies don't ask you to pay a fee to get a job or a visa." : "Offers that seem too easy are a warning sign.",
          /abroad|visa/.test(a) ? "Fake jobs and visas abroad are also used for human trafficking. Never hand over your passport." : /loan/.test(a) ? "Fake loan apps ask for access to your contacts and photos, then threaten you." : "Pressure to decide or pay quickly is a warning sign.",
        ],
        doNow: [DO_NOT, "Check the company or agent independently, not through links or numbers they send.", "Never send your passport or original documents to someone you haven't verified.", "If a loan app is threatening you, keep the evidence and report it at your nearest police station."],
      };
    case "call":
      return {
        ...base,
        risk: /code|pin|otp|send money|bvn|card details|install an app|link/.test(a) ? "high" : "medium",
        title: "This call has the signs of a scam",
        signs: [
          /bank/.test(a) ? "Banks never ask for your PIN, OTP or full card details on a call." : /police|efcc/.test(a) ? "Officers don't ask for money or codes on the phone." : /relative|friend/.test(a) ? "Scammers pretend to be relatives in trouble, often from a new number." : "Unexpected callers asking for something are a warning sign.",
          /install an app|link/.test(a) ? "Apps and links they send can give them control of your phone or account." : "Urgency and fear are used to stop you checking.",
        ],
        doNow: [DO_NOT, "End the call. If it was \"your bank\", call the bank yourself on the number on your card.", /relative|friend/.test(a) ? "Call your relative on their usual number to check they're safe." : "Don't install any app or click any link they send."],
      };
    case "message": {
      // User messages: [opener, the pasted message, the "already paid?" answer].
      const msg = history.filter((m) => m.role === "user")[1]?.text ?? "";
      const r = scamCheck(msg);
      return {
        ...base,
        risk: r.verdict === "very_likely_scam" ? "high" : r.verdict === "possibly_scam" ? "medium" : "low",
        title: r.verdict === "very_likely_scam" ? "This message is very likely a scam" : r.verdict === "possibly_scam" ? "This message could be a scam" : "We didn't find the usual warning signs",
        signs: r.signs.length ? r.signs : ["No obvious warning signs, but stay careful with any message that asks for money or details."],
        doNow: [DO_NOT, "Don't reply and don't click any link. Delete the message.", "If it claims to be from your bank, call the bank on the number on your card."],
      };
    }
    default:
      return {
        ...base,
        risk: /money|code|pin|otp|bank|personal/.test(a) && !/\| no$/.test(a) ? "medium" : "low",
        title: "Here's what we'd suggest",
        signs: ["Anyone asking unexpectedly for money, codes or personal details should be treated with caution.", "Urgency, secrecy and threats are common scam tactics."],
        doNow: [DO_NOT, "Take your time. Check with someone you trust, or with the organisation directly using a number you find yourself."],
      };
  }
}

/** Scripted next turn: the next question in the tree, or the risk card. */
export function scriptedTurn(scenario: ScenarioId, history: ChatMsg[]): ScamTurn {
  const last = history.filter((m) => m.role === "user").pop()?.text ?? "";
  const emergency = emergencyKind(last);
  const asked = history.filter((m) => m.role === "assistant").length - 1; // first assistant message is the greeting
  const qs = TREE[scenario];
  if (!emergency && asked < qs.length && asked < MAX_QUESTIONS) {
    const q = qs[Math.max(0, asked)];
    return { kind: "question", question: q.q, quickReplies: q.quick, card: null, isEmergency: false };
  }
  const card = buildCard(scenario, history);
  const paid = /yes, i (sent money|shared)/i.test(answered(history).join(" | "));
  return {
    kind: "result",
    question: "",
    quickReplies: [],
    card: paid ? { ...card, risk: card.risk === "low" ? "medium" : card.risk } : card,
    isEmergency: !!emergency,
  };
}

export const SELF_HARM_REPLY =
  "I'm really sorry you're feeling this way. You don't have to deal with this alone. Please talk to someone you trust right now, a family member, a friend or a religious leader, and if you're in immediate danger, call 112. Losing money to a scam is not your fault, and there are people who can help you get through it.";
export const DANGER_REPLY = "If someone is threatening you or you're in danger right now, call 112 first. It's free on every network. When you're safe, I can help you work out what to do next.";
