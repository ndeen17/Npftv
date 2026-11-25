"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { categoryById } from "@/data/articles";
import { stateById, stateSlug } from "@/data/places";
import { Icon } from "@/components/Icon";
import { ArticleThumb, EmergencyNote, StoryRow } from "@/components/site/bits";
import { LANGS, translate, type Lang } from "@/lib/ai";
import { aiOpts, askAI } from "@/lib/ai-client";

interface Translation {
  title: string;
  summary: string;
  body: string[];
}
import { useDemo } from "@/lib/store";
import { fmt, isoDate, isoTime } from "@/lib/time";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { state, hydrated } = useDemo();
  const a = state.articles.find((x) => x.slug === slug && x.status === "published");
  const [lang, setLang] = useState<Lang>("en");
  const [speaking, setSpeaking] = useState(false);
  const [tr, setTr] = useState<Record<string, Translation | null>>({});
  const [trBusy, setTrBusy] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  // Live AI translation of the whole story, cached per language.
  useEffect(() => {
    if (!a || lang === "en") return;
    const key = `${a.id}|${lang}`;
    if (key in tr) return;
    let live = true;
    setTrBusy(true);
    const art = a;
    askAI<Translation | null>(
      "translate",
      { lang, title: art.title, summary: art.summary, body: art.body },
      () => {
        const t = translate(art.title, lang);
        return t ? { title: t, summary: "", body: [] } : null;
      },
      aiOpts(state),
    )
      .then(({ data }) => live && setTr((m) => ({ ...m, [key]: data })))
      .finally(() => live && setTrBusy(false));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a?.id, lang]);

  if (!a) {
    return (
      <section className="sec">
        <div className="wrap" style={{ maxWidth: 760 }}>
          {hydrated ? (
            <>
              <h1 style={{ fontSize: 40, color: "var(--indigo)" }}>Story not found</h1>
              <p style={{ margin: "12px 0 24px", color: "var(--muted)" }}>It may not be published yet, or it was withdrawn.</p>
              <Link className="btn btn-indigo" href="/news">
                Back to the newsroom
              </Link>
            </>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              <span className="skel" style={{ height: 40, width: "80%" }} />
              <span className="skel" />
              <span className="skel" style={{ width: "60%" }} />
            </div>
          )}
        </div>
      </section>
    );
  }

  const cat = categoryById(a.category);
  const st = stateById(a.state);
  const current = lang === "en" ? null : (tr[`${a.id}|${lang}`] ?? null);
  const related = state.articles.filter((x) => x.status === "published" && x.id !== a.id && (x.category === a.category || (a.state && x.state === a.state))).slice(0, 3);

  function listen() {
    const s = window.speechSynthesis;
    if (!s) return;
    if (speaking) {
      s.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance([a!.title, ...a!.body].join(". "));
    u.lang = "en-GB";
    u.onend = () => setSpeaking(false);
    s.speak(u);
    setSpeaking(true);
  }

  return (
    <>
      <section className="page-hd">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <Icon name="chev" />
            <Link href="/news">News</Link>
            <Icon name="chev" />
            <Link href={`/news?cat=${a.category}`}>{cat?.name}</Link>
          </nav>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 52px)" }}>{a.title}</h1>
          <p>{a.summary}</p>
          <div className="meta" style={{ color: "#bdb3da", marginTop: 18 }}>
            <span>{a.author}</span>
            <span>·</span>
            <span>
              {fmt.dayMonthYear(isoDate(a.date))}, {isoTime(a.date)} WAT
            </span>
            {st && (
              <>
                <span>·</span>
                <Link href={`/state-commands/${stateSlug(st)}`} style={{ color: "var(--yellow)" }}>
                  {st.name} State Command
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <div className="ai-strip" style={{ marginBottom: 28 }}>
            <button className="btn btn-sm btn-line" onClick={listen} aria-pressed={speaking}>
              <Icon name={speaking ? "pause" : "headphones"} fill={speaking} /> {speaking ? "Stop" : "Listen to this article"}
            </button>
            <span style={{ flex: 1 }} />
            <Icon name="globe" style={{ color: "var(--green)" }} />
            <label htmlFor="lang" className="sr">
              Language
            </label>
            <select id="lang" className="lang-sel" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
              {LANGS.map((l) => (
                <option key={l.id} value={l.id} disabled={!l.ready}>
                  {l.name}
                  {!l.ready ? " (coming later)" : ""}
                </option>
              ))}
            </select>
          </div>

          {lang !== "en" && (
            <div className="draft-box" style={{ marginBottom: 28 }}>
              <span className="tag tag-feat">
                <Icon name="spark" style={{ width: 13, height: 13 }} /> AI draft, needs review
              </span>
              <div aria-live="polite" lang={lang === "pcm" ? "pcm" : lang}>
                {trBusy && !current ? (
                  <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                    <span className="skel" style={{ height: 22, width: "75%" }} />
                    <span className="skel" />
                    <span className="skel" style={{ width: "90%" }} />
                    <span className="skel" style={{ width: "60%" }} />
                  </div>
                ) : current ? (
                  <>
                    <p style={{ marginTop: 10, fontFamily: "var(--slab)", fontSize: 24, fontWeight: 700, color: "var(--indigo)", lineHeight: 1.2 }}>{current.title}</p>
                    {current.summary && <p style={{ marginTop: 8, fontSize: 17, color: "#3b3452" }}>{current.summary}</p>}
                    {current.body.length > 0 && (
                      <div className="prose" style={{ marginTop: 14 }}>
                        {current.body.map((p, i) => (
                          <p key={i} style={{ fontSize: 16.5 }}>
                            {p}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ marginTop: 10, color: "var(--muted)" }}>The {LANGS.find((l) => l.id === lang)?.name} translation isn&apos;t available right now. Please try again in a moment.</p>
                )}
              </div>
              <p style={{ marginTop: 8, fontSize: 13.5, color: "var(--muted)" }}>
                Machine translation by AI. Official and sensitive messages are always checked by a fluent speaker before they are published. The original English story is below.
              </p>
            </div>
          )}

          {(a.thumb === "eod" || a.thumb === "parade") && (
            <figure style={{ marginBottom: 32, borderRadius: 8, overflow: "hidden", aspectRatio: "16/9" }}>
              <ArticleThumb a={a} />
            </figure>
          )}
          <div className="prose">
            {a.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <EmergencyNote />
        </div>
      </section>

      {related.length > 0 && (
        <section className="sec nu" style={{ paddingTop: 56 }}>
          <div className="wrap" style={{ display: "block", maxWidth: 900 }}>
            <div className="sec-hd">
              <h2>Related stories</h2>
            </div>
            {related.map((r) => (
              <StoryRow key={r.id} a={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
