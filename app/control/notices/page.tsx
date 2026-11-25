"use client";

import Link from "next/link";
import { useState } from "react";
import { commandName, type Notice, type NoticeKind } from "@/data/notices";
import { stateById, states } from "@/data/places";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { TopBar } from "@/components/control/Shell";
import { useActions, useDemo } from "@/lib/store";
import { fmt } from "@/lib/time";

const APPROVERS = ["editor-in-chief", "network-director", "super-admin"];
const TABS = [
  { id: "pending", label: "Waiting for approval" },
  { id: "published", label: "Published" },
  { id: "closed", label: "Found or withdrawn" },
] as const;

const EMPTY = {
  kind: "missing" as NoticeKind,
  name: "",
  alias: "",
  age: "",
  sex: "Male" as Notice["sex"],
  state: "LA",
  lastSeenPlace: "",
  lastSeenDate: "",
  height: "",
  build: "",
  clothing: "",
  description: "",
  offence: "",
  caseRef: "",
};

export default function NoticesDesk() {
  const { state, role } = useDemo();
  const act = useActions();
  const toast = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("pending");
  const [form, setForm] = useState(EMPTY);
  const [open, setOpen] = useState(false);
  const canApprove = !!role && APPROVERS.includes(role);
  const count = (t: (typeof TABS)[number]["id"]) => state.notices.filter((n) => (t === "closed" ? n.status === "found" || n.status === "withdrawn" : n.status === t)).length;
  const list = state.notices.filter((n) => (tab === "closed" ? n.status === "found" || n.status === "withdrawn" : n.status === tab));
  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.name.trim().length > 2 && Number(form.age) > 0 && form.lastSeenPlace.trim() && form.lastSeenDate && form.description.trim().length > 10 && (form.kind === "missing" || form.offence.trim());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const st = stateById(form.state)!;
    act.createNotice({
      kind: form.kind,
      name: form.name.trim(),
      alias: form.alias.trim() || undefined,
      age: Number(form.age),
      sex: form.sex,
      state: form.state,
      lastSeenPlace: form.lastSeenPlace.trim(),
      lastSeenDate: form.lastSeenDate,
      height: form.height.trim() || undefined,
      build: form.build.trim() || undefined,
      clothing: form.clothing.trim() || undefined,
      description: form.description.trim(),
      offence: form.kind === "wanted" ? form.offence.trim() : undefined,
      caseRef: form.kind === "wanted" ? form.caseRef.trim() || undefined : undefined,
      issuedBy: commandName(st.id, st.name),
    });
    setForm(EMPTY);
    setOpen(false);
    setTab("pending");
    toast("Notice saved. It's waiting for approval.");
  }

  return (
    <>
      <TopBar crumbs={["Citizen reporting", "Notices"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Missing and wanted notices</h1>
            <p>Notices issued by police commands and published by NPFTV. Every notice needs approval by the Editor-in-Chief or the Network Director.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="btn btn-line btn-sm" href="/safety/missing" target="_blank">
              <Icon name="eye" /> Public pages
            </Link>
            <button className="btn btn-indigo btn-sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
              <Icon name="plus" /> New notice
            </button>
          </div>
        </div>

        {open && (
          <form className="pnl" style={{ padding: 20, display: "grid", gap: 14 }} onSubmit={submit}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <h3 style={{ color: "var(--indigo)", fontSize: 19 }}>Enter a notice from a police command</h3>
              <div className="seg">
                {(["missing", "wanted"] as const).map((k) => (
                  <button key={k} type="button" className={form.kind === k ? "on" : ""} onClick={() => set("kind", k)}>
                    {k === "missing" ? "Missing person" : "Wanted person"}
                  </button>
                ))}
              </div>
            </div>
            <p className="ai-note" style={{ fontSize: 13 }}>
              <Icon name="info" /> Only enter notices officially issued by a police command. Never add photos of people in the demo. {form.kind === "wanted" && "Wanted notices must name the offence and come with a case reference."}
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <label className="lbl-f md:col-span-2">
                Full name
                <input className="inp" value={form.name} onChange={(e) => set("name", e.target.value)} required />
              </label>
              {form.kind === "wanted" && (
                <label className="lbl-f">
                  Alias
                  <input className="inp" value={form.alias} onChange={(e) => set("alias", e.target.value)} />
                </label>
              )}
              <label className="lbl-f">
                Age
                <input className="inp" type="number" min={1} max={110} value={form.age} onChange={(e) => set("age", e.target.value)} required />
              </label>
              <label className="lbl-f">
                Sex
                <select className="inp" value={form.sex} onChange={(e) => set("sex", e.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </label>
              <label className="lbl-f">
                Issuing command
                <select className="inp" value={form.state} onChange={(e) => set("state", e.target.value)}>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id === "FC" ? "FCT" : s.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="lbl-f md:col-span-2">
                {form.kind === "missing" ? "Last seen at" : "Last known area"}
                <input className="inp" value={form.lastSeenPlace} onChange={(e) => set("lastSeenPlace", e.target.value)} placeholder="Place, area, city" required />
              </label>
              <label className="lbl-f">
                {form.kind === "missing" ? "Last seen on" : "Last seen on"}
                <input className="inp" type="date" value={form.lastSeenDate} onChange={(e) => set("lastSeenDate", e.target.value)} required />
              </label>
              <label className="lbl-f">
                Height
                <input className="inp" value={form.height} onChange={(e) => set("height", e.target.value)} placeholder="e.g. About 5 ft 8 in" />
              </label>
              <label className="lbl-f md:col-span-2">
                Build and features
                <input className="inp" value={form.build} onChange={(e) => set("build", e.target.value)} />
              </label>
              {form.kind === "missing" ? (
                <label className="lbl-f md:col-span-2">
                  Wearing
                  <input className="inp" value={form.clothing} onChange={(e) => set("clothing", e.target.value)} />
                </label>
              ) : (
                <>
                  <label className="lbl-f">
                    Wanted for
                    <input className="inp" value={form.offence} onChange={(e) => set("offence", e.target.value)} required />
                  </label>
                  <label className="lbl-f">
                    Case reference
                    <input className="inp" value={form.caseRef} onChange={(e) => set("caseRef", e.target.value)} />
                  </label>
                </>
              )}
              <label className="lbl-f md:col-span-4">
                Notice text
                <textarea className="inp" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="As issued by the command. Plain, factual, no speculation." required />
              </label>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-indigo btn-sm" disabled={!valid}>
                Send for approval
              </button>
              <button type="button" className="btn btn-line btn-sm" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="seg" role="tablist" style={{ justifySelf: "start" }}>
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
              {t.label} ({count(t.id)})
            </button>
          ))}
        </div>

        <div className="pnl">
          {list.length === 0 && <div className="empty">Nothing here.</div>}
          {list.map((n) => (
            <div key={n.id} className="rowlink" style={{ gridTemplateColumns: "minmax(0,1fr) auto" }}>
              <div>
                <h4 style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span className={`tag ${n.kind === "wanted" ? "tag-red" : "tag-feat"}`}>{n.kind === "wanted" ? "Wanted" : "Missing"}</span>
                  {n.name}
                  {n.alias && <span style={{ color: "var(--muted)", fontWeight: 400 }}>&ldquo;{n.alias}&rdquo;</span>}
                  {n.status === "found" && <span className="tag tag-green">Found safe</span>}
                  {n.status === "withdrawn" && <span className="tag tag-soft">Withdrawn</span>}
                </h4>
                <p>
                  {n.age}, {n.sex.toLowerCase()} · {n.kind === "wanted" ? `Wanted for ${n.offence?.toLowerCase()}` : `Last seen ${n.lastSeenPlace}, ${fmt.dayMonShort(n.lastSeenDate)}`}
                </p>
                <p>
                  Issued by {n.issuedBy} · {fmt.dayMonShort(n.issuedOn)}
                  {n.alertId ? " · Linked to a public safety alert" : ""}
                </p>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {n.status === "pending" && (
                  <button
                    className="mini pri"
                    disabled={!canApprove}
                    title={canApprove ? undefined : "Needs the Editor-in-Chief or Network Director"}
                    onClick={() => {
                      act.publishNotice(n.id, n.name);
                      toast(n.alertId ? "Published, with its alert in the alert bar" : "Notice published on npftv.net");
                    }}
                  >
                    Approve and publish
                  </button>
                )}
                {n.status === "published" && (
                  <>
                    <Link className="mini" href={`/safety/${n.kind}/${n.id}`} target="_blank">
                      <Icon name="eye" /> View
                    </Link>
                    {n.kind === "missing" && (
                      <button className="mini ok" onClick={() => act.markFound(n.id, n.name)}>
                        <Icon name="check" /> Mark found safe
                      </button>
                    )}
                    <button className="mini danger" onClick={() => act.withdrawNotice(n.id, n.name)}>
                      Withdraw
                    </button>
                  </>
                )}
                {(n.status === "found" || n.status === "withdrawn") && n.closedOn && <span style={{ fontSize: 13, color: "var(--muted)" }}>Closed {fmt.dayMonShort(n.closedOn)}</span>}
              </div>
            </div>
          ))}
        </div>
        {!canApprove && tab === "pending" && count("pending") > 0 && <p style={{ fontSize: 13, color: "var(--muted)" }}>Approval needs the Editor-in-Chief or the Network Director. You can switch roles from the sidebar.</p>}
      </div>
    </>
  );
}
