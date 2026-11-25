"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { DayTabs, EpgTimeline } from "@/components/stream/parts";
import { onAir } from "@/lib/broadcast";
import { useActions, useDemo } from "@/lib/store";
import { fmt, toMin } from "@/lib/time";

export default function GuidePage() {
  const { state, now } = useDemo();
  const act = useActions();
  const air = onAir(state.schedule, now, state.live);
  const [day, setDay] = useState(air.date);
  const [view, setView] = useState<"list" | "grid">("list");
  const slots = state.schedule.filter((s) => s.date === day);
  const nowM = toMin(air.nowHHMM);

  return (
    <section className="s-pad">
      <div className="epg-hd">
        <div>
          <h1 style={{ fontSize: 34 }}>Programme guide</h1>
          <p className="s-lead" style={{ marginBottom: 0 }}>All times WAT. The channel broadcasts from 06:00 to 23:00.</p>
        </div>
        <div className="filters" style={{ margin: 0 }}>
          <button className={view === "list" ? "on" : ""} onClick={() => setView("list")}>
            Day list
          </button>
          <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}>
            Timeline
          </button>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <DayTabs value={day} onChange={setDay} />
      </div>
      <h2 className="s-h2">{fmt.long(day)}</h2>

      {view === "grid" ? (
        <div style={{ display: "grid", gap: 16 }}>
          <EpgTimeline date={day} from="06:00" to="14:30" slots={state.schedule} nowHHMM={air.nowHHMM} nowDate={air.date} />
          <EpgTimeline date={day} from="14:30" to="23:00" slots={state.schedule} nowHHMM={air.nowHHMM} nowDate={air.date} />
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <ul className="epg-list">
            {slots.map((s) => {
              const past = day < air.date || (day === air.date && toMin(s.end) <= nowM);
              const isNow = day === air.date && toMin(s.start) <= nowM && nowM < toMin(s.end);
              const on = state.reminders.includes(s.id);
              return (
                <li key={s.id} className={isNow ? "now" : past ? "past" : ""}>
                  <span className="t">
                    {s.start} to {s.end}
                  </span>
                  <span>
                    <b>
                      {s.programmeId ? (
                        <Link href={`/programmes/${s.programmeId}`} style={{ textDecoration: "none" }}>
                          {s.title}
                        </Link>
                      ) : (
                        s.title
                      )}
                    </b>{" "}
                    {isNow && state.live === "live" && (
                      <span className="tag tag-live" style={{ marginLeft: 6 }}>
                        <span className="live-dot" /> On now
                      </span>
                    )}
                    {s.event && (
                      <span className="tag tag-green" style={{ marginLeft: 6 }}>
                        {s.title.startsWith("Premiere") ? "Premiere" : "Live event"}
                      </span>
                    )}
                    <small>
                      {s.subtitle}
                      {s.location ? ` · ${s.location}` : ""}
                    </small>
                  </span>
                  {isNow ? (
                    <Link className="btn btn-yellow btn-sm" href="/stream/live">
                      <Icon name="play" fill /> Watch
                    </Link>
                  ) : past ? (
                    <span />
                  ) : (
                    <button className={`icon-b${on ? " on" : ""}`} aria-label={on ? `Reminder set for ${s.title}` : `Remind me about ${s.title}`} aria-pressed={on} onClick={() => act.toggleReminder(s.id)}>
                      <Icon name={on ? "check" : "bell"} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
