"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { articles as seedArticles, KANO_ID, seedSubmissionArticles } from "@/data/articles";
import { approvals as seedApprovals, kanoTriage, pressBriefingProduction, procurement as seedProcurement, roleById, seedProduction, seedSubmissions, sponsorships as seedSponsorships } from "@/data/ops";
import { defaultAlert, preparedAlert, seedTicker } from "@/data/public";
import { buildSchedule, insertSlot, pressBriefingTemplate } from "@/data/schedule";
import { DEFAULT_CLOCK_ISO, fromWat, watParts } from "@/lib/time";
import type { Review } from "@/lib/copydesk";
import type {
  Alert,
  ApprovalItem,
  Article,
  AuditEntry,
  LiveState,
  ProcurementRequest,
  ProductionEvent,
  RoleId,
  ScheduleSlot,
  Sponsorship,
  Submission,
} from "@/lib/types";

const STORAGE_KEY = "npftv-demo-state-v2";
const ROLE_KEY = "npftv-demo-role";
const CHANNEL = "npftv-demo";

export interface TickerItem {
  time: string;
  text: string;
  articleId?: string;
  breaking?: boolean;
}

/** The editor's decisions on an AI copy-desk review (keyed by issue id). */
export interface CopyDeskState {
  decisions: Record<string, "fixed" | "ignored">; // sensitivity issues
  styleDone: Record<string, boolean>; // style fixes applied
  headline: number; // chosen headline option
}

export interface DemoState {
  version: 2;
  articles: Article[];
  submissions: Submission[];
  schedule: ScheduleSlot[];
  production: ProductionEvent[];
  approvals: ApprovalItem[];
  procurement: ProcurementRequest[];
  sponsorships: Sponsorship[];
  ticker: TickerItem[];
  leadStoryId: string;
  featuredIds: string[];
  alertBar: Alert;
  activeAlerts: Alert[];
  draftAlerts: Alert[];
  live: LiveState;
  clock: { pinned: boolean; iso: string };
  aiInstant: boolean;
  aiScripted: boolean; // presenter switch: use scripted answers instead of the live model
  audit: AuditEntry[];
  reminders: string[];
  copyDesk: Record<string, CopyDeskState>;
  reviews: Record<string, Review>; // saved AI copy-desk reviews, so every tab sees the same one
  checkedOut: Record<string, string>; // assetId -> who
}

function seedAudit(): AuditEntry[] {
  return [
    { id: "au-0", at: "2026-11-23T18:52:00+01:00", who: "Amina Bello", role: "Editor-in-Chief", action: "Opened the submissions inbox" },
    { id: "au-1", at: "2026-11-23T18:00:00+01:00", who: "AI assistant", role: "System", action: "Wrote the Network Director's daily brief", ai: true },
    { id: "au-2", at: "2026-11-23T17:40:00+01:00", who: "Funke Adeyemi", role: "News Editor", action: "Published", target: "Road safety: night-time travel advice for the festive season" },
    { id: "au-3", at: "2026-11-23T15:10:00+01:00", who: "Funke Adeyemi", role: "News Editor", action: "Added to the ticker", target: "Cyber Sense at 7:30 pm: how to spot fake loan apps" },
    { id: "au-4", at: "2026-11-23T15:05:00+01:00", who: "Yakubu Danjuma", role: "Reporter", action: "Submitted a story", target: "Kaduna drivers briefed on night travel as festive rush begins" },
    { id: "au-5", at: "2026-11-23T14:20:00+01:00", who: "Bisi Olawale", role: "Reporter", action: "Submitted a story", target: "Ikeja: fraud desk receives 300 reports in first week" },
    { id: "au-6", at: "2026-11-23T12:30:00+01:00", who: "Chinedu Okafor", role: "Broadcast Manager", action: "Confirmed tonight's schedule" },
    { id: "au-7", at: "2026-11-23T11:50:00+01:00", who: "Ebiere Tonye", role: "Reporter", action: "Submitted a story", target: "Rivers marine police begin night patrols on creeks" },
    { id: "au-8", at: "2026-11-23T09:15:00+01:00", who: "Network Director", role: "Network Director", action: "Approved", target: "Stream encoder licence renewal, ₦3.1m" },
  ];
}

export function seedState(): DemoState {
  return {
    version: 2,
    articles: [...seedArticles, ...seedSubmissionArticles],
    submissions: seedSubmissions,
    schedule: buildSchedule(),
    production: seedProduction,
    approvals: seedApprovals,
    procurement: seedProcurement,
    sponsorships: seedSponsorships,
    ticker: seedTicker,
    leadStoryId: "eod-certification",
    featuredIds: ["eod-certification", "fpu-peacekeeping", "five-signs-scam"],
    alertBar: defaultAlert,
    activeAlerts: [],
    draftAlerts: [preparedAlert],
    live: "live",
    clock: { pinned: true, iso: DEFAULT_CLOCK_ISO },
    aiInstant: false,
    aiScripted: false,
    audit: seedAudit(),
    reminders: [],
    copyDesk: {},
    reviews: {},
    checkedOut: {},
  };
}

export const defaultCopyDesk: CopyDeskState = { decisions: {}, styleDone: {}, headline: 0 };

// ---------------------------------------------------------------------------

interface Actor {
  who: string;
  role: string;
}

interface StoreCtx {
  state: DemoState;
  hydrated: boolean;
  role: RoleId | null;
  setRole: (r: RoleId | null) => void;
  actor: Actor;
  /** Apply a change. If `audit` is given, it's recorded in the audit log under the current role. */
  update: (fn: (s: DemoState) => DemoState, audit?: { action: string; target?: string; ai?: boolean; as?: Actor }) => void;
  reset: () => void;
  now: Date;
}

const Ctx = createContext<StoreCtx | null>(null);

function load(): DemoState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoState;
    return parsed.version === 2 ? parsed : null;
  } catch {
    return null;
  }
}

function save(s: DemoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* storage may be unavailable (private mode); the demo still works in this tab */
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(seedState);
  const [hydrated, setHydrated] = useState(false);
  const [role, setRoleState] = useState<RoleId | null>(null);
  const channel = useRef<BroadcastChannel | null>(null);
  const [tick, setTick] = useState(() => Date.now());

  // Load persisted state and this tab's role once on the client.
  useEffect(() => {
    const saved = load();
    if (saved) setState(saved);
    try {
      const r = sessionStorage.getItem(ROLE_KEY) as RoleId | null;
      if (r) setRoleState(r);
    } catch {}
    setHydrated(true);

    const onIncoming = (s: DemoState) => setState(s);
    if (typeof BroadcastChannel !== "undefined") {
      channel.current = new BroadcastChannel(CHANNEL);
      channel.current.onmessage = (e) => onIncoming(e.data as DemoState);
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const s = e.newValue ? (JSON.parse(e.newValue) as DemoState) : seedState();
        onIncoming(s);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      channel.current?.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Real clock ticks when the demo clock is not pinned.
  useEffect(() => {
    if (state.clock.pinned) return;
    const id = setInterval(() => setTick(Date.now()), 10_000);
    return () => clearInterval(id);
  }, [state.clock.pinned]);

  const now = useMemo(() => (state.clock.pinned ? new Date(state.clock.iso) : new Date(tick)), [state.clock, tick]);

  const actor: Actor = useMemo(() => {
    if (!role) return { who: "Presenter", role: "Demo" };
    const r = roleById(role);
    return { who: r.person, role: r.title };
  }, [role]);

  const commit = useCallback((next: DemoState) => {
    save(next);
    channel.current?.postMessage(next);
  }, []);

  const nowRef = useRef(now);
  nowRef.current = now;
  const actorRef = useRef(actor);
  actorRef.current = actor;

  const update = useCallback<StoreCtx["update"]>(
    (fn, audit) => {
      setState((prev) => {
        let next = fn(prev);
        if (audit) {
          const a = audit.as ?? actorRef.current;
          const entry: AuditEntry = {
            id: `au-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            at: nowRef.current.toISOString(),
            who: a.who,
            role: a.role,
            action: audit.action,
            target: audit.target,
            ai: audit.ai,
          };
          next = { ...next, audit: [entry, ...next.audit] };
        }
        // Defer side effects out of the state updater.
        queueMicrotask(() => commit(next));
        return next;
      });
    },
    [commit],
  );

  const reset = useCallback(() => {
    const s = seedState();
    setState(s);
    commit(s);
  }, [commit]);

  const setRole = useCallback((r: RoleId | null) => {
    setRoleState(r);
    try {
      if (r) sessionStorage.setItem(ROLE_KEY, r);
      else sessionStorage.removeItem(ROLE_KEY);
    } catch {}
  }, []);

  const value = useMemo(() => ({ state, hydrated, role, setRole, actor, update, reset, now }), [state, hydrated, role, setRole, actor, update, reset, now]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useDemo must be used inside <DemoProvider>");
  return c;
}

// ---------------------------------------------------------------------------
// Domain actions. Each one is a pure state transform plus an audit line.

export function useActions() {
  const { update, now } = useDemo();
  const hhmm = watParts(now).hhmm;

  return useMemo(
    () => ({
      /** Reporter submits. Kano gets its scripted triage; other stories get a placeholder until AI triage returns. */
      submitStory(id: string, title: string, photos: number) {
        update(
          (s) => {
            const art = s.articles.find((a) => a.id === id);
            const triage: Submission["triage"] = id === KANO_ID ? kanoTriage : { category: art?.category ?? "state-commands", state: art?.state ?? "KN", urgency: "routine", pending: true };
            const exists = s.submissions.some((x) => x.articleId === id);
            return {
              ...s,
              articles: s.articles.map((a) => (a.id === id ? { ...a, status: "submitted", date: now.toISOString() } : a)),
              // A resubmitted story gets a fresh AI review.
              reviews: Object.fromEntries(Object.entries(s.reviews).filter(([k]) => k !== id || id === KANO_ID)),
              copyDesk: Object.fromEntries(Object.entries(s.copyDesk).filter(([k]) => k !== id)),
              submissions: exists
                ? s.submissions.map((x) => (x.articleId === id ? { ...x, at: hhmm, triage } : x))
                : [{ id: `sub-${id}`, articleId: id, from: "Musa Ibrahim", desk: "Kano", at: hhmm, triage }, ...s.submissions],
            };
          },
          { action: `Submitted a story${photos ? ` with ${photos} photo${photos === 1 ? "" : "s"}` : ""} from the Kano desk`, target: title },
        );
        if (id === KANO_ID) {
          update((s) => s, { action: "AI review finished: 2 sensitivity issues, 1 style fix", target: title, ai: true, as: { who: "AI copy desk", role: "System" } });
        }
      },
      setTriage(articleId: string, triage: Submission["triage"], title: string) {
        update(
          (s) => ({ ...s, submissions: s.submissions.map((x) => (x.articleId === articleId ? { ...x, triage } : x)) }),
          { action: `AI triage: ${triage.urgency === "priority" ? "priority" : "routine"}`, target: title, ai: true, as: { who: "AI triage", role: "System" } },
        );
      },
      /** Reporter starts a brand-new story (to show the live copy desk on any text). */
      newStory(): string {
        const id = `story-${Date.now().toString(36)}`;
        update((s) => ({
          ...s,
          articles: [
            {
              id,
              slug: id,
              title: "",
              summary: "",
              body: [""],
              category: "state-commands",
              state: "KN",
              date: now.toISOString(),
              author: "Musa Ibrahim",
              status: "draft",
              thumb: "graphic",
              graphicIcon: "file",
            },
            ...s.articles,
          ],
        }));
        return id;
      },
      saveReview(id: string, review: Review, live: boolean, title: string) {
        const n = review.sensitivity.length;
        const st = review.style.length;
        update((s) => ({ ...s, reviews: { ...s.reviews, [id]: review } }), {
          action: `AI review finished: ${n} sensitivity issue${n === 1 ? "" : "s"}, ${st} style fix${st === 1 ? "" : "es"}${live ? "" : " (scripted)"}`,
          target: title,
          ai: true,
          as: { who: "AI copy desk", role: "System" },
        });
      },
      clearReview(id: string, title: string) {
        update(
          (s) => ({
            ...s,
            reviews: Object.fromEntries(Object.entries(s.reviews).filter(([k]) => k !== id)),
            copyDesk: Object.fromEntries(Object.entries(s.copyDesk).filter(([k]) => k !== id)),
          }),
          { action: "Asked the AI copy desk to check again", target: title },
        );
      },
      setAiScripted(v: boolean) {
        update((s) => ({ ...s, aiScripted: v }));
      },
      saveStory(id: string, patch: Partial<Article>, title: string) {
        update((s) => ({ ...s, articles: s.articles.map((a) => (a.id === id ? { ...a, ...patch } : a)) }), { action: "Saved changes", target: title });
      },
      setCopyDesk(id: string, patch: Partial<CopyDeskState>, audit?: string, target?: string) {
        update(
          (s) => ({ ...s, copyDesk: { ...s.copyDesk, [id]: { ...defaultCopyDesk, ...s.copyDesk[id], ...patch } } }),
          audit ? { action: audit, target } : undefined,
        );
      },
      publishStory(id: string, patch: Partial<Article>) {
        update(
          (s) => {
            const art = s.articles.find((a) => a.id === id);
            if (!art) return s;
            const title = patch.title ?? art.title;
            const slug = art.id.startsWith("story-")
              ? `${title.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70)}-${art.id.slice(-4)}`
              : art.slug;
            const published: Article = { ...art, ...patch, slug, status: "published", date: now.toISOString() };
            return {
              ...s,
              articles: s.articles.map((a) => (a.id === id ? published : a)),
              submissions: s.submissions.filter((x) => x.articleId !== id),
              ticker: [{ time: hhmm, text: title, articleId: id }, ...s.ticker.filter((t) => t.articleId !== id)].slice(0, 6),
              featuredIds: [id, ...s.featuredIds.filter((f) => f !== id)].slice(0, 3),
            };
          },
          { action: "Approved and published", target: patch.title },
        );
      },
      returnStory(id: string, title: string) {
        update(
          (s) => ({
            ...s,
            articles: s.articles.map((a) => (a.id === id ? { ...a, status: "returned" } : a)),
            submissions: s.submissions.filter((x) => x.articleId !== id),
          }),
          { action: "Returned to reporter", target: title },
        );
      },
      setArticleStatus(id: string, status: Article["status"], title: string, verb: string) {
        update((s) => ({ ...s, articles: s.articles.map((a) => (a.id === id ? { ...a, status } : a)) }), { action: verb, target: title });
      },
      schedulePressBriefing() {
        update(
          (s) => {
            if (s.schedule.some((x) => x.id === "evt-press-briefing")) return s;
            const slot: ScheduleSlot = { id: "evt-press-briefing", ...pressBriefingTemplate, live: true, event: true };
            return {
              ...s,
              schedule: insertSlot(s.schedule, slot),
              production: [{ ...pressBriefingProduction, slotId: slot.id }, ...s.production],
            };
          },
          { action: "Scheduled a live event: Thu 26 Nov, 11:00 to 12:00. Booked 4 crew, OB Van 1, camera kits 3 and 7 (₦1.85m)", target: "Press briefing from Force Headquarters" },
        );
      },
      addSlot(slot: ScheduleSlot) {
        update((s) => ({ ...s, schedule: insertSlot(s.schedule, slot) }), { action: `Added to the schedule: ${slot.date} ${slot.start}`, target: slot.title });
      },
      setLive(live: LiveState) {
        const label = { live: "Live", "off-air": "Off air", technical: "Technical difficulty" }[live];
        update((s) => ({ ...s, live }), { action: `Set the channel to "${label}"` });
      },
      pushBreaking(text: string) {
        update((s) => ({ ...s, ticker: [{ time: hhmm, text, breaking: true }, ...s.ticker].slice(0, 6) }), { action: "Pushed breaking news to the ticker", target: text });
      },
      publishAlert(alert: Alert) {
        update(
          (s) => ({
            ...s,
            alertBar: alert,
            activeAlerts: [alert, ...s.activeAlerts.filter((a) => a.id !== alert.id)],
            draftAlerts: s.draftAlerts.filter((a) => a.id !== alert.id),
            approvals: s.approvals.map((ap) => (ap.id === "ap-missing-lagos" && alert.id === "alert-missing-lagos" ? { ...ap, status: "approved" } : ap)),
          }),
          { action: "Approved and published a public safety alert", target: alert.title },
        );
      },
      withdrawAlert(id: string, title: string) {
        update(
          (s) => {
            const remaining = s.activeAlerts.filter((a) => a.id !== id);
            return { ...s, activeAlerts: remaining, alertBar: remaining[0] ?? seedState().alertBar };
          },
          { action: "Withdrew a public safety alert", target: title },
        );
      },
      saveDraftAlert(alert: Alert) {
        update((s) => ({ ...s, draftAlerts: [alert, ...s.draftAlerts] }), { action: "Drafted a public safety alert (needs approval)", target: alert.title });
      },
      decide(id: string, status: "approved" | "declined", title: string) {
        update(
          (s) => ({
            ...s,
            approvals: s.approvals.map((a) => (a.id === id ? { ...a, status } : a)),
            procurement: s.procurement.map((p) => (p.item === title ? { ...p, status, chain: p.chain.map((c) => ({ ...c, done: true })) } : p)),
          }),
          { action: status === "approved" ? "Approved" : "Declined", target: title },
        );
      },
      setLead(id: string, title: string) {
        update((s) => ({ ...s, leadStoryId: id, featuredIds: [id, ...s.featuredIds.filter((f) => f !== id)].slice(0, 3) }), { action: "Set the homepage lead story", target: title });
      },
      setFeatured(ids: string[]) {
        update((s) => ({ ...s, featuredIds: ids }), { action: "Updated the homepage featured stories" });
      },
      removeTicker(index: number) {
        update((s) => ({ ...s, ticker: s.ticker.filter((_, i) => i !== index) }), { action: "Removed an item from the ticker" });
      },
      toggleReminder(slotId: string) {
        update((s) => ({ ...s, reminders: s.reminders.includes(slotId) ? s.reminders.filter((r) => r !== slotId) : [...s.reminders, slotId] }));
      },
      setClock(pinned: boolean, iso?: string) {
        update((s) => ({ ...s, clock: { pinned, iso: iso ?? s.clock.iso } }));
      },
      setClockWat(date: string, hhmm: string) {
        update((s) => ({ ...s, clock: { pinned: true, iso: fromWat(date, hhmm).toISOString() } }));
      },
      setAiInstant(v: boolean) {
        update((s) => ({ ...s, aiInstant: v }));
      },
      checkOut(assetId: string, name: string, who: string) {
        update((s) => ({ ...s, checkedOut: { ...s.checkedOut, [assetId]: who } }), { action: "Checked out", target: name });
      },
      checkIn(assetId: string, name: string) {
        update(
          (s) => {
            const c = { ...s.checkedOut };
            delete c[assetId];
            return { ...s, checkedOut: c };
          },
          { action: "Checked in", target: name },
        );
      },
      log(action: string, target?: string, ai?: boolean) {
        update((s) => s, { action, target, ai });
      },
    }),
    [update, now, hhmm],
  );
}

export { KANO_ID };
