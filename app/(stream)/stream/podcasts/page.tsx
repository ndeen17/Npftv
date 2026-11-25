"use client";

import Link from "next/link";
import { episodes, programmeById } from "@/data/programmes";
import { Icon } from "@/components/Icon";
import { fmt } from "@/lib/time";

export default function PodcastsPage() {
  const p = programmeById("insight-podcast")!;
  const eps = episodes.filter((e) => e.programmeId === p.id);
  return (
    <section className="s-pad">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr] items-start">
        <div className="art a3" style={{ aspectRatio: "1", borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <span style={{ position: "absolute", right: 16, top: 16, width: 60, height: 60, borderRadius: "50%", background: "var(--yellow)", boxShadow: "-30px 40px 0 -10px var(--green)" }} />
          <small style={{ fontWeight: 600 }}>Podcast</small>
          <b style={{ fontFamily: "var(--slab)", fontSize: 32, lineHeight: 0.95 }}>The Insight Podcast</b>
        </div>
        <div>
          <h1 style={{ fontSize: 34 }}>{p.title}</h1>
          <p className="s-lead">{p.description}</p>
          <div className="card" style={{ marginTop: 24, padding: 0 }}>
            <ul className="epg-list">
              {eps.map((e) => (
                <li key={e.id}>
                  <span className="t">{fmt.dayMonShort(e.date)}</span>
                  <span>
                    <b>{e.title}</b>
                    <small>
                      {e.duration} · {e.summary}
                    </small>
                  </span>
                  <Link className="icon-b" href={`/stream/episode/${e.id}`} aria-label={`Listen to ${e.title}`} style={{ background: "var(--yellow)", color: "var(--indigo)" }}>
                    <Icon name="headphones" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
