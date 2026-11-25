"use client";

import Link from "next/link";
import { useState } from "react";
import { episodeById, latestOnDemandIds, programmeById, tonightChapters } from "@/data/programmes";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { LivePlayer } from "@/components/stream/Player";
import { CatchMeUpCard, DayTabs, EpgTimeline, EpisodeCard, OnNowCard, UpNextCard } from "@/components/stream/parts";
import { onAir } from "@/lib/broadcast";
import { useDemo } from "@/lib/store";
import { toHHMM, toMin } from "@/lib/time";

export default function LivePage() {
  const { state, now } = useDemo();
  const toast = useToast();
  const air = onAir(state.schedule, now, state.live);
  const cur = air.current;
  const prog = cur?.programmeId ? programmeById(cur.programmeId) : undefined;
  const isBeat = cur?.title === "The Beat" && air.state === "live";
  const [day, setDay] = useState(air.date);
  // Guide window: from the top of the hour before now, five hours wide (as designed: 18:00 to 23:00).
  const startM = Math.min(Math.max(toMin("06:00"), Math.floor((toMin(air.nowHHMM) - 60) / 60) * 60), toMin("18:00"));
  const from = day === air.date ? toHHMM(startM) : "18:00";
  const to = toHHMM(toMin(from) + 300);
  const nowM = toMin(air.nowHHMM);

  return (
    <>
      <div className="theatre">
      <div className="s-main">
        <div>
          <LivePlayer />
          <div className="p-below">
            <div>
              <h1>{air.state === "off-air" || !cur ? "NPFTV Stream" : cur.title}</h1>
              <p>
                {isBeat
                  ? "National news at seven. Tonight: festive travel safety, night-time road advice, and a warning about fake loan apps."
                  : prog?.description ?? (cur ? cur.subtitle : "The channel is off air. Catch up on any programme on demand.")}
              </p>
            </div>
            <div className="p-acts">
              {prog && (
                <Link className="btn btn-dark btn-sm" href={`/programmes/${prog.id}`}>
                  <Icon name="list" />
                  Programme page
                </Link>
              )}
              <button
                className="btn btn-dark btn-sm"
                onClick={() => {
                  navigator.clipboard?.writeText("https://stream.npftv.net/live").catch(() => {});
                  toast("Link copied: stream.npftv.net/live");
                }}
              >
                <Icon name="send" />
                Share
              </button>
            </div>
          </div>
          {isBeat && (
            <div className="chap">
              <h3>
                <Icon name="spark" />
                Tonight&apos;s stories<small>Chapters added by AI as the programme airs</small>
              </h3>
              <div className="chaps">
                {tonightChapters
                  .filter((c) => toMin(c.time) <= nowM)
                  .map((c, i, arr) => (
                    <button key={c.time} className={i === arr.length - 1 ? "cur" : ""} onClick={() => toast(`Demo: rewinding live TV to ${c.time} isn't available in the prototype.`)}>
                      <b>{c.time}</b>
                      {c.title}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <aside className="side">
          <OnNowCard />
          <CatchMeUpCard />
          <UpNextCard />
        </aside>
      </div>
      </div>

      <section className="epg">
        <div className="epg-hd">
          <h2>Programme guide</h2>
          <DayTabs value={day} onChange={setDay} />
        </div>
        <EpgTimeline date={day} from={from} to={to} slots={state.schedule} nowHHMM={air.nowHHMM} nowDate={air.date} />
        <p style={{ marginTop: 10, fontSize: 13.5 }}>
          <Link href="/stream/guide" className="link">
            Full guide for the week →
          </Link>
        </p>
      </section>

      <section className="rail">
        <div className="rail-hd">
          <h2>Latest on demand</h2>
          <Link href="/stream/on-demand">See all</Link>
        </div>
        <div className="eps">
          {latestOnDemandIds.map((id) => {
            const e = episodeById(id)!;
            return <EpisodeCard key={id} e={e} />;
          })}
        </div>
      </section>
    </>
  );
}
