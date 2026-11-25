"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { preparedAlert } from "@/data/public";
import { aiStatus, type AiStatus } from "@/lib/ai-client";
import { useActions, useDemo } from "@/lib/store";
import { watParts } from "@/lib/time";
import type { LiveState } from "@/lib/types";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

const SCRIPT = [
  { n: 1, t: "Citizen on the homepage", href: "/" },
  { n: 2, t: "Open NPFTV Stream, Catch me up", href: "/stream/live" },
  { n: 3, t: "Scam checker (BVN SMS)", href: "/public-safety#scam-checker" },
  { n: 4, t: "Reporter submits the Kano story", href: "/control?as=reporter" },
  { n: 5, t: "Editor-in-Chief: AI copy desk, approve", href: "/control?as=editor-in-chief" },
  { n: 6, t: "Broadcast Manager schedules the briefing", href: "/control?as=broadcast-manager" },
  { n: 7, t: "Network Director: ERP and daily brief", href: "/control?as=network-director" },
  { n: 8, t: "Close on the audit log", href: "/control/audit" },
];

export function PresenterPanel() {
  const [open, setOpen] = useState(false);
  const { state, reset, now } = useDemo();
  const act = useActions();
  const toast = useToast();
  const [breaking, setBreaking] = useState("Breaking: Major road closed after accident near Abuja, use alternative routes");
  const parts = watParts(now);
  const [date, setDate] = useState(parts.date);
  const [time, setTime] = useState(parts.hhmm);
  const [status, setStatus] = useState<AiStatus | null | undefined>(undefined);

  useEffect(() => {
    if (open) aiStatus().then(setStatus);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.shiftKey && (e.key === "P" || e.key === "p")) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setDate(parts.date);
    setTime(parts.hhmm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.clock.iso, state.clock.pinned]);

  if (!open) {
    return <button className="pp-fab" aria-label="Open presenter panel (Shift + P)" title="Presenter panel (Shift + P)" onClick={() => setOpen(true)} />;
  }

  const liveOpts: [LiveState, string][] = [
    ["live", "Live"],
    ["off-air", "Off air"],
    ["technical", "Technical"],
  ];
  const alertLive = state.activeAlerts.some((a) => a.id === preparedAlert.id);

  return (
    <aside className="pp" aria-label="Presenter panel">
      <div className="pp-hd">
        <Icon name="gear" style={{ color: "var(--yellow)" }} />
        <b>Presenter panel</b>
        <kbd>Shift + P</kbd>
        <button className="ibtn" style={{ color: "#cfc6ea", background: "none", border: 0 }} onClick={() => setOpen(false)} aria-label="Close presenter panel">
          <Icon name="x" />
        </button>
      </div>

      <div className="pp-sec">
        <b>Channel state</b>
        <div className="pp-seg">
          {liveOpts.map(([v, l]) => (
            <button key={v} className={state.live === v ? "on" : ""} onClick={() => act.setLive(v)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="pp-sec">
        <div className="pp-toggle">
          <span>
            <b style={{ color: "#fff", fontWeight: 600 }}>Demo clock</b>
            <br />
            <small>
              {state.clock.pinned ? "Pinned" : "Following real WAT"}: {parts.hhmm} WAT, {parts.date}
            </small>
          </span>
          <button className="pp-switch" role="switch" aria-checked={state.clock.pinned} aria-label="Pin the demo clock" onClick={() => act.setClock(!state.clock.pinned, now.toISOString())} />
        </div>
        <div className="pp-row" style={{ marginTop: 10 }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Demo date" />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Demo time" style={{ width: 110 }} />
          <button className="btn btn-yellow" onClick={() => act.setClockWat(date, time)}>
            Set
          </button>
        </div>
        <div className="pp-row" style={{ marginTop: 8, flexWrap: "wrap" }}>
          <button className="btn btn-dark" onClick={() => act.setClockWat("2026-11-23", "19:12")}>
            Mon 19:12
          </button>
          <button className="btn btn-dark" onClick={() => act.setClockWat("2026-11-26", "11:20")}>
            Thu 11:20
          </button>
          <button className="btn btn-dark" onClick={() => act.setClockWat("2026-11-23", "23:30")}>
            23:30 (off air)
          </button>
        </div>
      </div>

      <div className="pp-sec">
        <b>Breaking news</b>
        <input type="text" value={breaking} onChange={(e) => setBreaking(e.target.value)} aria-label="Breaking news headline" />
        <div className="pp-row" style={{ marginTop: 8 }}>
          <button
            className="btn btn-red"
            onClick={() => {
              act.pushBreaking(breaking);
              toast("Breaking news pushed to the ticker");
            }}
          >
            Push to ticker
          </button>
        </div>
      </div>

      <div className="pp-sec">
        <b>Public safety alert</b>
        <small>{preparedAlert.title}. Verified by Lagos command, expires {preparedAlert.expires}.</small>
        <div className="pp-row" style={{ marginTop: 8 }}>
          {alertLive ? (
            <button className="btn btn-dark" onClick={() => act.withdrawAlert(preparedAlert.id, preparedAlert.title)}>
              Withdraw alert
            </button>
          ) : (
            <button
              className="btn btn-yellow"
              onClick={() => {
                act.publishAlert(preparedAlert);
                toast("Alert is live in the alert bar");
              }}
            >
              Push alert
            </button>
          )}
        </div>
      </div>

      <div className="pp-sec">
        <b>AI</b>
        <p style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, marginBottom: 10 }}>
          <span className="dot" style={{ width: 9, height: 9, borderRadius: "50%", background: status === undefined ? "#8f86ad" : status?.configured ? "var(--green-2)" : "var(--yellow-deep)", flex: "none" }} />
          {status === undefined ? "Checking the AI service…" : status?.configured ? `Live AI connected (${status.model})` : "No OpenAI key on this deployment: scripted answers"}
        </p>
        <div className="pp-toggle">
          <span>
            <b style={{ color: "#fff", fontWeight: 600 }}>Scripted AI only</b>
            <br />
            <small>Safety net: pre-written answers instead of the live model. The demo-script inputs always use their reviewed answers.</small>
          </span>
          <button className="pp-switch" role="switch" aria-checked={!!state.aiScripted} aria-label="Scripted AI only" onClick={() => act.setAiScripted(!state.aiScripted)} />
        </div>
        <div className="pp-toggle" style={{ marginTop: 10 }}>
          <span>
            <b style={{ color: "#fff", fontWeight: 600 }}>Instant scripted answers</b>
            <br />
            <small>Off = a short, realistic “Checking…” pause for scripted answers.</small>
          </span>
          <button className="pp-switch" role="switch" aria-checked={state.aiInstant} aria-label="Instant scripted answers" onClick={() => act.setAiInstant(!state.aiInstant)} />
        </div>
      </div>

      <div className="pp-sec">
        <b>Demo script</b>
        <ol style={{ listStyle: "none", display: "grid", gap: 4 }}>
          {SCRIPT.map((s) => (
            <li key={s.n}>
              <Link href={s.href} style={{ display: "flex", gap: 8, padding: "3px 0" }} onClick={() => setOpen(false)}>
                <span style={{ color: "var(--yellow)", fontWeight: 700, width: 16 }}>{s.n}</span>
                <span>{s.t}</span>
              </Link>
            </li>
          ))}
        </ol>
        <small style={{ display: "block", marginTop: 8 }}>Tip: run the Control Room and the public site in two tabs side by side. Changes sync instantly.</small>
      </div>

      <div className="pp-sec" style={{ borderBottom: 0 }}>
        <button
          className="btn btn-ghost"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => {
            if (confirm("Reset the demo? Every change (published stories, schedule, approvals, audit log) goes back to the starting data, in every open tab.")) {
              reset();
              toast("Demo reset to the starting data");
            }
          }}
        >
          <Icon name="refresh" /> Reset demo
        </button>
      </div>
    </aside>
  );
}
