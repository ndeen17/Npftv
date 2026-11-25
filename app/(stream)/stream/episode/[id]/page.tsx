"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { episodeById, episodes, programmeById } from "@/data/programmes";
import { Icon } from "@/components/Icon";
import { VodPlayer } from "@/components/stream/Player";
import { EpisodeCard } from "@/components/stream/parts";
import { runAI } from "@/lib/ai";
import { useDemo } from "@/lib/store";
import { fmt } from "@/lib/time";

export default function EpisodePage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useDemo();
  const e = episodeById(id);
  const [summary, setSummary] = useState<{ time: string; text: string }[] | null>(null);
  const [busy, setBusy] = useState(false);

  if (!e) {
    return (
      <section className="s-pad">
        <h1>Episode not found</h1>
        <Link href="/stream/on-demand" style={{ color: "var(--yellow)" }}>
          Browse on demand
        </Link>
      </section>
    );
  }
  const p = programmeById(e.programmeId)!;
  const related = episodes.filter((x) => x.id !== e.id && (x.programmeId === e.programmeId || x.thumb)).slice(0, 5);

  return (
    <>
      <div className="theatre">
      <div className="s-main">
        <div>
          <VodPlayer title={e.title} prog={p.title} thumb={e.thumb} duration={e.duration} seek={e.progress ?? 0} />
          <div className="p-below">
            <div>
              <Link href={`/programmes/${p.id}`} style={{ color: "var(--yellow)", fontWeight: 600, fontSize: 14 }}>
                {p.title}
              </Link>
              <h1>{e.title}</h1>
              <p>
                {fmt.dayMonthYear(e.date)} · {e.duration} · {e.summary}
              </p>
            </div>
          </div>
          <div className="chap">
            <h3>
              <Icon name="spark" />
              Chapters<small>Added by AI from the captions, checked by the programme team</small>
            </h3>
            <div className="chaps" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
              {e.chapters.map((c) => (
                <button key={c.time}>
                  <b>{c.time}</b>
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        </div>
        <aside className="side">
          <div className="card ai-card">
            <h3>
              <Icon name="spark" />
              Catch me up
            </h3>
            <p className="sub">Short on time? Get the key points of this episode.</p>
            {summary ? (
              <ul>
                {summary.map((b) => (
                  <li key={b.time}>
                    <span>{b.time}</span>
                    {b.text}
                  </li>
                ))}
              </ul>
            ) : busy ? (
              <div style={{ display: "grid", gap: 10 }}>
                <span className="skel" />
                <span className="skel" style={{ width: "85%" }} />
                <span className="skel" style={{ width: "70%" }} />
              </div>
            ) : (
              <button
                className="btn btn-yellow btn-sm"
                onClick={async () => {
                  setBusy(true);
                  setSummary(await runAI(() => e.catchUp, state.aiInstant));
                  setBusy(false);
                }}
              >
                <Icon name="spark" /> Summarise this episode
              </button>
            )}
            <div className="foot">
              <Icon name="spark" style={{ width: 14, height: 14 }} />
              Written by AI from the captions.
            </div>
          </div>
          <div className="card">
            <h3>About {p.title}</h3>
            <p style={{ color: "#bdb3da", fontSize: 14, marginTop: 8 }}>{p.description}</p>
            <p style={{ color: "#a79dc7", fontSize: 13, marginTop: 8 }}>{p.scheduleText}</p>
          </div>
        </aside>
      </div>
      </div>
      <section className="rail">
        <h2>More to watch</h2>
        <div className="eps">
          {related.map((x) => (
            <EpisodeCard key={x.id} e={x} />
          ))}
        </div>
      </section>
    </>
  );
}
