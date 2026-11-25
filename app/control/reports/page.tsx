"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryInfo } from "@/data/agencies";
import { commandName } from "@/data/notices";
import { stateById } from "@/data/places";
import type { CitizenReport, ReportStatus } from "@/data/reports";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { TopBar } from "@/components/control/Shell";
import { aiOpts, askAI } from "@/lib/ai-client";
import { clusters, reportTriage, type ReportTriage } from "@/lib/reporting";
import { useActions, useDemo } from "@/lib/store";
import { fmt, isoDate, isoTime } from "@/lib/time";
import type { Alert } from "@/lib/types";

const TABS: { id: ReportStatus | "all"; label: string }[] = [
  { id: "received", label: "New" },
  { id: "reviewed", label: "Reviewed" },
  { id: "verified", label: "Verified" },
  { id: "published", label: "Published" },
  { id: "not-used", label: "Not used" },
  { id: "all", label: "All" },
];
const URGENCY_RANK = { high: 0, medium: 1, low: 2 } as const;
const triaging = new Set<string>();

const place = (r: CitizenReport) => [r.landmark, r.lga, stateById(r.state)?.name].filter(Boolean).join(", ");
const command = (r: CitizenReport) => {
  const st = stateById(r.state);
  return st ? commandName(st.id, st.name) : "the state police command";
};

export default function ReportsDesk() {
  const { state, hydrated } = useDemo();
  const act = useActions();
  const toast = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("received");
  const [open, setOpen] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  // Finish AI triage for any report still waiting (e.g. the citizen closed the page straight away).
  useEffect(() => {
    if (!hydrated) return;
    for (const r of state.reports) {
      if (r.triage || triaging.has(r.ref)) continue;
      triaging.add(r.ref);
      askAI<ReportTriage>("report-triage", { category: r.category, summary: r.summary, details: r.details, place: place(r) }, () => reportTriage(r), aiOpts(state))
        .then(({ data }) => act.setReportTriage(r.ref, data, r.summary))
        .finally(() => triaging.delete(r.ref));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, state.reports]);

  const count = (t: (typeof TABS)[number]["id"]) => state.reports.filter((r) => t === "all" || r.status === t).length;
  const list = state.reports
    .filter((r) => tab === "all" || r.status === tab)
    .sort((a, b) => (URGENCY_RANK[a.triage?.urgency ?? "medium"] - URGENCY_RANK[b.triage?.urgency ?? "medium"]) || (a.createdAt < b.createdAt ? 1 : -1));
  const groups = clusters(state.reports).filter((g) => g.some((r) => r.status !== "published"));
  const pendingAlertRefs = new Set(state.draftAlerts.flatMap((a) => a.reportRefs ?? []));

  function draftAlert(rs: CitizenReport[]) {
    const r = rs[0];
    const cat = categoryInfo(r.category);
    const where = [r.lga, stateById(r.state)?.name].filter(Boolean).join(", ");
    const alert: Alert = {
      id: `alert-rpt-${Date.now().toString(36)}`,
      title: `${cat.label} in ${where}`,
      body: `${rs.length > 1 ? `Residents report: ${r.summary.replace(/\.$/, "")}.` : r.summary} ${cat.safety[0] ?? ""} In an emergency, call 112.`.trim(),
      level: rs.some((x) => x.triage?.urgency === "high") ? "urgent" : "info",
      state: r.state,
      verifiedBy: command(r),
      expires: "in 2 days",
      href: "/safety#alerts",
      reportRefs: rs.map((x) => x.ref),
    };
    act.saveDraftAlert(alert);
    toast("Alert drafted. It needs approval in Safety alerts.");
  }

  function setStatus(r: CitizenReport, status: ReportStatus, publicNote: string, extra: Partial<CitizenReport> = {}, action?: string) {
    act.updateReport(r.ref, r.summary, status, publicNote, extra, action);
    // Follow the report to its new tab and keep it open, so the editor can carry on.
    if (tab !== "all") setTab(status);
    setOpen(r.ref);
  }

  return (
    <>
      <TopBar crumbs={["Citizen reporting", "Reports"]} search="Search reports" />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Citizen reports</h1>
            <p>Reports sent to the newsroom for news and public awareness. NPFTV doesn&apos;t forward reports: verify with the state command, then inform the public.</p>
          </div>
          <Link className="btn btn-line btn-sm" href="/safety/report" target="_blank">
            <Icon name="eye" /> Public form
          </Link>
        </div>

        <div className="kpis">
          {(
            [
              ["New", "received", "inbox"],
              ["Reviewed", "reviewed", "eye"],
              ["Verified", "verified", "check"],
              ["Published", "published", "radio"],
            ] as const
          ).map(([label, id, icon]) => (
            <div key={id} className="pnl kpi">
              <span>
                <Icon name={icon} />
                {label}
              </span>
              <b>{count(id)}</b>
              <small>{id === "received" ? "waiting for the newsroom" : id === "published" ? "used to inform the public" : "reports"}</small>
            </div>
          ))}
        </div>

        {groups.map((g) => {
          const r = g[0];
          const cat = categoryInfo(r.category);
          const verified = g.some((x) => x.status === "verified");
          const drafted = g.some((x) => pendingAlertRefs.has(x.ref));
          return (
            <div key={`${r.category}-${r.state}-${r.lga}`} className="pnl cluster">
              <span className="cl-ic">
                <Icon name={cat.icon} />
              </span>
              <div>
                <b>
                  {g.length} reports: {cat.label.toLowerCase()}, {r.lga || stateById(r.state)?.name}
                </b>
                <p>
                  {stateById(r.state)?.name} · between {isoTime(g[0].createdAt)} and {isoTime(g[g.length - 1].createdAt)} · {g.filter((x) => x.status === "verified").length} verified
                </p>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {drafted ? (
                  <Link className="mini" href="/control/alerts">
                    Alert waiting for approval
                  </Link>
                ) : (
                  <button className="mini pri" disabled={!verified} title={verified ? undefined : "Verify at least one report with the state command first"} onClick={() => draftAlert(g.filter((x) => x.status !== "not-used"))}>
                    <Icon name="alert" /> Draft a public alert
                  </button>
                )}
              </div>
              {!verified && !drafted && <p className="cl-hint">Verify at least one report with the {command(r)} before drafting an alert.</p>}
            </div>
          );
        })}

        <div className="seg" role="tablist" style={{ justifySelf: "start" }}>
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
              {t.label} ({count(t.id)})
            </button>
          ))}
        </div>

        <div className="pnl">
          {list.length === 0 && <div className="empty">No reports here.</div>}
          {list.map((r) => {
            const cat = categoryInfo(r.category);
            const isOpen = open === r.ref;
            const t = r.triage;
            return (
              <div key={r.ref} className={`rep${isOpen ? " open" : ""}`}>
                <button className="rep-row" onClick={() => setOpen(isOpen ? null : r.ref)} aria-expanded={isOpen}>
                  <span className={`rep-ic u-${t?.urgency ?? "medium"}`}>
                    <Icon name={cat.icon} />
                  </span>
                  <span className="rep-main">
                    <b>{r.summary}</b>
                    <small>
                      {cat.label} · {place(r)} · {fmt.dayMonShort(isoDate(r.createdAt))} {isoTime(r.createdAt)}
                    </small>
                    <span className="res" style={{ marginTop: 6 }}>
                      {!t ? (
                        <span>
                          <Icon name="spark" />
                          AI triage running…
                        </span>
                      ) : (
                        <>
                          <span className={t.urgency === "high" ? "bad" : t.urgency === "medium" ? "warn" : ""}>
                            <Icon name="alert" />
                            {t.urgency[0].toUpperCase() + t.urgency.slice(1)} urgency
                          </span>
                          {t.newsworthy && (
                            <span>
                              <Icon name="radio" />
                              Newsworthy
                            </span>
                          )}
                          {t.abuse && (
                            <span className="bad">
                              <Icon name="x" />
                              Possible abuse
                            </span>
                          )}
                        </>
                      )}
                      {pendingAlertRefs.has(r.ref) && <span className="warn">Alert waiting for approval</span>}
                    </span>
                  </span>
                  <span className={`tag ${r.status === "published" ? "tag-green" : r.status === "not-used" ? "tag-soft" : r.status === "verified" ? "tag-feat" : "tag-soft"}`}>{r.status === "received" ? "New" : r.status === "not-used" ? "Not used" : r.status[0].toUpperCase() + r.status.slice(1)}</span>
                </button>

                {isOpen && (
                  <div className="rep-body">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                      <div style={{ display: "grid", gap: 10 }}>
                        <p style={{ whiteSpace: "pre-line", fontSize: 15 }}>{r.details}</p>
                        <dl className="rep-facts">
                          <dt>Where</dt>
                          <dd>{place(r) || "Not given"}</dd>
                          <dt>When</dt>
                          <dd>{r.when || "Not given"}</dd>
                          <dt>Photos</dt>
                          <dd>{r.photos.length ? r.photos.join(", ") : "None"}</dd>
                          <dt>Sent by</dt>
                          <dd>
                            {r.anonymous || !r.contact ? (
                              "Anonymous"
                            ) : revealed[r.ref] ? (
                              `${r.contact.name || "No name"} · ${r.contact.phone || "No phone"}`
                            ) : (
                              <button
                                className="mini"
                                onClick={() => {
                                  setRevealed((v) => ({ ...v, [r.ref]: true }));
                                  act.revealContact(r.ref);
                                }}
                              >
                                <Icon name="eye" /> Show contact details (logged)
                              </button>
                            )}
                          </dd>
                          <dt>Reference</dt>
                          <dd>{r.ref}</dd>
                        </dl>
                        {t && (
                          <p className="ai-note">
                            <Icon name="spark" /> AI triage: {t.reason}
                          </p>
                        )}
                      </div>
                      <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
                        <h4 style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted)" }}>Newsroom actions</h4>
                        {r.status === "received" && (
                          <button className="btn btn-sm btn-indigo" onClick={() => setStatus(r, "reviewed", "A newsroom editor has read your report.")}>
                            <Icon name="eye" /> Mark reviewed
                          </button>
                        )}
                        {(r.status === "received" || r.status === "reviewed") && (
                          <button className="btn btn-sm btn-line" onClick={() => setStatus(r, "verified", `Verified with the ${command(r)}'s public relations office.`, {}, `Verified with the ${command(r)} PRO`)}>
                            <Icon name="check" /> Verified with the command&apos;s PRO
                          </button>
                        )}
                        {r.status === "verified" && !pendingAlertRefs.has(r.ref) && (
                          <button className="btn btn-sm btn-indigo" onClick={() => draftAlert([r])}>
                            <Icon name="alert" /> Draft a public alert
                          </button>
                        )}
                        {r.status === "verified" && (
                          <>
                            <button className="btn btn-sm btn-line" onClick={() => setStatus(r, "published", "Mentioned on air on NPFTV.", { publishedAs: "on-air" }, "Used a citizen report on air")}>
                              <Icon name="radio" /> Used on air
                            </button>
                            <button className="btn btn-sm btn-line" onClick={() => setStatus(r, "published", "Used in an NPFTV news story.", { publishedAs: "story" }, "Used a citizen report in a story")}>
                              <Icon name="file" /> Used in a story
                            </button>
                          </>
                        )}
                        {r.status !== "published" && r.status !== "not-used" && (
                          <select
                            className="inp"
                            value=""
                            aria-label="Not used"
                            onChange={(e) => {
                              const reason = e.target.value;
                              if (!reason) return;
                              const note =
                                reason === "Duplicate"
                                  ? "Thank you. Others reported this too, so we used their reports."
                                  : reason === "Not verified"
                                    ? "The newsroom couldn't verify this, so it won't be published. If you're worried, tell your nearest police station."
                                    : "Thank you. The newsroom won't publish this one.";
                              setStatus(r, "not-used", note, { notUsedReason: reason }, `Marked a citizen report not used (${reason.toLowerCase()})`);
                            }}
                          >
                            <option value="">Not used…</option>
                            <option>Duplicate</option>
                            <option>Not verified</option>
                            <option>Not newsworthy</option>
                            <option>False or abusive</option>
                          </select>
                        )}
                        {r.status === "published" && <p style={{ fontSize: 14 }}>Published as {r.publishedAs === "alert" ? "a public safety alert" : r.publishedAs === "story" ? "a news story" : "a mention on air"}.</p>}
                        {r.status === "not-used" && <p style={{ fontSize: 14 }}>Not used: {r.notUsedReason?.toLowerCase()}.</p>}
                        <h4 style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted)", marginTop: 8 }}>What the citizen sees on /track</h4>
                        <ul className="rep-hist">
                          {r.history.map((h, i) => (
                            <li key={i}>
                              <b>{isoTime(h.at)}</b> {h.publicNote}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
