// Shared types for the NPFTV demo's fake world.

export type ProgrammeId =
  | "the-beat"
  | "safe-nigeria"
  | "community-watch"
  | "force-in-focus"
  | "cyber-sense"
  | "in-conversation"
  | "insight-podcast";

/** Poster colour treatments from the design (a1..a6). */
export type PosterStyle = "a1" | "a2" | "a3" | "a4" | "a5" | "a6";

export interface Programme {
  id: ProgrammeId;
  title: string;
  strand: string;
  scheduleText: string;
  short: string;
  description: string;
  poster: PosterStyle;
  presenter?: string;
}

export interface Episode {
  id: string;
  programmeId: ProgrammeId;
  title: string;
  date: string; // ISO date
  duration: string; // "48:10"
  summary: string;
  chapters: { time: string; title: string }[];
  catchUp: { time: string; text: string }[];
  thumb?: "eod" | "parade";
  progress?: number; // 0..1, "continue watching"
}

export interface ScheduleSlot {
  id: string;
  date: string; // YYYY-MM-DD (WAT)
  start: string; // HH:MM WAT
  end: string; // HH:MM WAT
  programmeId?: ProgrammeId;
  title: string;
  subtitle: string;
  live?: boolean;
  event?: boolean; // live event / premiere
  location?: string;
}

export type ArticleStatus =
  | "draft"
  | "submitted"
  | "returned"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected"
  | "withdrawn";

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string[];
  category: string; // category id
  state?: string; // state command id
  date: string; // ISO datetime
  author: string;
  status: ArticleStatus;
  thumb?: "eod" | "parade" | "graphic";
  graphicIcon?: string;
  featured?: boolean;
  photos?: string[];
}

export interface Category {
  id: string;
  name: string;
  short?: string;
}

export interface StateCommand {
  id: string; // two-letter code, e.g. "KN"
  name: string;
  capital: string;
  stories: number; // November
  col: number;
  row: number;
  zone: string;
}

export interface Guide {
  id: string;
  title: string;
  short: string;
  icon: string;
  steps: string[];
  keywords: string[];
}

export interface Alert {
  id: string;
  title: string;
  body: string;
  level: "info" | "urgent";
  state?: string;
  verifiedBy?: string;
  expires?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  rank?: string; // seconded officers
  state?: string;
  status: "on-duty" | "off" | "leave" | "field";
}

export type RoleId =
  | "reporter"
  | "news-editor"
  | "editor-in-chief"
  | "broadcast-manager"
  | "programme-manager"
  | "media-manager"
  | "pio"
  | "network-director"
  | "super-admin";

export interface Role {
  id: RoleId;
  title: string;
  person: string; // display name; Network Director by title only
  initials: string;
  blurb: string;
  home: string; // landing route
}

export type AssetKind = "ob-van" | "camera" | "drone" | "vehicle" | "studio";

export interface Asset {
  id: string;
  name: string;
  kind: AssetKind;
  status: "available" | "booked" | "out" | "repair";
  note: string;
}

export interface Booking {
  id: string;
  assetId: string;
  eventId: string;
  date: string;
  start: string;
  end: string;
}

export interface ProductionEvent {
  id: string;
  date: string;
  start: string;
  end: string;
  title: string;
  note: string;
  crew: string[]; // staff ids
  assets: string[]; // asset ids
  cost?: number; // naira
  budgetLine?: string;
  warn?: string;
  slotId?: string;
}

export interface BudgetLine {
  id: string;
  department: string;
  used: number; // naira
  budget: number;
}

export type ApprovalKind = "procurement" | "alert" | "sponsorship" | "leave" | "overtime" | "travel" | "article";

export interface ApprovalItem {
  id: string;
  kind: ApprovalKind;
  title: string;
  detail: string;
  amount?: string;
  amountNote?: string;
  status: "waiting" | "approved" | "declined";
}

export interface ProcurementRequest {
  id: string;
  item: string;
  amount: number;
  requestedBy: string;
  chain: { step: string; done: boolean }[];
  status: "waiting" | "approved" | "declined";
}

export interface Sponsorship {
  id: string;
  partner: string;
  campaign: string;
  programme: ProgrammeId;
  value: number;
  weeks: number;
  status: "proposed" | "active" | "ended";
}

export interface Submission {
  id: string;
  articleId: string;
  from: string;
  desk: string;
  at: string; // HH:MM
  triage: { category: string; state: string; urgency: "routine" | "priority"; possibleDuplicateOf?: string; reason?: string; pending?: boolean };
}

export interface AuditEntry {
  id: string;
  at: string; // ISO
  who: string;
  role: string;
  action: string;
  target?: string;
  ai?: boolean;
}

export interface SocialPost {
  id: string;
  platform: "YouTube" | "X" | "Instagram" | "Facebook";
  ago: string;
  text: string;
  big?: string;
  media: "thumb" | "eod" | "emblem" | "big";
  stats: [string, string];
}

export interface MediaItem {
  id: string;
  title: string;
  kind: "photo" | "video" | "document";
  img?: "eod" | "parade" | "emblem" | "logo";
  date: string;
  rights: "Free to use with credit" | "Editorial use only" | "Request permission";
  size?: string;
}

export type LiveState = "live" | "off-air" | "technical";
