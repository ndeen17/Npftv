"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { categoryInfo } from "@/data/agencies";
import { stateById } from "@/data/places";
import { STATUS_STEPS } from "@/data/reports";
import { Icon } from "@/components/Icon";
import { PageHead } from "@/components/site/bits";
import { RoleNote } from "@/components/site/civic";
import { useDemo } from "@/lib/store";
import { fmt, isoDate, isoTime } from "@/lib/time";

function Track() {
  const params = useSearchParams();
  const router = useRouter();
  const { state, hydrated } = useDemo();
  const initial = (params.get("ref") ?? "").trim().toUpperCase();
  const [q, setQ] = useState(initial);
  const [mine, setMine] = useState<string[]>([]);

  useEffect(() => {
    try {
      setMine(JSON.parse(localStorage.getItem("npftv-my-reports") ?? "[]"));
    } catch {}
  }, []);
  useEffect(() => setQ(initial), [initial]);

  const r = initial ? state.reports.find((x) => x.ref === initial) : undefined;
  const reached = r ? (r.status === "not-used" ? r.history.filter((h) => h.status !== "not-used").length : STATUS_STEPS.findIndex((s) => s.id === r.status) + 1) : 0;

  return (
    <>
      <PageHead title="Track a report" intro="See what the NPFTV newsroom has done with a report you sent." crumbs={[{ href: "/safety", label: "Safety" }, { label: "Track a report" }]} />
      <section className="sec" style={{ paddingTop: 36 }}>
        <div className="wrap" style={{ maxWidth: 860, display: "grid", gap: 18 }}>
          <form
            className="card-w"
            style={{ padding: 18, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/track?ref=${encodeURIComponent(q.trim().toUpperCase())}`);
            }}
          >
            <label className="field" style={{ flex: "1 1 260px" }}>
              Your reference
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="NPFTV-RPT-26-00000" autoCapitalize="characters" spellCheck={false} />
            </label>
            <button className="btn btn-indigo">
              <Icon name="search" /> Track
            </button>
          </form>

          {mine.length > 0 && !initial && (
            <div className="card-w" style={{ padding: 18 }}>
              <h3 style={{ color: "var(--indigo)", fontSize: 18, marginBottom: 8 }}>Reports sent from this device</h3>
              <div className="chips">
                {mine.map((m) => (
                  <Link key={m} className="chip" href={`/track?ref=${m}`}>
                    {m}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {initial && hydrated && !r && (
            <div className="role-note" style={{ borderLeftColor: "var(--yellow-deep)" }}>
              <Icon name="info" />
              <p>
                We couldn&apos;t find <b>{initial}</b>. Check the reference and try again. References look like NPFTV-RPT-26-04817.
              </p>
            </div>
          )}

          {r && (
            <div className="track-card">
              <div className="track-hd">
                <span className="tag tag-soft">{categoryInfo(r.category).label}</span>
                <b>{r.summary}</b>
                <small>
                  {[r.landmark, r.lga, stateById(r.state)?.name].filter(Boolean).join(", ")} · sent {fmt.dayMonShort(isoDate(r.createdAt))}, {isoTime(r.createdAt)}
                </small>
              </div>
              <ol className="track-tl">
                {STATUS_STEPS.map((s, i) => {
                  const ev = [...r.history].reverse().find((h) => h.status === s.id);
                  const done = i < reached;
                  const notUsedHere = r.status === "not-used" && i === reached;
                  return (
                    <li key={s.id} className={notUsedHere ? "stop" : done ? "done" : ""}>
                      <span className="dot">{notUsedHere ? <Icon name="x" /> : done ? <Icon name="check" /> : i + 1}</span>
                      <div>
                        <b>{notUsedHere ? "Not used" : s.label}</b>
                        <p>{notUsedHere ? r.history[r.history.length - 1].publicNote : ev ? ev.publicNote : s.text}</p>
                        {(ev || notUsedHere) && <small>{fmt.dayMonShort(isoDate((notUsedHere ? r.history[r.history.length - 1] : ev)!.at))}, {isoTime((notUsedHere ? r.history[r.history.length - 1] : ev)!.at)}</small>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          <RoleNote>
            <b>NPFTV uses reports for news and public awareness.</b> We don&apos;t forward them to the police or other agencies, and we can&apos;t send help. In an emergency, call <a href="tel:112">112</a>.
          </RoleNote>
          <Link className="link" href="/safety/report">
            Send a new report <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <Track />
    </Suspense>
  );
}
