"use client";

import Link from "next/link";
import { episodes, latestOnDemandIds, episodeById, programmes } from "@/data/programmes";
import { Icon } from "@/components/Icon";
import { Poster } from "@/components/site/bits";
import { LivePlayer } from "@/components/stream/Player";
import { CatchMeUpCard, EpisodeCard, OnNowCard, UpNextCard } from "@/components/stream/parts";
import { onAir, upcomingEvents } from "@/lib/broadcast";
import { useActions, useDemo } from "@/lib/store";
import { fmt } from "@/lib/time";

export default function StreamHome() {
  const { state, now } = useDemo();
  const act = useActions();
  const air = onAir(state.schedule, now, state.live);
  const events = upcomingEvents(state.schedule, now).filter((s) => s.event);
  const podcasts = episodes.filter((e) => e.programmeId === "insight-podcast");
  const continueWatching = episodes.filter((e) => e.progress);

  return (
    <>
      <div className="theatre">
      <div className="s-main">
        <div>
          <LivePlayer />
          <div className="p-below">
            <div>
              <span className="tag tag-live" style={{ visibility: air.state === "live" ? "visible" : "hidden" }}>
                <span className="live-dot" /> On air now
              </span>
              <h1 style={{ marginTop: 8 }}>{air.current && air.state !== "off-air" ? air.current.title : "Welcome to NPFTV Stream"}</h1>
              <p>Live television and every programme on demand, from Nigeria Police Force Television. Free, with no sign-in.</p>
            </div>
            <div className="p-acts">
              <Link className="btn btn-yellow btn-sm" href="/stream/live">
                <Icon name="play" fill /> Watch live
              </Link>
              <Link className="btn btn-dark btn-sm" href="/stream/guide">
                <Icon name="calendar" /> Guide
              </Link>
            </div>
          </div>
        </div>
        <aside className="side">
          <OnNowCard />
          <CatchMeUpCard />
          <UpNextCard />
        </aside>
      </div>
      </div>

      {continueWatching.length > 0 && (
        <section className="rail" style={{ paddingBottom: 0 }}>
          <div className="rail-hd">
            <h2>Continue watching</h2>
          </div>
          <div className="eps">
            {continueWatching.map((e) => (
              <EpisodeCard key={e.id} e={e} />
            ))}
          </div>
        </section>
      )}

      <section className="rail" style={{ paddingBottom: 0 }}>
        <div className="rail-hd">
          <h2>Latest on demand</h2>
          <Link href="/stream/on-demand">See all</Link>
        </div>
        <div className="eps">
          {latestOnDemandIds.map((id) => (
            <EpisodeCard key={id} e={episodeById(id)!} />
          ))}
        </div>
      </section>

      <section className="rail" style={{ paddingBottom: 0 }}>
        <div className="rail-hd">
          <h2>Live events and premieres</h2>
          <Link href="/stream/guide">Full guide</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((s) => {
            const on = state.reminders.includes(s.id);
            return (
              <div key={s.id} className="card" style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 14, borderColor: s.id === "evt-press-briefing" ? "var(--green-2)" : undefined }}>
                <div style={{ textAlign: "center", borderRight: "2px solid var(--yellow)", paddingRight: 10 }}>
                  <small style={{ display: "block", color: "var(--green-2)", fontWeight: 600 }}>{fmt.monShort(s.date)}</small>
                  <b style={{ fontFamily: "var(--slab)", fontSize: 34, color: "var(--indigo)", lineHeight: 1 }}>{fmt.dayNum(s.date)}</b>
                </div>
                <div>
                  <span className="tag tag-green">
                    {s.title.startsWith("Premiere") ? "Premiere" : "Live event"}
                  </span>
                  <h3 style={{ fontSize: 18, margin: "8px 0 4px" }}>{s.title.startsWith("Premiere") ? "The Force in Focus: inside the Air Wing" : s.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 13.5 }}>
                    {fmt.weekday(s.date)}, {s.start} to {s.end} WAT{s.location ? ` · ${s.location}` : ""}
                  </p>
                  <button className={`btn btn-sm ${on ? "btn-yellow" : "btn-line"}`} style={{ marginTop: 10 }} onClick={() => act.toggleReminder(s.id)} aria-pressed={on}>
                    <Icon name={on ? "check" : "bell"} /> {on ? "Reminder set" : "Remind me"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rail" style={{ paddingBottom: 0 }}>
        <div className="rail-hd">
          <h2>Programmes</h2>
          <Link href="/stream/programmes">All programmes</Link>
        </div>
        <div className="posters">
          {programmes.slice(0, 6).map((p) => (
            <Poster key={p.id} p={p} href={`/stream/on-demand?programme=${p.id}`} />
          ))}
        </div>
      </section>

      <section className="rail">
        <div className="rail-hd">
          <h2>Podcasts</h2>
          <Link href="/stream/podcasts">The Insight Podcast</Link>
        </div>
        <div className="eps">
          {podcasts.map((e) => (
            <EpisodeCard key={e.id} e={e} />
          ))}
        </div>
      </section>
    </>
  );
}
