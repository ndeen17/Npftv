"use client";

import Link from "next/link";
import { programmeById } from "@/data/programmes";
import { onAir, WATCHING_NOW } from "@/lib/broadcast";
import { useDemo } from "@/lib/store";
import { Icon } from "../Icon";

export function tvGraphic(title?: string) {
  if (title === "The Beat") return { tag: "THE BEAT", text: "Festive season: commands step up highway patrols" };
  return null;
}

export function LiveModule() {
  const { state, now } = useDemo();
  const air = onAir(state.schedule, now, state.live, 3);
  const cur = air.current;
  const prog = cur?.programmeId ? programmeById(cur.programmeId) : undefined;
  const g = tvGraphic(cur?.title) ?? (cur ? { tag: (prog?.title ?? "NPFTV").toUpperCase(), text: cur.subtitle } : null);
  const live = air.state === "live";

  return (
    <section className="sec live-mod">
      <div className="wrap">
        <div className="sec-hd">
          <div>
            <h2>Live on NPFTV Stream</h2>
            <p>Watch here, or open NPFTV Stream for the full guide, catch-up and every programme on demand.</p>
          </div>
          <Link className="link" href="/stream">
            Open NPFTV Stream <Icon name="arrow" />
          </Link>
        </div>
        <div className="lm-panel">
          <Link className="screen" href="/stream/live" aria-label={cur ? `Watch ${cur.title} live` : "Open NPFTV Stream"}>
            {live ? (
              <>
                <img className="still drift" src="/images/parade.webp" alt="Live broadcast: officers on parade" />
                <span className="shade" />
                <span className="s-live">
                  <span className="tag tag-live">
                    <span className="live-dot" /> LIVE
                  </span>
                </span>
                <img className="bug" src="/images/logo.webp" alt="" />
                <span className="play">
                  <Icon name="play" fill />
                </span>
                {g && (
                  <span className="g">
                    <b>{g.tag}</b>
                    <span>{g.text}</span>
                  </span>
                )}
              </>
            ) : (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  background: "radial-gradient(420px 280px at 50% 40%, rgba(91,68,176,.5), rgba(91,68,176,0) 70%), var(--indigo-deep)",
                  padding: 20,
                }}
              >
                <span style={{ display: "grid", gap: 8, justifyItems: "center" }}>
                  <img src="/images/logo.webp" alt="" style={{ width: 64, height: 64, borderRadius: "50%" }} />
                  <b className="slab" style={{ fontSize: 22 }}>
                    {air.state === "technical" ? "We're fixing a technical problem" : air.outsideHours ? "NPFTV returns at 06:00" : "We're off air for a moment"}
                  </b>
                  <span style={{ color: "#c9c0e4", fontSize: 14 }}>{air.next[0] ? `Next: ${air.next[0].title} at ${air.next[0].start}` : "Check the programme guide"}</span>
                </span>
              </span>
            )}
          </Link>
          <div className="lm-side">
            <div className="lower3">
              <div className="l3-top">
                {live ? (
                  <span className="tag tag-live">
                    <span className="live-dot" /> On air now
                  </span>
                ) : (
                  <span className="tag" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>
                    {air.state === "technical" ? "Technical difficulty" : "Off air"}
                  </span>
                )}
                {live && <span>{WATCHING_NOW.toLocaleString("en-GB")} watching</span>}
              </div>
              <div className="l3-title">
                <h3>{cur?.title ?? "Off air"}</h3>
                <span>{prog?.id === "the-beat" ? prog.short : cur?.subtitle ?? "NPFTV returns at 06:00"}</span>
              </div>
              {cur && (
                <>
                  <div className="l3-bar">
                    <i style={{ width: `${Math.round(air.progress * 100)}%` }} />
                  </div>
                  <div className="l3-meta">
                    <span>{cur.start}</span>
                    <span>{air.minutesLeft} min left</span>
                    <span>{cur.end}</span>
                  </div>
                </>
              )}
            </div>
            <ul className="lm-next">
              {air.next.map((s) => (
                <li key={s.id}>
                  <b>{s.start}</b>
                  <span>
                    {s.title}
                    <small>
                      {s.subtitle}
                      {s.date !== air.date ? " (tomorrow)" : ""}
                    </small>
                  </span>
                </li>
              ))}
            </ul>
            <div className="lm-cta">
              <Link className="btn btn-yellow" href="/stream">
                <Icon name="play" fill /> Open NPFTV Stream
              </Link>
              <small>Also at stream.npftv.net</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
