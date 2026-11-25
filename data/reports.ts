// Citizen reports sent to the NPFTV newsroom (public reporting for news and awareness). ALL FICTIONAL.
// NPFTV does not forward or escalate reports; verified ones may become alerts, stories or mentions on air.

import type { ReportCategory } from "./agencies";

export type ReportStatus = "received" | "reviewed" | "verified" | "published" | "not-used";
export type Urgency = "low" | "medium" | "high";

export interface ReportEvent {
  status: ReportStatus | "note";
  at: string; // ISO
  publicNote: string; // shown to the citizen on /track
}

export interface CitizenReport {
  ref: string;
  createdAt: string; // ISO
  category: ReportCategory;
  summary: string;
  details: string;
  state: string; // state id
  lga: string;
  landmark: string;
  when: string;
  photos: string[];
  contact?: { name: string; phone: string };
  anonymous: boolean;
  status: ReportStatus;
  history: ReportEvent[];
  triage?: { urgency: Urgency; newsworthy: boolean; abuse: boolean; reason: string; pending?: boolean };
  publishedAs?: "alert" | "story" | "on-air";
  notUsedReason?: string;
}

export const STATUS_STEPS: { id: ReportStatus; label: string; text: string }[] = [
  { id: "received", label: "Received", text: "Your report reached the NPFTV newsroom." },
  { id: "reviewed", label: "Reviewed by the newsroom", text: "A newsroom editor has read it." },
  { id: "verified", label: "Verified", text: "The newsroom checked the facts with the state police command's public relations office." },
  { id: "published", label: "Published", text: "It was used to inform the public: an alert, a story or a mention on air." },
];

const at = (hhmm: string, date = "2026-11-23") => new Date(`${date}T${hhmm}:00+01:00`).toISOString();
const rx = (hhmm: string, date?: string): ReportEvent => ({ status: "received", at: at(hhmm, date), publicNote: "Your report reached the NPFTV newsroom." });

export const seedReports: CitizenReport[] = [
  // The Lokoja flood cluster (demo step: a fourth report arrives live).
  {
    ref: "NPFTV-RPT-26-04801",
    createdAt: at("17:50"),
    category: "flood",
    summary: "Water entering homes near Ganaja junction after heavy rain.",
    details: "Since about 5pm water has been coming into houses on our street near Ganaja junction. The drain is overflowing and the road to the market is under water.",
    state: "KO",
    lga: "Lokoja",
    landmark: "Ganaja junction",
    when: "Since about 5pm today",
    photos: ["ganaja-street.jpg"],
    anonymous: true,
    status: "reviewed",
    history: [rx("17:50"), { status: "reviewed", at: at("18:05"), publicNote: "A newsroom editor has read your report." }],
    triage: { urgency: "high", newsworthy: true, abuse: false, reason: "Flooding affecting homes; several reports from the same area." },
  },
  {
    ref: "NPFTV-RPT-26-04806",
    createdAt: at("18:20"),
    category: "flood",
    summary: "Adankolo road flooded; cars turning back.",
    details: "The road at Adankolo is flooded up to knee level. Cars are turning back and people are walking through the water.",
    state: "KO",
    lga: "Lokoja",
    landmark: "Adankolo, near the new market",
    when: "This evening",
    photos: [],
    anonymous: false,
    contact: { name: "Hauwa Salihu", phone: "0803 000 0000" },
    status: "received",
    history: [rx("18:20")],
    triage: { urgency: "high", newsworthy: true, abuse: false, reason: "Road flooded; people walking through water." },
  },
  {
    ref: "NPFTV-RPT-26-04809",
    createdAt: at("18:55"),
    category: "flood",
    summary: "Families moving to higher ground at Kpata.",
    details: "Water is rising at Kpata. Some families are carrying their things to the school on the hill.",
    state: "KO",
    lga: "Lokoja",
    landmark: "Kpata, near the primary school",
    when: "Now",
    photos: ["kpata-1.jpg", "kpata-2.jpg"],
    anonymous: true,
    status: "received",
    history: [rx("18:55")],
    triage: { urgency: "high", newsworthy: true, abuse: false, reason: "Families leaving homes; clusters with other Lokoja reports." },
  },
  // Other reports in different states and statuses.
  {
    ref: "NPFTV-RPT-26-04772",
    createdAt: at("14:10"),
    category: "fire",
    summary: "Fire at a section of Kurmi market; traders evacuated.",
    details: "A fire started in the textile section of Kurmi market. The fire service came and traders were moved out.",
    state: "KN",
    lga: "Kano Municipal",
    landmark: "Kurmi market, textile section",
    when: "About 2pm",
    photos: ["kurmi.jpg"],
    anonymous: true,
    status: "published",
    publishedAs: "on-air",
    history: [
      rx("14:10"),
      { status: "reviewed", at: at("14:20"), publicNote: "A newsroom editor has read your report." },
      { status: "verified", at: at("15:05"), publicNote: "Verified with the Kano State Police Command's public relations office." },
      { status: "published", at: at("19:03"), publicNote: "Mentioned on The Beat at 7pm." },
    ],
    triage: { urgency: "medium", newsworthy: true, abuse: false, reason: "Market fire, now under control." },
  },
  {
    ref: "NPFTV-RPT-26-04781",
    createdAt: at("16:30"),
    category: "road-crash",
    summary: "Crash involving a trailer on the Lagos–Ibadan Expressway; outbound traffic slow.",
    details: "A trailer overturned near the Long Bridge, outbound towards Ibadan. One lane is blocked. FRSC are on the scene.",
    state: "OG",
    lga: "Obafemi Owode",
    landmark: "Near the Long Bridge, outbound",
    when: "About 4pm",
    photos: [],
    anonymous: true,
    status: "verified",
    history: [
      rx("16:30"),
      { status: "reviewed", at: at("16:40"), publicNote: "A newsroom editor has read your report." },
      { status: "verified", at: at("17:15"), publicNote: "Verified with the Ogun State Police Command's public relations office." },
    ],
    triage: { urgency: "medium", newsworthy: true, abuse: false, reason: "Major road partly blocked." },
  },
  {
    ref: "NPFTV-RPT-26-04785",
    createdAt: at("17:05"),
    category: "power-line",
    summary: "Electric pole down across a street in Independence Layout.",
    details: "An electric pole fell across the street after the wind. The wires are on the ground.",
    state: "EN",
    lga: "Enugu North",
    landmark: "Independence Layout",
    when: "This afternoon",
    photos: ["pole.jpg"],
    anonymous: true,
    status: "reviewed",
    history: [rx("17:05"), { status: "reviewed", at: at("17:30"), publicNote: "A newsroom editor has read your report." }],
    triage: { urgency: "high", newsworthy: true, abuse: false, reason: "Live wires on a street." },
  },
  {
    ref: "NPFTV-RPT-26-04790",
    createdAt: at("17:20"),
    category: "suspicious",
    summary: "Unknown men taking photos of a school gate.",
    details: "Two men were taking photos of the school gate and drove off.",
    state: "FC",
    lga: "Bwari",
    landmark: "Kubwa",
    when: "Earlier today",
    photos: [],
    anonymous: true,
    status: "not-used",
    notUsedReason: "Not verified",
    history: [
      rx("17:20"),
      { status: "reviewed", at: at("17:40"), publicNote: "A newsroom editor has read your report." },
      { status: "not-used", at: at("18:30"), publicNote: "The newsroom couldn't verify this, so it won't be published. If you're worried, tell your nearest police station." },
    ],
    triage: { urgency: "medium", newsworthy: false, abuse: false, reason: "Unverified; a matter for the police station." },
  },
  {
    ref: "NPFTV-RPT-26-04745",
    createdAt: at("11:15", "2026-11-22"),
    category: "flood",
    summary: "Flooding in parts of Yenagoa after the river rose.",
    details: "Water from the river has covered the road at Swali market and some shops are flooded.",
    state: "BY",
    lga: "Yenagoa",
    landmark: "Swali market",
    when: "Sunday morning",
    photos: ["swali.jpg"],
    anonymous: true,
    status: "published",
    publishedAs: "story",
    history: [
      rx("11:15", "2026-11-22"),
      { status: "reviewed", at: at("11:40", "2026-11-22"), publicNote: "A newsroom editor has read your report." },
      { status: "verified", at: at("13:00", "2026-11-22"), publicNote: "Verified with the Bayelsa State Police Command's public relations office." },
      { status: "published", at: at("16:00", "2026-11-22"), publicNote: "Used in an NPFTV news story." },
    ],
    triage: { urgency: "medium", newsworthy: true, abuse: false, reason: "Market flooded; seasonal river flooding." },
  },
  {
    ref: "NPFTV-RPT-26-04796",
    createdAt: at("17:45"),
    category: "community",
    summary: "Youth clean-up of drains in Bodija ahead of the rains.",
    details: "Young people in our area are clearing the drains on Saturday morning, working with the local police division.",
    state: "OY",
    lga: "Ibadan North",
    landmark: "Bodija",
    when: "Saturday morning",
    photos: [],
    anonymous: false,
    contact: { name: "Tolu Adebayo", phone: "0809 000 0000" },
    status: "received",
    history: [rx("17:45")],
    triage: { urgency: "low", newsworthy: true, abuse: false, reason: "Positive community story for Community Watch." },
  },
];
