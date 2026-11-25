"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { episodes, programmeById, programmes } from "@/data/programmes";
import { stateSlug, states } from "@/data/places";
import { guides } from "@/data/public";
import { Icon } from "@/components/Icon";
import { PageHead } from "@/components/site/bits";
import { search, type SearchDoc } from "@/lib/ai";
import { aiOpts, askAI } from "@/lib/ai-client";
import { useDemo } from "@/lib/store";

const KIND_LABEL: Record<SearchDoc["kind"], string> = { story: "Story", programme: "Programme", guide: "Safety guide", episode: "On demand", state: "State command" };

function SearchInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { state } = useDemo();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<SearchDoc[] | null>(null);

  const docs = useMemo<SearchDoc[]>(
    () => [
      ...state.articles.filter((a) => a.status === "published").map((a) => ({ id: a.id, kind: "story" as const, title: a.title, text: `${a.summary} ${a.body.join(" ")}`, href: `/news/${a.slug}` })),
      ...programmes.map((p) => ({ id: p.id, kind: "programme" as const, title: p.title, text: `${p.strand} ${p.description}`, href: `/programmes/${p.id}` })),
      ...guides.map((g) => ({ id: g.id, kind: "guide" as const, title: g.title, text: `${g.short} ${g.steps.join(" ")} ${g.keywords.join(" ")}`, href: `/public-safety/${g.id}` })),
      ...episodes.map((e) => ({ id: e.id, kind: "episode" as const, title: `${programmeById(e.programmeId)?.title}: ${e.title}`, text: e.summary, href: `/stream/episode/${e.id}` })),
      ...states.map((s) => ({ id: s.id, kind: "state" as const, title: `${s.name} State Command`, text: `${s.capital} ${s.zone}`, href: `/state-commands/${stateSlug(s)}` })),
    ],
    [state.articles],
  );

  useEffect(() => {
    if (!initial) return;
    let live = true;
    setBusy(true);
    const q = initial.slice(0, 200);
    const index = docs.map((d) => ({ id: `${d.kind}:${d.id}`, kind: d.kind, title: d.title.slice(0, 200), text: d.text.replace(/\s+/g, " ").slice(0, 160) }));
    askAI<{ results: string[] }>("search", { query: q, index }, () => ({ results: search(q, docs).map((d) => `${d.kind}:${d.id}`) }), aiOpts(state)).then(({ data }) => {
      if (!live) return;
      const byKey = new Map(docs.map((d) => [`${d.kind}:${d.id}`, d]));
      setResults(data.results.map((k) => byKey.get(k)).filter((d): d is SearchDoc => !!d));
      setBusy(false);
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  return (
    <>
      <PageHead title="Search" intro="Ask in your own words. We search stories, programmes, safety guides and state commands." crumbs={[{ label: "Search" }]} />
      <section className="sec" style={{ paddingTop: 36 }}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/search?q=${encodeURIComponent(q)}`);
            }}
            style={{ display: "flex", gap: 10 }}
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. what should I do if someone asks for my OTP?" aria-label="Search" style={{ flex: 1, minWidth: 0, height: 52, border: "1.5px solid var(--line)", borderRadius: 8, padding: "0 16px", fontSize: 16, background: "#fff" }} />
            <button className="btn btn-indigo" style={{ height: 52 }}>
              <Icon name="spark" /> Search
            </button>
          </form>
          <p className="ai-note" style={{ marginTop: 10 }}>
            <Icon name="spark" /> Plain-language search understands related words, so “Christmas travel” finds festive season road advice.
          </p>

          <div style={{ marginTop: 28 }} aria-live="polite">
            {busy && (
              <div style={{ display: "grid", gap: 14 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card-w" style={{ padding: 18, display: "grid", gap: 8 }}>
                    <span className="skel" style={{ width: "20%" }} />
                    <span className="skel" style={{ width: "70%", height: 16 }} />
                  </div>
                ))}
              </div>
            )}
            {!busy && results && (
              <>
                <p style={{ color: "var(--muted)", marginBottom: 14 }}>
                  {results.length ? `${results.length} result${results.length === 1 ? "" : "s"} for “${initial}”` : `Nothing matched “${initial}”. Try fewer or different words.`}
                </p>
                <div style={{ display: "grid", gap: 10 }}>
                  {results.map((r) => (
                    <Link key={`${r.kind}-${r.id}`} href={r.href} className="card-w" style={{ padding: "16px 18px", display: "block" }}>
                      <span className="meta">
                        <span className="cat">{KIND_LABEL[r.kind]}</span>
                      </span>
                      <b style={{ display: "block", fontFamily: "var(--slab)", fontSize: 20, color: "var(--indigo)", marginTop: 4 }}>{r.title}</b>
                      <span style={{ display: "block", color: "var(--muted)", fontSize: 14.5, marginTop: 2 }}>{r.text.slice(0, 160)}…</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  );
}
