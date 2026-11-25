"use client";

import Link from "next/link";
import { useState } from "react";
import { states } from "@/data/places";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { TopBar } from "@/components/control/Shell";
import { useActions, useDemo } from "@/lib/store";
import type { Alert } from "@/lib/types";

const APPROVERS = ["editor-in-chief", "network-director", "super-admin"];

export default function AlertsPage() {
  const { state, role } = useDemo();
  const act = useActions();
  const toast = useToast();
  const [form, setForm] = useState({ title: "", body: "", state: "", level: "info" as Alert["level"] });
  const canApprove = !!role && APPROVERS.includes(role);

  return (
    <>
      <TopBar crumbs={["Newsroom", "Safety alerts"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Public safety alerts</h1>
            <p>Alerts appear in the alert bar on every page of npftv.net. Every alert needs approval before it goes live.</p>
          </div>
        </div>
        <div className="row2">
          <div style={{ display: "grid", gap: 20 }}>
            <div className="pnl">
              <div className="p-hd">
                <h3>Waiting for approval ({state.draftAlerts.length})</h3>
              </div>
              {state.draftAlerts.length === 0 && <div className="empty">No alerts waiting.</div>}
              {state.draftAlerts.map((a) => (
                <div key={a.id} className="rowlink">
                  <div>
                    <h4>
                      {a.title} {a.level === "urgent" && <span className="tag tag-red">Urgent</span>}
                    </h4>
                    <p>{a.body}</p>
                    {a.reportRefs && a.reportRefs.length > 0 && (
                      <p>
                        <Icon name="inbox" style={{ width: 13, height: 13, display: "inline", verticalAlign: -2 }} /> Based on {a.reportRefs.length} citizen report{a.reportRefs.length === 1 ? "" : "s"}. They show as published once this alert goes live.
                      </p>
                    )}
                    {a.verifiedBy && (
                      <p>
                        <Icon name="check" style={{ width: 13, height: 13, display: "inline", color: "var(--green)" }} /> Verified by {a.verifiedBy} · expires {a.expires}
                      </p>
                    )}
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    <button
                      className="mini pri"
                      disabled={!canApprove}
                      title={canApprove ? undefined : "Needs the Editor-in-Chief or Network Director"}
                      onClick={() => {
                        act.publishAlert(a);
                        toast("Alert published to the alert bar on npftv.net");
                      }}
                    >
                      Approve and publish
                    </button>
                  </div>
                </div>
              ))}
              {!canApprove && state.draftAlerts.length > 0 && <p style={{ padding: "0 18px 14px", fontSize: 12.5, color: "var(--muted)" }}>Approval needs the Editor-in-Chief or the Network Director.</p>}
            </div>
            <div className="pnl">
              <div className="p-hd">
                <h3>Live now</h3>
                <Link href="/safety#alerts" target="_blank">
                  View on npftv.net
                </Link>
              </div>
              <div className="rowlink">
                <div>
                  <h4>{state.alertBar.title}</h4>
                  <p>{state.alertBar.body}</p>
                </div>
                {state.activeAlerts.some((x) => x.id === state.alertBar.id) ? (
                  <button className="mini danger" onClick={() => act.withdrawAlert(state.alertBar.id, state.alertBar.title)}>
                    Withdraw
                  </button>
                ) : (
                  <span className="tag tag-soft">Standing advice</span>
                )}
              </div>
            </div>
          </div>
          <form
            className="pnl"
            style={{ padding: 18, display: "grid", gap: 12 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.title.trim() || !form.body.trim()) return;
              act.saveDraftAlert({ id: `alert-${Date.now()}`, title: form.title.trim(), body: form.body.trim(), level: form.level, state: form.state || undefined, verifiedBy: form.state ? `${states.find((s) => s.id === form.state)?.name} command` : "Force Headquarters", expires: "in 7 days" });
              setForm({ title: "", body: "", state: "", level: "info" });
              toast("Draft alert sent for approval");
            }}
          >
            <h3 style={{ color: "var(--indigo)", fontSize: 17 }}>Draft a new alert</h3>
            <label className="lbl-f">
              Title
              <input className="inp" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Road closure, Abuja" />
            </label>
            <label className="lbl-f">
              Message
              <textarea className="inp" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} maxLength={240} placeholder="Plain words. What happened, where, and what people should do." />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="lbl-f">
                State
                <select className="inp" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                  <option value="">National</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="lbl-f">
                Level
                <select className="inp" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as Alert["level"] })}>
                  <option value="info">Advice</option>
                  <option value="urgent">Urgent</option>
                </select>
              </label>
            </div>
            <p className="ai-note">
              <Icon name="spark" /> Translations into Hausa and Pidgin are drafted by AI and must be checked by a fluent speaker before an official alert goes out.
            </p>
            <button className="btn btn-indigo btn-sm" style={{ justifySelf: "start" }}>
              Send for approval
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
