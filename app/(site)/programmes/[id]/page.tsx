"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { episodes, programmeById } from "@/data/programmes";
import { Icon } from "@/components/Icon";
import { PageHead, Poster, StoryRow } from "@/components/site/bits";
import { useDemo } from "@/lib/store";
import { fmt, toMin, watParts } from "@/lib/time";

const RELATED: Record<string, string[]> = {
  "the-beat": ["highway-patrols", "night-travel-advice", "eod-certification"],
  "safe-nigeria": ["night-travel-advice", "home-security-guide", "five-signs-scam"],
  "community-watch": ["enugu-watch-groups", "borno-community", "community-school-visits"],
  "force-in-focus": ["eod-certification", "fpu-peacekeeping"],
  "cyber-sense": ["five-signs-scam", "investigation-fake-loans", "statement-otp"],
  "in-conversation": ["highway-patrols", "police-news-training"],
  "insight-podcast": ["national-emergency-112", "enugu-watch-groups"],
};

export default function ProgrammePage() {
  const { id } = useParams<{ id: string }>();
  const { state, now } = useDemo();
  const p = programmeById(id);
  if (!p) {
    return (
      <section className="sec">
        <div className="wrap">
          <h1 style={{ color: "var(--indigo)" }}>Programme not found</h1>
          <Link className="link" href="/programmes">
            All programmes
          </Link>
        </div>
      </section>
    );
  }
  const { date, minutes } = watParts(now);
  const eps = episodes.filter((e) => e.programmeId === p.id);
  const slots = state.schedule.filter((s) => s.programmeId === p.id && (s.date > date || (s.date === date && toMin(s.end) > minutes))).slice(0, 5);
  const related = (RELATED[p.id] ?? []).map((rid) => state.articles.find((a) => a.id === rid)).filter((a): a is NonNullable<typeof a> => !!a);

  return (
    <>
      <PageHead title={p.title} intro={p.description} crumbs={[{ href: "/programmes", label: "Programmes" }, { label: p.title }]}>
        <div className="hero-ctas" style={{ marginTop: 26, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn btn-yellow" href={`/stream/on-demand?programme=${p.id}`}>
            <Icon name="play" fill /> Watch on NPFTV Stream
          </Link>
          <span className="tag tag-soft" style={{ alignSelf: "center" }}>
            {p.strand} · {p.scheduleText}
          </span>
        </div>
      </PageHead>

      <section className="sec" style={{ paddingTop: 48 }}>
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div>
            <div className="sec-hd">
              <h2>Latest episodes</h2>
            </div>
            {eps.length ? (
              <div style={{ display: "grid", gap: 14 }}>
                {eps.map((e) => (
                  <Link key={e.id} href={`/stream/episode/${e.id}`} className="card-w" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center", padding: 16 }}>
                    <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--indigo)", color: "var(--yellow)", display: "grid", placeItems: "center" }}>
                      <Icon name="play" fill style={{ width: 18, height: 18, marginLeft: 2 }} />
                    </span>
                    <span>
                      <b style={{ color: "var(--indigo)", fontWeight: 600 }}>{e.title}</b>
                      <small style={{ display: "block", color: "var(--muted)", fontSize: 13.5 }}>
                        {fmt.dayMonthYear(e.date)} · {e.summary}
                      </small>
                    </span>
                    <span className="cond" style={{ color: "var(--muted)", fontWeight: 600 }}>
                      {e.duration}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted)" }}>Episodes will appear here after broadcast.</p>
            )}
            {related.length > 0 && (
              <>
                <div className="sec-hd" style={{ marginTop: 56 }}>
                  <h2>Related stories</h2>
                </div>
                <div className="card-w" style={{ padding: "24px 24px 4px" }}>
                  {related.map((a) => (
                    <StoryRow key={a.id} a={a} />
                  ))}
                </div>
              </>
            )}
          </div>
          <aside>
            <div style={{ maxWidth: 240 }}>
              <Poster p={p} />
            </div>
            <h3 style={{ color: "var(--indigo)", margin: "32px 0 12px" }}>Coming up</h3>
            {slots.length ? (
              <ul style={{ listStyle: "none" }}>
                {slots.map((s) => (
                  <li key={s.id} style={{ padding: "12px 0", borderTop: "1px solid var(--line)", fontSize: 14.5 }}>
                    <b style={{ color: "var(--indigo)" }}>
                      {fmt.dayTab(s.date)}, {s.start} WAT
                    </b>
                    <small style={{ display: "block", color: "var(--muted)" }}>{s.subtitle}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "var(--muted)", fontSize: 14.5 }}>On demand only. New episodes every week on NPFTV Stream.</p>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
