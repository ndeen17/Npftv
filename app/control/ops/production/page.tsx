"use client";

import { useState } from "react";
import { fmtNaira } from "@/data/ops";
import { Icon } from "@/components/Icon";
import { TopBar } from "@/components/control/Shell";
import { assetName, findClashes, sortedProduction, staffName, type Clash } from "@/components/control/production";
import { runAI } from "@/lib/ai";
import { useDemo } from "@/lib/store";
import { addDays, fmt } from "@/lib/time";

const PROPOSAL = {
  title: "Community Watch: Abuja market forum",
  date: "2026-11-26",
  start: "10:00",
  end: "12:30",
  crew: ["s-1", "s-16"],
  assets: ["cam-3", "drone-2"],
};

export default function ProductionPage() {
  const { state } = useDemo();
  const [busy, setBusy] = useState(false);
  const [clashes, setClashes] = useState<Clash[] | null>(null);
  const days = Array.from({ length: 9 }, (_, i) => addDays("2026-11-23", i));
  const events = sortedProduction(state.production);

  return (
    <>
      <TopBar crumbs={["Operations", "Production"]} search="Search shoots, crew, kit" />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Production calendar</h1>
            <p>Shoots, live events and the crew, studios and kit booked for each. Scheduling a live event books it here automatically.</p>
          </div>
        </div>

        <div className="pnl tbl-wrap">
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${days.length}, minmax(120px, 1fr))`, minWidth: 1080 }}>
            {days.map((d) => {
              const evs = events.filter((e) => e.date === d);
              return (
                <div key={d} style={{ borderRight: "1px solid var(--line)", minHeight: 180 }}>
                  <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--line)", background: "#faf9fc", fontSize: 13 }}>
                    <b style={{ fontFamily: "var(--slab)", fontSize: 20, color: "var(--indigo)", marginRight: 6 }}>{fmt.dayNum(d)}</b>
                    {fmt.weekdayShort(d)}
                  </div>
                  <div style={{ padding: 8, display: "grid", gap: 8 }}>
                    {evs.map((e) => (
                      <div key={e.id} style={{ borderRadius: 6, padding: 8, fontSize: 12.5, background: e.warn ? "#fff1bf" : e.id === "prod-press-briefing" ? "#dff3e7" : "#ece8f5", borderLeft: `3px solid ${e.warn ? "var(--yellow-deep)" : e.id === "prod-press-briefing" ? "var(--green)" : "var(--indigo)"}` }}>
                        <b style={{ display: "block", fontSize: 12.5 }}>
                          {e.start} {e.title}
                        </b>
                        {e.crew.length} crew{e.assets.length ? `, ${e.assets.map(assetName).join(", ")}` : ""}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="row2">
          <div className="pnl">
            <div className="p-hd">
              <h3>Bookings this week</h3>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Crew</th>
                    <th>Kit</th>
                    <th className="num">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <b style={{ fontWeight: 600 }}>{e.title}</b>
                        <small style={{ display: "block", color: "var(--muted)" }}>
                          {fmt.dayTab(e.date)}, {e.start} to {e.end}
                        </small>
                        {e.warn && (
                          <span className="res" style={{ marginTop: 4 }}>
                            <span className="warn">
                              <Icon name="alert" />
                              {e.warn}: using archive aerial footage
                            </span>
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: 13 }}>{e.crew.map(staffName).join(", ") || "None yet"}</td>
                      <td style={{ fontSize: 13 }}>{e.assets.map(assetName).join(", ") || "None"}</td>
                      <td className="num">{e.cost ? fmtNaira(e.cost) : "In budget"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pnl">
            <div className="p-hd">
              <h3>New shoot request</h3>
              <span className="tag tag-ai">
                <Icon name="spark" style={{ width: 13, height: 13 }} /> Clash check
              </span>
            </div>
            <div style={{ padding: 18, display: "grid", gap: 10, fontSize: 14 }}>
              <b style={{ fontSize: 15 }}>{PROPOSAL.title}</b>
              <span style={{ color: "var(--muted)" }}>
                {fmt.long(PROPOSAL.date)}, {PROPOSAL.start} to {PROPOSAL.end}
              </span>
              <div className="res">
                {PROPOSAL.crew.map((c) => (
                  <span key={c}>
                    <Icon name="users" />
                    {staffName(c)}
                  </span>
                ))}
                {PROPOSAL.assets.map((a) => (
                  <span key={a}>
                    <Icon name="box" />
                    {assetName(a)}
                  </span>
                ))}
              </div>
              <button
                className="btn btn-sm btn-indigo"
                style={{ justifySelf: "start" }}
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setClashes(await runAI(() => findClashes(state.production, PROPOSAL), state.aiInstant));
                  setBusy(false);
                }}
              >
                <Icon name="spark" /> {busy ? "Checking…" : "Check for clashes"}
              </button>
              {clashes &&
                (clashes.length ? (
                  clashes.map((c, i) => (
                    <div key={i} className="iss">
                      <b>
                        <Icon name="alert" />
                        {c.with === "Maintenance" ? `${c.what} is unavailable` : `${c.what} is already booked: ${c.with}`}
                      </b>
                      <p>{c.suggestion}</p>
                    </div>
                  ))
                ) : (
                  <div className="iss res">
                    <b>
                      <Icon name="check" />
                      No clashes found
                    </b>
                  </div>
                ))}
              <p className="ai-note">
                <Icon name="spark" /> Suggestions only. The production manager confirms every booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
