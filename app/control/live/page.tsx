"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { TopBar } from "@/components/control/Shell";
import { onAir, upcomingEvents, WATCHING_NOW } from "@/lib/broadcast";
import { useActions, useDemo } from "@/lib/store";
import { fmt } from "@/lib/time";
import type { LiveState } from "@/lib/types";

export default function LiveControl() {
  const { state, now } = useDemo();
  const act = useActions();
  const toast = useToast();
  const air = onAir(state.schedule, now, state.live, 4);
  const [breaking, setBreaking] = useState("");
  const events = upcomingEvents(state.schedule, now).filter((s) => s.event);

  const opts: [LiveState, string][] = [
    ["live", "Live"],
    ["off-air", "Off air"],
    ["technical", "Technical difficulty"],
  ];

  return (
    <>
      <TopBar crumbs={["Broadcast", "Live control"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Live control</h1>
            <p>Controls the player state on TV, NPFTV Stream and the homepage at the same time.</p>
          </div>
          <Link className="btn btn-line btn-sm" href="/stream/live" target="_blank">
            <Icon name="eye" /> Watch the public player
          </Link>
        </div>
        <div className="kpis">
          <div className="pnl kpi">
            <span>
              <Icon name="radio" />
              Channel
            </span>
            <b style={{ color: air.state === "live" ? "var(--red)" : undefined }}>{air.state === "live" ? "Live" : air.state === "technical" ? "Technical" : "Off air"}</b>
            <small>{air.outsideHours ? "Outside channel hours (06:00 to 23:00)" : "Within channel hours"}</small>
          </div>
          <div className="pnl kpi">
            <span>
              <Icon name="play" />
              Now playing
            </span>
            <b>{air.current?.title ?? "Nothing"}</b>
            <small>{air.current ? `${air.current.start} to ${air.current.end}, ${air.minutesLeft} min left` : "Off air"}</small>
          </div>
          <div className="pnl kpi">
            <span>
              <Icon name="users" />
              Watching on Stream
            </span>
            <b>{air.state === "live" ? WATCHING_NOW.toLocaleString("en-GB") : "0"}</b>
            <small>Peak last night: 31,200</small>
          </div>
          <div className="pnl kpi">
            <span>
              <Icon name="cc" />
              Captions
            </span>
            <b>On</b>
            <small>Live captions with AI chapters</small>
          </div>
        </div>
        <div className="row2">
          <div className="pnl" style={{ padding: 18, display: "grid", gap: 16 }}>
            <div>
              <h3 style={{ color: "var(--indigo)", fontSize: 17, marginBottom: 10 }}>Channel state</h3>
              <div className="seg">
                {opts.map(([v, l]) => (
                  <button key={v} className={`${state.live === v ? "on" : ""}${v === "live" ? " live" : ""}`} onClick={() => act.setLive(v)}>
                    {l}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>“Off air” and “Technical difficulty” show a designed holding screen with the next programme, never a spinner.</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!breaking.trim()) return;
                act.pushBreaking(breaking.trim());
                setBreaking("");
                toast("Breaking news is at the top of the ticker");
              }}
            >
              <h3 style={{ color: "var(--indigo)", fontSize: 17, marginBottom: 10 }}>Breaking news ticker</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="inp" value={breaking} onChange={(e) => setBreaking(e.target.value)} placeholder="Short, verified headline" />
                <button className="btn btn-red btn-sm" style={{ height: 40 }}>
                  Push
                </button>
              </div>
            </form>
          </div>
          <div className="pnl">
            <div className="p-hd">
              <h3>Up next and live events</h3>
              <Link href="/control/schedule">Schedule</Link>
            </div>
            <ul className="cal">
              {[...air.next, ...events.filter((e) => !air.next.some((n) => n.id === e.id))].slice(0, 6).map((s) => (
                <li key={s.id}>
                  <div className="d">
                    <small>{fmt.weekdayShort(s.date)}</small>
                    <b>{s.start}</b>
                  </div>
                  <div>
                    <h4>{s.title}</h4>
                    <p>{s.subtitle}</p>
                    {s.event && (
                      <div className="res">
                        <span className="warn">
                          <Icon name="radio" />
                          Live event
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
