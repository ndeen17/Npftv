"use client";

import { useRef, useState } from "react";
import { captionAt } from "@/lib/ai";
import { onAir, WATCHING_NOW } from "@/lib/broadcast";
import { useDemo } from "@/lib/store";
import { Icon } from "../Icon";
import { tvGraphic } from "../site/LiveModule";

function useFullscreen() {
  const ref = useRef<HTMLDivElement>(null);
  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.().catch(() => {});
  };
  return { ref, toggle };
}

/** The live channel player: live, off-air and technical-difficulty states. */
export function LivePlayer() {
  const { state, now } = useDemo();
  const air = onAir(state.schedule, now, state.live, 2);
  const [cc, setCc] = useState(true);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const { ref, toggle } = useFullscreen();
  const cur = air.current;
  const g = tvGraphic(cur?.title) ?? (cur ? { tag: cur.title.toUpperCase(), text: cur.subtitle } : null);
  const nextUp = air.next[0];

  if (air.state !== "live") {
    const tech = air.state === "technical";
    return (
      <div className="player" ref={ref}>
        {tech ? (
          <div className="hold tech">
            <div className="box">
              <img src="/images/logo.webp" alt="" />
              <h2>We&apos;re fixing a technical problem</h2>
              <p>The broadcast will be back shortly. You don&apos;t need to refresh the page.</p>
            </div>
          </div>
        ) : (
          <div className="hold">
            <img src="/images/logo.webp" alt="" />
            <h2>{air.outsideHours ? "NPFTV returns at 06:00" : "We're off air for a moment"}</h2>
            <p>{air.outsideHours ? "The channel broadcasts from 06:00 to 23:00 WAT. Catch up on any programme on demand." : "The broadcast will resume shortly. Catch up on demand in the meantime."}</p>
            {nextUp && (
              <div className="nx">
                Up next, {nextUp.date === air.date ? "today" : "tomorrow"} at {nextUp.start}
                <b>{nextUp.title}</b>
                {nextUp.subtitle}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="player" ref={ref}>
      <div className="still-wrap">
        <img className="still drift" src="/images/parade.webp" alt="Live broadcast still: officers on parade" style={paused ? { animationPlayState: "paused" } : undefined} />
      </div>
      <div className="p-shade" />
      <div className="p-live">
        <span className="tag tag-live">
          <span className="live-dot" /> LIVE
        </span>
        <span className="cnt">{WATCHING_NOW.toLocaleString("en-GB")} watching</span>
      </div>
      <img className="p-bug" src="/images/logo.webp" alt="" />
      {g && (
        <div className="tvg">
          <div className="tvg-tag">{g.tag}</div>
          <div className="tvg-txt">
            <b>{g.text}</b>
            <small>Reporting from Abuja</small>
          </div>
        </div>
      )}
      {cc && cur?.title === "The Beat" && (
        <div className="cap" aria-live="polite">
          {captionAt(air.nowHHMM)}
        </div>
      )}
      {paused && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <button onClick={() => setPaused(false)} aria-label="Play" style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--yellow)", color: "var(--indigo)", border: 0, display: "grid", placeItems: "center", boxShadow: "0 0 0 8px rgba(245,197,24,.25)" }}>
            <Icon name="play" fill style={{ width: 30, height: 30, marginLeft: 4 }} />
          </button>
        </div>
      )}
      <div className="ctrl">
        <button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play" : "Pause"}>
          <Icon name={paused ? "play" : "pause"} fill />
        </button>
        <button onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} style={{ opacity: muted ? 0.5 : 1 }}>
          <Icon name="volume" />
        </button>
        <span className="lv">
          <span className="live-dot" />
          LIVE
        </span>
        <span className="grow">
          <i />
        </span>
        <button onClick={() => setCc((c) => !c)} aria-label="Captions" aria-pressed={cc}>
          <Icon name="cc" className={cc ? "on" : ""} />
        </button>
        <span className="qual">Auto 720p</span>
        <button onClick={toggle} aria-label="Full screen">
          <Icon name="expand" />
        </button>
      </div>
    </div>
  );
}

/** On-demand player (episode page). Uses typographic art or an approved still. */
export function VodPlayer({ title, prog, thumb, duration, seek }: { title: string; prog: string; thumb?: "eod" | "parade"; duration: string; seek: number }) {
  const [playing, setPlaying] = useState(false);
  const { ref, toggle } = useFullscreen();
  const [cc, setCc] = useState(true);
  return (
    <div className="player" ref={ref}>
      {thumb ? (
        <div className="still-wrap">
          <img className={`still${playing ? " drift" : ""}`} src={`/images/${thumb}.webp`} alt="" />
        </div>
      ) : (
        <div className="still-wrap" style={{ background: "radial-gradient(500px 300px at 70% 40%, rgba(91,68,176,.5), rgba(91,68,176,0) 70%), var(--indigo)", display: "grid", placeItems: "center" }}>
          <span style={{ fontFamily: "var(--slab)", fontWeight: 700, fontSize: "clamp(28px, 6vw, 64px)", color: "#fff", textAlign: "center", padding: 20 }}>
            {prog}
            <small style={{ display: "block", fontSize: "0.4em", color: "var(--yellow)", fontWeight: 600 }}>{title}</small>
          </span>
        </div>
      )}
      <div className="p-shade" />
      <img className="p-bug" src="/images/logo.webp" alt="" />
      {!playing && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <button onClick={() => setPlaying(true)} aria-label="Play" style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--yellow)", color: "var(--indigo)", border: 0, display: "grid", placeItems: "center", boxShadow: "0 0 0 8px rgba(245,197,24,.25)" }}>
            <Icon name="play" fill style={{ width: 30, height: 30, marginLeft: 4 }} />
          </button>
        </div>
      )}
      {playing && cc && <div className="cap">Demo playback: video files aren&apos;t included in the prototype.</div>}
      <div className="ctrl">
        <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
          <Icon name={playing ? "pause" : "play"} fill />
        </button>
        <Icon name="volume" />
        <span className="time">
          {seek > 0 ? `${Math.floor((seek * parseInt(duration)) )}:00` : "0:00"} / {duration}
        </span>
        <span className="grow">
          <i className="vod" style={{ width: `${seek * 100}%` }} />
        </span>
        <button onClick={() => setCc((c) => !c)} aria-label="Captions" aria-pressed={cc}>
          <Icon name="cc" className={cc ? "on" : ""} />
        </button>
        <button onClick={toggle} aria-label="Full screen">
          <Icon name="expand" />
        </button>
      </div>
    </div>
  );
}
