"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { captionCues, programmeById } from "@/data/programmes";
import { addDays, fmt, toHHMM, toMin } from "@/lib/time";
import { GUIDE_DAYS, WEEK_START } from "@/data/schedule";
import { catchMeUp } from "@/lib/ai";
import { aiOpts, askAI } from "@/lib/ai-client";
import { onAir } from "@/lib/broadcast";
import { useActions, useDemo } from "@/lib/store";
import type { Episode, ScheduleSlot } from "@/lib/types";
import { Icon } from "../Icon";

const THUMB_CLASS: Record<string, string> = {
  "the-beat": "t1",
  "safe-nigeria": "t2",
  "community-watch": "t3",
  "force-in-focus": "t4",
  "cyber-sense": "t3",
  "in-conversation": "t6",
  "insight-podcast": "t5",
};

export function EpisodeCard({ e }: { e: Episode }) {
  const p = programmeById(e.programmeId)!;
  return (
    <Link className="ep" href={`/stream/episode/${e.id}`}>
      <div className={`th ${THUMB_CLASS[p.id]}`}>
        {e.thumb && <img src={`/images/${e.thumb}.webp`} alt="" />}
        <h4>{p.title}</h4>
        <span className="dur">{e.duration}</span>
        {e.progress && <span className="prog-bar" style={{ width: `${e.progress * 100}%` }} />}
      </div>
      <p>
        {e.title}
        <small>
          {p.strand}, {fmt.dayMonShort(e.date)}
        </small>
      </p>
    </Link>
  );
}

export function OnNowCard() {
  const { state, now } = useDemo();
  const air = onAir(state.schedule, now, state.live);
  const cur = air.current;
  return (
    <div className="card">
      <h3>On now</h3>
      <div style={{ fontFamily: "var(--slab)", fontSize: 22, color: "#fff", marginTop: 8 }}>{air.state === "off-air" || !cur ? "Off air" : cur.title}</div>
      {cur && air.state !== "off-air" ? (
        <>
          <div className="bar">
            <i style={{ width: `${Math.round(air.progress * 100)}%` }} />
          </div>
          <div className="now-t" style={{ marginTop: 0 }}>
            <span>{cur.start}</span>
            <span>{air.minutesLeft} min left</span>
            <span>{cur.end}</span>
          </div>
        </>
      ) : (
        <p style={{ color: "#a79dc7", fontSize: 14, marginTop: 6 }}>{air.next[0] ? `Next: ${air.next[0].title} at ${air.next[0].start}` : "Returns at 06:00"}</p>
      )}
    </div>
  );
}

// Shared across the Stream home and live pages so a summary is generated once per minute of programme.
const catchUpCache = new Map<string, { time: string; text: string }[]>();

export function CatchMeUpCard() {
  const { state, now } = useDemo();
  const air = onAir(state.schedule, now, state.live);
  const [res, setRes] = useState<ReturnType<typeof catchMeUp> | null>(null);
  const [busy, setBusy] = useState(false);
  const isBeat = air.current?.title === "The Beat" && air.state === "live";

  async function run() {
    const key = `${air.date}|${air.nowHHMM}|${state.aiScripted ? "s" : "l"}`;
    const start = air.current?.start ?? "19:00";
    const minutes = toMin(air.nowHHMM) - toMin(start);
    const hit = catchUpCache.get(key);
    if (hit) {
      setRes({ bullets: hit, minutes });
      return;
    }
    setBusy(true);
    const cues = captionCues.filter((c) => toMin(c.time) >= toMin(start) && toMin(c.time) <= toMin(air.nowHHMM));
    const { data } = await askAI<{ bullets: { time: string; text: string }[] }>(
      "catch-me-up",
      { programme: "The Beat (national news)", cues },
      () => ({ bullets: catchMeUp(air.nowHHMM, start).bullets }),
      aiOpts(state),
    );
    catchUpCache.set(key, data.bullets);
    setRes({ bullets: data.bullets, minutes });
    setBusy(false);
  }

  // Generate on first view so the card is never empty in the demo.
  useEffect(() => {
    if (isBeat) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBeat, air.nowHHMM]);

  if (!isBeat) {
    return (
      <div className="card ai-card">
        <h3>
          <Icon name="spark" />
          Catch me up
        </h3>
        <p className="sub">Available during The Beat, live on weeknights at 7:00 pm. Joined late? We&apos;ll summarise what you missed from the live captions.</p>
      </div>
    );
  }

  return (
    <div className="card ai-card">
      <h3>
        <Icon name="spark" />
        Catch me up
      </h3>
      <p className="sub">Joined late? Here&apos;s what you missed in the first {res?.minutes ?? toMin(air.nowHHMM) - toMin(air.current!.start)} minutes.</p>
      <div aria-live="polite">
        {busy || !res ? (
          <div style={{ display: "grid", gap: 10 }}>
            <span className="skel" />
            <span className="skel" style={{ width: "85%" }} />
            <span className="skel" style={{ width: "70%" }} />
          </div>
        ) : (
          <ul>
            {res.bullets.map((b) => (
              <li key={b.time}>
                <span>{b.time}</span>
                {b.text}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="foot">
        <Icon name="spark" style={{ width: 14, height: 14 }} />
        Written by AI from the live captions. Check the full report for details.
      </div>
    </div>
  );
}

export function UpNextCard({ count = 3 }: { count?: number }) {
  const { state, now } = useDemo();
  const act = useActions();
  const air = onAir(state.schedule, now, state.live, count);
  return (
    <div className="card">
      <h3>Up next</h3>
      <ul className="next">
        {air.next.map((s) => {
          const on = state.reminders.includes(s.id);
          return (
            <li key={s.id}>
              <b>{s.start}</b>
              <span>
                {s.title}
                <small>
                  {s.subtitle.replace("Repeat of Sunday's edition", "Repeat: Sunday's edition")}
                  {s.date !== air.date ? ` (${fmt.weekdayShort(s.date)})` : ""}
                </small>
              </span>
              <button className={`icon-b${on ? " on" : ""}`} aria-label={on ? `Reminder set for ${s.title}` : `Remind me about ${s.title}`} aria-pressed={on} onClick={() => act.toggleReminder(s.id)}>
                <Icon name={on ? "check" : "bell"} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Programme guide timeline. `from`/`to` in HH:MM; 30-minute columns. */
export function EpgTimeline({ date, from, to, slots, nowHHMM, nowDate }: { date: string; from: string; to: string; slots: ScheduleSlot[]; nowHHMM: string; nowDate: string }) {
  const start = toMin(from);
  const end = toMin(to);
  const cols = (end - start) / 15; // 15-minute grid, 30-minute labels
  const daySlots = slots.filter((s) => s.date === date && toMin(s.end) > start && toMin(s.start) < end);
  const nowM = toMin(nowHHMM);
  const showNow = date === nowDate && nowM >= start && nowM < end;
  const labels: string[] = [];
  for (let m = start; m < end; m += 30) labels.push(toHHMM(m));

  return (
    <div className="tl-scroll">
      <div className="tl" style={{ minWidth: Math.max(900, labels.length * 110) }}>
        <div className="tl-times" style={{ gridTemplateColumns: `repeat(${labels.length}, 1fr)` }}>
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div className="tl-row" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {daySlots.map((s) => {
            const a = Math.max(toMin(s.start), start);
            const b = Math.min(toMin(s.end), end);
            const past = date < nowDate || (date === nowDate && toMin(s.end) <= nowM);
            const isNow = date === nowDate && toMin(s.start) <= nowM && nowM < toMin(s.end);
            const href = s.programmeId ? `/programmes/${s.programmeId}` : undefined;
            const cls = `slot${past ? " past" : ""}${isNow ? " now" : ""}${s.event ? " ev" : ""}${s.id === "evt-press-briefing" ? " fresh" : ""}`;
            const inner = (
              <>
                <b>{s.title}</b>
                <small>
                  {isNow && s.live ? "Live" : s.subtitle}
                  {s.event && !isNow ? " · Live event" : ""}
                </small>
              </>
            );
            return href ? (
              <Link key={s.id} href={href} className={cls} style={{ gridColumn: `${(a - start) / 15 + 1} / span ${(b - a) / 15}` }} title={`${s.start} to ${s.end}: ${s.title}`}>
                {inner}
              </Link>
            ) : (
              <div key={s.id} className={cls} style={{ gridColumn: `${(a - start) / 15 + 1} / span ${(b - a) / 15}` }} title={`${s.start} to ${s.end}: ${s.title}`}>
                {inner}
              </div>
            );
          })}
        </div>
        {showNow && (
          <div className="nowline" style={{ left: `calc(10px + (100% - 20px) * ${(nowM - start) / (end - start)})` }}>
            <span>Now {nowHHMM}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function DayTabs({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const { now } = useDemo();
  const today = onAir([], now, "live").date;
  const days = Array.from({ length: GUIDE_DAYS }, (_, i) => addDays(WEEK_START, i));
  return (
    <div className="days" role="tablist" aria-label="Day">
      {days.map((d) => (
        <button key={d} role="tab" aria-selected={d === value} className={d === value ? "on" : ""} onClick={() => onChange(d)}>
          {d === today ? `Today, ${fmt.dayTab(d)}` : fmt.dayTab(d)}
        </button>
      ))}
    </div>
  );
}
