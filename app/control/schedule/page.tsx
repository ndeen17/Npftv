"use client";

import Link from "next/link";
import { useState } from "react";
import { pressBriefingProduction, staff } from "@/data/ops";
import { pressBriefingTemplate } from "@/data/schedule";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { TopBar } from "@/components/control/Shell";
import { DayTabs, EpgTimeline } from "@/components/stream/parts";
import { onAir } from "@/lib/broadcast";
import { useActions, useDemo } from "@/lib/store";
import { fmt } from "@/lib/time";

export default function SchedulePage() {
  const { state, now } = useDemo();
  const act = useActions();
  const toast = useToast();
  const air = onAir(state.schedule, now, state.live);
  const scheduled = state.schedule.some((s) => s.id === "evt-press-briefing");
  const [day, setDay] = useState(scheduled ? pressBriefingTemplate.date : air.date);
  const [form, setForm] = useState({ ...pressBriefingTemplate, stream: true, tv: true, crew: true });
  const crewNames = pressBriefingProduction.crew.map((id) => staff.find((s) => s.id === id)?.name).join(", ");

  return (
    <>
      <TopBar crumbs={["Broadcast", "Schedule"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Schedule</h1>
            <p>One schedule feeds TV, NPFTV Stream and the website. Changes appear in the public programme guide at once.</p>
          </div>
          <Link className="btn btn-line btn-sm" href="/stream/guide" target="_blank">
            <Icon name="eye" /> Public guide
          </Link>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="pnl" style={{ padding: 18, background: "#0f0720", borderColor: "#0f0720" }}>
            <div className="strm" style={{ minHeight: 0, background: "transparent" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <h2 style={{ fontSize: 20, color: "#fff" }}>{fmt.long(day)}</h2>
              </div>
              <div style={{ marginBottom: 12 }}>
                <DayTabs value={day} onChange={setDay} />
              </div>
              <EpgTimeline date={day} from="06:00" to="14:30" slots={state.schedule} nowHHMM={air.nowHHMM} nowDate={air.date} />
              <div style={{ height: 10 }} />
              <EpgTimeline date={day} from="14:30" to="23:00" slots={state.schedule} nowHHMM={air.nowHHMM} nowDate={air.date} />
            </div>
          </div>

          <div className="pnl">
            <div className="p-hd">
              <h3>Schedule a live event</h3>
              <span className="tag tag-feat">Live event</span>
            </div>
            {scheduled ? (
              <div style={{ padding: 18, display: "grid", gap: 12 }}>
                <div className="iss res">
                  <b>
                    <Icon name="check" />
                    Scheduled: {pressBriefingTemplate.title}
                  </b>
                  <p>Thursday 26 November, 11:00 to 12:00 WAT. Now in the programme guide on TV, Stream and npftv.net.</p>
                </div>
                <h4 style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: "var(--muted)" }}>Created automatically in Operations</h4>
                <div className="res">
                  <span>
                    <Icon name="calendar" />
                    EPG entry and live stream slot
                  </span>
                  <span>
                    <Icon name="users" />4 crew
                  </span>
                  <span>
                    <Icon name="truck" />
                    OB Van 1
                  </span>
                  <span>
                    <Icon name="box" />
                    Camera kits 3 and 7
                  </span>
                  <span>
                    <Icon name="wallet" />
                    ₦1.85m, broadcast operations
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)" }}>Crew: {crewNames}.</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Link className="btn btn-sm btn-indigo" href="/control/ops/production">
                    <Icon name="truck" /> Production calendar
                  </Link>
                  <Link className="btn btn-sm btn-line" href="/stream/guide" target="_blank">
                    See it in the guide
                  </Link>
                </div>
              </div>
            ) : (
              <form
                style={{ padding: 18, display: "grid", gap: 12 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  act.schedulePressBriefing();
                  setDay(pressBriefingTemplate.date);
                  toast("Scheduled. Crew, OB Van 1 and cameras booked in Operations.");
                }}
              >
                <label className="lbl-f">
                  Title
                  <input className="inp" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="lbl-f">
                    Date
                    <input className="inp" type="date" value={form.date} readOnly />
                  </label>
                  <label className="lbl-f">
                    Start
                    <input className="inp" type="time" value={form.start} readOnly />
                  </label>
                  <label className="lbl-f">
                    End
                    <input className="inp" type="time" value={form.end} readOnly />
                  </label>
                </div>
                <label className="lbl-f">
                  Location
                  <input className="inp" value={form.location} readOnly />
                </label>
                <div style={{ display: "grid", gap: 6, fontSize: 14 }}>
                  {(
                    [
                      ["tv", "Broadcast live on TV"],
                      ["stream", "Stream live on NPFTV Stream"],
                      ["crew", "Book crew and an outside broadcast van"],
                    ] as const
                  ).map(([k, l]) => (
                    <label key={k} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input type="checkbox" checked={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.checked })} />
                      {l}
                    </label>
                  ))}
                </div>
                <div className="iss" style={{ borderColor: "#f0deaa", background: "#fffcf0" }}>
                  <b>
                    <Icon name="spark" style={{ color: "var(--yellow-deep)" }} />
                    Suggested booking
                  </b>
                  <p>4 crew, OB Van 1 and camera kits 3 and 7 are free on Thursday morning. Estimated cost ₦1.85m, inside the broadcast operations budget.</p>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--muted)" }}>Replaces 11:00 to 12:00 of “Daytime on NPFTV” on Thursday.</p>
                <button className="btn btn-indigo" style={{ justifyContent: "center" }}>
                  <Icon name="calendar" /> Schedule and book
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
