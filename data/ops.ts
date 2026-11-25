import type {
  ApprovalItem,
  Asset,
  BudgetLine,
  ProcurementRequest,
  ProductionEvent,
  Role,
  RoleId,
  Sponsorship,
  StaffMember,
  Submission,
} from "@/lib/types";

export const roles: Role[] = [
  { id: "reporter", title: "Reporter", person: "Musa Ibrahim", initials: "MI", blurb: "Kano correspondent. Write and submit stories.", home: "/control/stories" },
  { id: "news-editor", title: "News Editor", person: "Funke Adeyemi", initials: "FA", blurb: "Review submissions and edit stories.", home: "/control/submissions" },
  { id: "editor-in-chief", title: "Editor-in-Chief", person: "Amina Bello", initials: "AB", blurb: "Approve and publish. Curate the homepage.", home: "/control/submissions" },
  { id: "broadcast-manager", title: "Broadcast Manager", person: "Chinedu Okafor", initials: "CO", blurb: "Live control, schedule and live events.", home: "/control/schedule" },
  { id: "programme-manager", title: "Programme Manager", person: "Tunde Bakare", initials: "TB", blurb: "Programmes, episodes and premieres.", home: "/control/programmes" },
  { id: "media-manager", title: "Media Manager", person: "Halima Yusuf", initials: "HY", blurb: "Media library, rights and downloads.", home: "/control/media" },
  { id: "pio", title: "Public Information Officer", person: "Ngozi Eze", initials: "NE", blurb: "Public safety alerts and statements.", home: "/control/alerts" },
  { id: "network-director", title: "Network Director", person: "Network Director", initials: "ND", blurb: "All areas, read and approve.", home: "/control/ops" },
  { id: "super-admin", title: "Super Administrator", person: "Bola Ogunleye", initials: "BO", blurb: "Users, roles, settings and the audit log.", home: "/control" },
];

export const roleById = (id: RoleId) => roles.find((r) => r.id === id)!;

// ---------------- Staff (fictional) ----------------

const firstNames = [
  "Adaeze", "Bashir", "Chiamaka", "Dauda", "Efosa", "Fatima", "Gbenga", "Hauwa", "Ibrahim", "Jumoke", "Kabiru", "Ladi", "Mohammed", "Nkechi",
  "Olumide", "Patience", "Rasheed", "Salamatu", "Tobi", "Uchenna", "Victoria", "Yemi", "Zainab", "Aliyu", "Blessing", "Chukwudi", "Damilola",
  "Emeka", "Folake", "Garba", "Ifeoma", "Jide", "Kehinde", "Lami", "Maryam", "Nnamdi", "Obinna", "Rukayat", "Sadiq", "Temitope", "Usman",
  "Yetunde", "Zubairu", "Abubakar", "Bukola", "Danladi", "Esther", "Habiba", "Ikenna", "Joy", "Khadija", "Lukman", "Mercy",
];
const lastNames = [
  "Okonkwo", "Abdullahi", "Nwosu", "Bala", "Osagie", "Sani", "Adebayo", "Usman", "Lawal", "Ogunbiyi", "Garba", "Danjuma", "Aliyu", "Okeke",
  "Ojo", "Ekpo", "Salisu", "Mohammed", "Afolabi", "Eze", "Udoh", "Babatunde", "Shehu", "Musa", "Nnaji", "Obi", "Akande", "Chukwu",
  "Adewale", "Yakubu", "Okafor", "Ibe", "Olatunji", "Gambo", "Haruna", "Ndukwe", "Onyeka", "Raji", "Suleiman", "Tijani", "Uche", "Waziri",
  "Yusuf", "Zakari", "Ahmed", "Bello", "Dike", "Etim", "Hassan", "Igwe", "Jibril", "Kalu",
];
const staffRoles: [role: string, dept: string, rank?: string][] = [
  ["Camera operator", "Broadcast operations"],
  ["Sound engineer", "Broadcast operations"],
  ["Field producer", "News"],
  ["Video editor", "Programmes"],
  ["Reporter", "News"],
  ["Broadcast engineer", "Broadcast operations"],
  ["Graphics designer", "Digital"],
  ["Social media producer", "Digital"],
  ["Studio director", "Broadcast operations"],
  ["Lighting technician", "Broadcast operations"],
  ["Driver", "Administration"],
  ["Finance officer", "Administration"],
  ["Press liaison", "News", "Inspector"],
  ["Security liaison", "Administration", "Sergeant"],
  ["Camera operator", "Broadcast operations", "Corporal"],
  ["Researcher", "Programmes"],
  ["Producer", "Programmes"],
  ["Web developer", "Digital"],
  ["Procurement officer", "Administration"],
  ["Archivist", "Programmes"],
  ["Correspondent liaison", "News", "Assistant Superintendent"],
  ["Make-up artist", "Programmes"],
];
const statuses: StaffMember["status"][] = ["on-duty", "on-duty", "on-duty", "field", "off", "on-duty", "leave", "on-duty"];

const named: StaffMember[] = [
  { id: "s-amina", name: "Amina Bello", role: "Editor-in-Chief", department: "News", status: "on-duty" },
  { id: "s-musa", name: "Musa Ibrahim", role: "Kano correspondent", department: "News", state: "KN", status: "field" },
  { id: "s-funke", name: "Funke Adeyemi", role: "News Editor", department: "News", status: "on-duty" },
  { id: "s-chinedu", name: "Chinedu Okafor", role: "Broadcast Manager", department: "Broadcast operations", status: "on-duty" },
  { id: "s-tunde", name: "Tunde Bakare", role: "Programme Manager", department: "Programmes", status: "on-duty" },
  { id: "s-halima", name: "Halima Yusuf", role: "Media Manager", department: "Digital", status: "on-duty" },
  { id: "s-ngozi", name: "Ngozi Eze", role: "Public Information Officer", department: "News", rank: "Deputy Superintendent", status: "on-duty" },
  { id: "s-bola", name: "Bola Ogunleye", role: "Super Administrator", department: "Digital", status: "on-duty" },
];

export const staff: StaffMember[] = [
  ...named,
  ...Array.from({ length: 52 }, (_, i): StaffMember => {
    const [role, department, rank] = staffRoles[i % staffRoles.length];
    return {
      id: `s-${i + 1}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[(i * 7) % lastNames.length]}`,
      role,
      department,
      rank,
      status: i === 2 ? "leave" : statuses[i % statuses.length],
    };
  }),
];

/** The four-person crew for Thursday's press briefing. */
export const pressBriefingCrew = ["s-1", "s-2", "s-9", "s-6"];

// ---------------- Assets ----------------

const kitOut = new Set([2, 9, 12, 15]);
const vehiclesOut = new Set([1, 2, 4, 5, 7, 8]);

export const assets: Asset[] = [
  { id: "ob-1", name: "OB Van 1", kind: "ob-van", status: "available", note: "Used on 11 days in November (7 live events, 4 recorded shoots)" },
  { id: "ob-2", name: "OB Van 2", kind: "ob-van", status: "available", note: "Tyres and servicing requested" },
  ...Array.from({ length: 18 }, (_, i): Asset => ({
    id: `cam-${i + 1}`,
    name: `Camera kit ${i + 1}`,
    kind: "camera",
    status: kitOut.has(i + 1) ? "out" : "available",
    note: kitOut.has(i + 1) ? "Out with a field crew today" : "In the equipment store",
  })),
  { id: "drone-1", name: "Drone 1", kind: "drone", status: "available", note: "Licensed pilot: Bashir Abdullahi" },
  { id: "drone-2", name: "Drone 2", kind: "drone", status: "repair", note: "In repair until 30 November" },
  { id: "drone-3", name: "Drone 3", kind: "drone", status: "available", note: "Ready" },
  ...Array.from({ length: 9 }, (_, i): Asset => ({
    id: `veh-${i + 1}`,
    name: `Vehicle ${i + 1}`,
    kind: "vehicle",
    status: vehiclesOut.has(i + 1) ? "out" : "available",
    note: vehiclesOut.has(i + 1) ? "Out today" : "In the car park",
  })),
  { id: "studio-a", name: "Studio A", kind: "studio", status: "available", note: "Main studio, Abuja" },
  { id: "studio-b", name: "Studio B", kind: "studio", status: "available", note: "Lighting upgrade requested" },
  { id: "studio-c", name: "Studio C", kind: "studio", status: "available", note: "Podcast and voiceover booth" },
  // Smaller kit, to make the register feel real (about 120 items in total).
  ...Array.from({ length: 30 }, (_, i): Asset => ({
    id: `mic-${i + 1}`,
    name: `Radio microphone ${i + 1}`,
    kind: "camera",
    status: i % 9 === 4 ? "out" : "available",
    note: "Audio kit",
  })),
  ...Array.from({ length: 24 }, (_, i): Asset => ({
    id: `light-${i + 1}`,
    name: `Lighting kit ${i + 1}`,
    kind: "camera",
    status: i % 7 === 3 ? "out" : "available",
    note: "Location lighting",
  })),
  ...Array.from({ length: 20 }, (_, i): Asset => ({
    id: `tripod-${i + 1}`,
    name: `Tripod ${i + 1}`,
    kind: "camera",
    status: i % 6 === 1 ? "out" : "available",
    note: "Camera support",
  })),
  ...Array.from({ length: 10 }, (_, i): Asset => ({
    id: `laptop-${i + 1}`,
    name: `Edit laptop ${i + 1}`,
    kind: "camera",
    status: i === 6 ? "repair" : "available",
    note: i === 6 ? "Screen replacement" : "Field editing",
  })),
];

// ---------------- Production ----------------

export const seedProduction: ProductionEvent[] = [
  {
    id: "prod-safe-nigeria-festive",
    date: "2026-11-28",
    start: "17:00",
    end: "17:30",
    title: "Safe Nigeria: festive travel special",
    note: "Recorded Friday in Studio A.",
    crew: ["s-4", "s-5", "s-10", "s-16", "s-17", "s-22"],
    assets: ["studio-a"],
  },
  {
    id: "prod-air-wing",
    date: "2026-12-01",
    start: "20:00",
    end: "21:00",
    title: "Premiere: The Force in Focus, Air Wing",
    note: "Final edit due Friday.",
    crew: ["s-4", "s-17"],
    assets: [],
    warn: "Drone 2 unavailable",
  },
];

/** What scheduling the press briefing creates in the ERP (demo step 6 to 7). */
export const pressBriefingProduction: Omit<ProductionEvent, "slotId"> = {
  id: "prod-press-briefing",
  date: "2026-11-26",
  start: "11:00",
  end: "12:00",
  title: "Press briefing, live from Force Headquarters",
  note: "11:00 to 12:00. Live on TV and Stream.",
  crew: pressBriefingCrew,
  assets: ["ob-1", "cam-3", "cam-7"],
  cost: 1_850_000,
  budgetLine: "broadcast-operations",
};

// ---------------- Finance ----------------

export const budget: BudgetLine[] = [
  { id: "broadcast-operations", department: "Broadcast operations", used: 61_000_000, budget: 80_000_000 },
  { id: "news", department: "News", used: 52_000_000, budget: 70_000_000 },
  { id: "programmes", department: "Programmes", used: 38_000_000, budget: 60_000_000 },
  { id: "digital", department: "Digital", used: 21_000_000, budget: 35_000_000 },
  { id: "administration", department: "Administration", used: 12_200_000, budget: 25_000_000 },
];

export const programmeSpend = [
  { programme: "The Beat", used: 21_400_000, budget: 28_000_000 },
  { programme: "Safe Nigeria", used: 6_100_000, budget: 9_000_000 },
  { programme: "Community Watch", used: 4_800_000, budget: 8_000_000 },
  { programme: "The Force in Focus", used: 9_700_000, budget: 14_000_000 },
  { programme: "Cyber Sense", used: 2_900_000, budget: 5_000_000 },
  { programme: "In Conversation", used: 3_300_000, budget: 5_500_000 },
  { programme: "The Insight Podcast", used: 1_200_000, budget: 2_500_000 },
];

export const approvals: ApprovalItem[] = [
  { id: "ap-cameras", kind: "procurement", title: "Two broadcast cameras", detail: "Procurement, requested by Engineering", amount: "₦7.4m", amountNote: "Over ₦5m", status: "waiting" },
  { id: "ap-missing-lagos", kind: "alert", title: "Missing person notice, Lagos", detail: "Public safety alert, verified by Lagos command", amount: "Alert", status: "waiting" },
  { id: "ap-sponsor-road", kind: "sponsorship", title: "Sponsored road safety segment", detail: "Sponsorship, 8 weeks on Safe Nigeria", amount: "₦12m", amountNote: "Income", status: "waiting" },
  { id: "ap-leave-producer", kind: "leave", title: "Leave: field producer", detail: "People, 1 to 5 December", amount: "5 days", status: "waiting" },
  { id: "ap-obvan2", kind: "procurement", title: "OB Van 2 tyres and servicing", detail: "Procurement, requested by Transport", amount: "₦6.2m", amountNote: "Over ₦5m", status: "waiting" },
  { id: "ap-studio-b", kind: "procurement", title: "Studio B lighting upgrade", detail: "Procurement, requested by Engineering", amount: "₦9.8m", amountNote: "Over ₦5m", status: "waiting" },
  { id: "ap-overtime", kind: "overtime", title: "Overtime: Thursday press briefing crew", detail: "People, 4 crew, 3 hours each", amount: "12 hrs", status: "waiting" },
  { id: "ap-travel-kaduna", kind: "travel", title: "Travel: Air Wing shoot in Kaduna", detail: "Programmes, 2 crew, 2 nights", amount: "₦0.9m", status: "waiting" },
  { id: "ap-charity", kind: "sponsorship", title: "Partnership agreement with a road safety charity", detail: "Sponsorship, PSA campaign", amount: "PSA", status: "waiting" },
];

export const procurement: ProcurementRequest[] = [
  { id: "pr-1", item: "Two broadcast cameras", amount: 7_400_000, requestedBy: "Engineering", status: "waiting", chain: [{ step: "Head of Engineering", done: true }, { step: "Finance check", done: true }, { step: "Network Director", done: false }] },
  { id: "pr-2", item: "OB Van 2 tyres and servicing", amount: 6_200_000, requestedBy: "Transport", status: "waiting", chain: [{ step: "Transport officer", done: true }, { step: "Finance check", done: true }, { step: "Network Director", done: false }] },
  { id: "pr-3", item: "Studio B lighting upgrade", amount: 9_800_000, requestedBy: "Engineering", status: "waiting", chain: [{ step: "Head of Engineering", done: true }, { step: "Finance check", done: true }, { step: "Network Director", done: false }] },
  { id: "pr-4", item: "Replacement drone battery packs", amount: 640_000, requestedBy: "Programmes", status: "approved", chain: [{ step: "Programme Manager", done: true }, { step: "Finance check", done: true }] },
  { id: "pr-5", item: "Edit laptop screen replacement", amount: 180_000, requestedBy: "Programmes", status: "approved", chain: [{ step: "Programme Manager", done: true }, { step: "Finance check", done: true }] },
  { id: "pr-6", item: "Stream encoder licence renewal", amount: 3_100_000, requestedBy: "Digital", status: "approved", chain: [{ step: "Head of Digital", done: true }, { step: "Finance check", done: true }] },
];

export const sponsorships: Sponsorship[] = [
  { id: "sp-1", partner: "Kestrel Motor Insurance (fictional)", campaign: "Sponsored road safety segment", programme: "safe-nigeria", value: 12_000_000, weeks: 8, status: "proposed" },
  { id: "sp-2", partner: "SafeRoads Trust (fictional charity)", campaign: "Festive travel PSA campaign", programme: "the-beat", value: 0, weeks: 6, status: "proposed" },
  { id: "sp-3", partner: "Harbour Bank (fictional)", campaign: "\"Your OTP is yours\" PSA", programme: "cyber-sense", value: 4_500_000, weeks: 10, status: "active" },
  { id: "sp-4", partner: "Greenfield Telecom (fictional)", campaign: "Community Watch partner credit", programme: "community-watch", value: 6_000_000, weeks: 12, status: "active" },
  { id: "sp-5", partner: "Northstar Logistics (fictional)", campaign: "Back-to-school safety", programme: "safe-nigeria", value: 3_200_000, weeks: 6, status: "ended" },
];

export const seedSubmissions: Submission[] = [
  { id: "sub-1", articleId: "sub-lagos-fraud-desk", from: "Bisi Olawale", desk: "Lagos", at: "14:20", triage: { category: "state-commands", state: "LA", urgency: "routine" } },
  { id: "sub-2", articleId: "sub-kaduna-motor-parks", from: "Yakubu Danjuma", desk: "Kaduna", at: "15:05", triage: { category: "public-safety", state: "KD", urgency: "routine", possibleDuplicateOf: "kaduna-motor-parks" } },
  { id: "sub-3", articleId: "sub-rivers-waterways", from: "Ebiere Tonye", desk: "Rivers", at: "11:50", triage: { category: "state-commands", state: "RI", urgency: "routine", possibleDuplicateOf: "rivers-marine" } },
];

export const kanoTriage: Submission["triage"] = { category: "state-commands", state: "KN", urgency: "priority" };

export const kpis = {
  watching: 12480,
  watchingNote: "18% more than last Monday",
  peakLastNight: 31200,
  uptime: "99.6%",
  uptimeNote: "2 short outages, both under 4 minutes",
};

export const fmtNaira = (n: number) => {
  if (n >= 100_000) {
    const m = n / 1_000_000;
    return `₦${Number.isInteger(m) ? m : m.toFixed(m < 10 ? 2 : 1).replace(/0$/, "")}m`;
  }
  if (n >= 1000) return `₦${Math.round(n / 1000)}k`;
  return `₦${n}`;
};
