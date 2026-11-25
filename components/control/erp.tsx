"use client";

import Link from "next/link";
import { useState } from "react";
import { budget, fmtNaira } from "@/data/ops";
import { CORRESPONDENT_DESKS, CORRESPONDENT_TOTAL, states, tier } from "@/data/places";
import { askData, DIRECTOR_CHIPS, type AskDataResult } from "@/lib/ai";
import { aiOpts, askAI } from "@/lib/ai-client";
import { useActions, useDemo } from "@/lib/store";
import type { ApprovalItem } from "@/lib/types";
import { Icon, type IconName } from "../Icon";
import { useToast } from "../Toast";

export const APPROVAL_ICON: Record<ApprovalItem["kind"], IconName> = {
  procurement: "box",
  alert: "alert",
  sponsorship: "radio",
  leave: "users",
  overtime: "clock",
  travel: "truck",
  article: "file",
};

export function KpiTile({ icon, label, value, note, up, meter }: { icon: IconName; label: string; value: string; note: string; up?: boolean; meter?: number }) {
  return (
    <div className="pnl kpi">
      <span>
        <Icon name={icon} />
        {label}
      </span>
      <b>{value}</b>
      <small className={up ? "up" : ""}>{note}</small>
      {meter !== undefined && (
        <div className="meter">
          <i style={{ width: `${meter}%` }} />
        </div>
      )}
    </div>
  );
}

export function DailyBrief() {
  const { state } = useDemo();
  const act = useActions();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [ans, setAns] = useState<{ q: string; a: AskDataResult } | null>(null);
  const briefingBooked = state.production.some((p) => p.id === "prod-press-briefing");

  async function ask(question: string) {
    if (!question.trim()) return;
    setBusy(true);
    setAns(null);
    const q = question.trim().slice(0, 300);
    // The three suggested questions keep their reviewed answers; free questions go to the live model.
    const { data: a } = await askAI<AskDataResult>("ask-data", { question: q, briefingBooked }, () => askData(q), { ...aiOpts(state), forceScripted: DIRECTOR_CHIPS.includes(q) });
    setAns({ q: question, a });
    setBusy(false);
    setQ("");
    act.log("Asked the daily brief a question", question, true);
  }

  return (
    <div className="brief">
      <div className="brief-hd">
        <Icon name="spark" />
        <h2>Your daily brief</h2>
        <small>Written by AI at 18:00 from today&apos;s data</small>
      </div>
      <ul>
        <li>
          <span>
            <b>The Beat had its biggest audience this month</b> last night, peaking at 31,200, led by the festive travel story.
          </span>
        </li>
        {briefingBooked ? (
          <li>
            <span>
              <b>Thursday&apos;s press briefing is fully staffed:</b> 4 crew, OB Van 1 and camera kits 3 and 7. Estimated cost ₦1.85m, inside the broadcast operations budget.
            </span>
          </li>
        ) : (
          <li>
            <span>
              <b>Thursday morning is clear.</b> OB Van 1 and 14 camera kits are free if a live event is booked.
            </span>
          </li>
        )}
        <li>
          <span>
            <b>Drone 2 is in repair until 30 November.</b> The Air Wing premiere will use archive aerial footage instead.
          </span>
        </li>
        <li>
          <span>
            <b>Programmes has used 63% of its quarter budget</b> with five weeks left, so it&apos;s on track.
          </span>
        </li>
      </ul>
      <form
        className="ask"
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
      >
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about the network…" aria-label="Ask about the network" />
        <button className="btn btn-yellow btn-sm" disabled={busy}>
          <Icon name="send" />
          Ask
        </button>
      </form>
      <div className="chips">
        {DIRECTOR_CHIPS.map((c) => (
          <button key={c} onClick={() => ask(c)}>
            {c}
          </button>
        ))}
      </div>
      {(busy || ans) && (
        <div className="answer" aria-live="polite">
          {busy ? (
            <div style={{ display: "grid", gap: 8 }}>
              <span className="skel" style={{ background: "rgba(255,255,255,.12)" }} />
              <span className="skel" style={{ width: "70%", background: "rgba(255,255,255,.12)" }} />
            </div>
          ) : (
            ans && (
              <>
                <b style={{ color: "#fff", display: "block", marginBottom: 4 }}>{ans.q}</b>
                {ans.a.answer}
                {ans.a.figuresUsed.length > 0 && <small>Figures used: {ans.a.figuresUsed.join(" · ")}</small>}
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}

export function ApprovalList({ limit, showActions }: { limit?: number; showActions?: boolean }) {
  const { state, role } = useDemo();
  const act = useActions();
  const toast = useToast();
  const waiting = state.approvals.filter((a) => a.status === "waiting");
  const list = (showActions ? state.approvals : waiting).slice(0, limit);
  const canDecide = role === "network-director" || role === "super-admin";
  return (
    <ul className="appr">
      {list.map((a) => (
        <li key={a.id} style={showActions ? { gridTemplateColumns: "34px 1fr auto auto" } : undefined}>
          <span className="ic">
            <Icon name={APPROVAL_ICON[a.kind]} />
          </span>
          <span>
            <b>{a.title}</b>
            <small>{a.detail}</small>
          </span>
          <span className="amt">
            {a.amount}
            {a.amountNote && <small>{a.amountNote}</small>}
          </span>
          {showActions &&
            (a.status === "waiting" ? (
              <span style={{ display: "flex", gap: 6 }}>
                <button
                  className="mini pri"
                  disabled={!canDecide}
                  onClick={() => {
                    if (a.kind === "alert") {
                      const alert = state.draftAlerts.find((x) => x.id === "alert-missing-lagos");
                      if (alert) act.publishAlert(alert);
                      else act.decide(a.id, "approved", a.title);
                      toast("Approved. The alert is live on npftv.net.");
                    } else {
                      act.decide(a.id, "approved", a.title);
                      toast(`Approved: ${a.title}`);
                    }
                  }}
                >
                  Approve
                </button>
                <button className="mini" disabled={!canDecide} onClick={() => act.decide(a.id, "declined", a.title)}>
                  Decline
                </button>
              </span>
            ) : (
              <span className={`tag ${a.status === "approved" ? "tag-green" : "tag-red"}`}>{a.status === "approved" ? "Approved" : "Declined"}</span>
            ))}
        </li>
      ))}
      {!list.length && <li style={{ display: "block" }} className="empty">Nothing waiting for approval.</li>}
    </ul>
  );
}

export function BudgetBars({ committed }: { committed?: Record<string, number> }) {
  return (
    <div className="bud">
      {budget.map((b) => {
        const pct = Math.round((b.used / b.budget) * 100);
        const com = committed?.[b.id] ?? 0;
        return (
          <div key={b.id}>
            <div className="lbl">
              <b>{b.department}</b>
              <span>
                {fmtNaira(b.used)} of {fmtNaira(b.budget)}
                {com ? ` · +${fmtNaira(com)} booked` : ""}
              </span>
            </div>
            <div className="trk">
              <i className={pct >= 75 ? "" : ""} style={{ width: `${pct}%` }} />
              {com > 0 && <i className="com" style={{ width: `${(com / b.budget) * 100}%` }} title="Committed this week" />}
            </div>
          </div>
        );
      })}
      <p className="note">Five weeks left in the quarter. No department is over 80%.</p>
    </div>
  );
}

export function TileMap({ big, highlight = "KN" }: { big?: boolean; highlight?: string }) {
  return (
    <div className={`tm${big ? " big" : ""}`} role="img" aria-label="Map of the 37 correspondent desks, shaded by stories sent in November">
      {states.map((s) => (
        <span key={s.id} className={s.id === highlight ? "me" : tier(s.stories)} style={{ gridColumn: s.col, gridRow: s.row }} title={`${s.name}: ${s.stories}`}>
          {s.id}
        </span>
      ))}
    </div>
  );
}

export function CorrespondentPanel() {
  const toast = useToast();
  const top = [...states].sort((a, b) => b.stories - a.stories).slice(0, 5);
  return (
    <div className="pnl">
      <div className="p-hd">
        <h3>Correspondent network: stories sent in November</h3>
        <Link href="/control/ops/correspondents">Correspondents</Link>
      </div>
      <div className="corr">
        <TileMap />
        <div className="legend">
          <div>
            <b>{CORRESPONDENT_TOTAL}</b>stories from {CORRESPONDENT_DESKS} desks this month
          </div>
          <div>
            <b>Kano</b>sent today&apos;s top submission
          </div>
          <div>
            Fewest: Yobe, Taraba, Ekiti and Ebonyi
            <div className="scale">
              Fewer <i style={{ background: "#e6e1f2" }} />
              <i style={{ background: "#c9bfe6" }} />
              <i style={{ background: "#9a87d1" }} />
              <i style={{ background: "var(--indigo-3)" }} /> More
            </div>
          </div>
          <button className="btn btn-line btn-sm" style={{ justifySelf: "start" }} onClick={() => toast("Demo: message drafted to the Yobe, Taraba, Ekiti and Ebonyi desks.")}>
            Message the four desks
          </button>
        </div>
        <div className="top">
          <h4>Most stories this month</h4>
          <ul>
            {top.map((s, i) => (
              <li key={s.id}>
                <span>{i + 1}</span>
                <b>{s.name}</b>
                <i>{s.stories}</i>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
