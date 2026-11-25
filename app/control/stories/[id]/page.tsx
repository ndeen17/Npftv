"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { categories, categoryById, KANO_ID } from "@/data/articles";
import { stateById, states } from "@/data/places";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { TopBar } from "@/components/control/Shell";
import { LANGS, translate, type Lang } from "@/lib/ai";
import { aiOpts, askAI } from "@/lib/ai-client";
import { canPublishRoles, currentBody, fromLive, scriptedReview, type LiveCopyDesk, type Review } from "@/lib/copydesk";
import { defaultCopyDesk, useActions, useDemo, type CopyDeskState } from "@/lib/store";
import { isoTime } from "@/lib/time";
import type { Article, ArticleStatus, Submission } from "@/lib/types";

const STATUS: Record<ArticleStatus, [string, string]> = {
  draft: ["Draft", "st-draft"],
  submitted: ["Submitted for review", "st"],
  returned: ["Returned to reporter", "st-returned"],
  approved: ["Approved", "st-published"],
  scheduled: ["Scheduled", "st"],
  published: ["Published", "st-published"],
  rejected: ["Rejected", "st-returned"],
  withdrawn: ["Withdrawn", "st-returned"],
};

// One review request per story at a time, across re-renders and strict-mode double effects.
const inflight = new Set<string>();

/** Highlight flagged phrases, or show them as fixed. */
function Para({ n, text, cd, rev }: { n: number; text: string; cd: CopyDeskState; rev?: Review }) {
  if (!rev) return <>{text}</>;
  const marks: { find: string; cls: string }[] = [];
  for (const s of rev.sensitivity.filter((x) => x.paragraph === n)) {
    const d = cd.decisions[s.id];
    if (!d) marks.push({ find: s.quote, cls: "sens" });
    else if (d === "fixed" && s.replacement) marks.push({ find: s.replacement, cls: "done" });
  }
  for (const f of rev.style.filter((x) => x.paragraph === n)) {
    marks.push(cd.styleDone[f.id] ? { find: f.replace, cls: "done" } : { find: f.find, cls: "sty" });
  }
  let parts: ReactNode[] = [text];
  marks.forEach((m, mi) => {
    if (!m.find) return;
    parts = parts.flatMap((p, k): ReactNode[] => {
      if (typeof p !== "string" || !p.includes(m.find)) return [p];
      const i = p.indexOf(m.find);
      return [p.slice(0, i), <mark key={`${mi}-${k}`} className={m.cls}>{m.find}</mark>, p.slice(i + m.find.length)];
    });
  });
  return <>{parts}</>;
}

function fallbackTriage(a: Article): Submission["triage"] {
  return { category: a.category, state: a.state ?? "", urgency: "routine", reason: "Automatic triage wasn't available. Check the category and state." };
}

export default function StoryEditor() {
  const { id } = useParams<{ id: string }>();
  const { state, role, hydrated, now } = useDemo();
  const act = useActions();
  const toast = useToast();
  const a = state.articles.find((x) => x.id === id);
  const cd = { ...defaultCopyDesk, ...state.copyDesk[id] };
  const rev = state.reviews[id];
  const [tab, setTab] = useState<"review" | "headlines" | "translate" | "seo">("review");
  const [lang, setLang] = useState<Lang>("ha");
  const [tr, setTr] = useState<Record<string, string | null>>({});
  const [trBusy, setTrBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isReporter = role === "reporter";
  const canPublish = !!role && canPublishRoles.includes(role);
  const showDesk = !!a && !isReporter && a.status !== "draft";
  const editable = !!a && isReporter && (a.status === "draft" || a.status === "returned");
  const kano = a?.id === KANO_ID;

  useEffect(() => {
    if (!a) return;
    setTitle(a.title);
    setBodyText(a.body.join("\n\n"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a?.id]);

  // Run the AI review once when an editor opens a submitted story. It's saved so every tab sees the same review.
  useEffect(() => {
    if (!hydrated || !a || !showDesk || rev || inflight.has(a.id)) return;
    inflight.add(a.id);
    const art = a;
    askAI<Review | LiveCopyDesk>("copy-desk", { title: art.title, body: art.body }, () => scriptedReview(art), { ...aiOpts(state), forceScripted: art.id === KANO_ID })
      .then((r) => act.saveReview(art.id, r.source === "live" ? fromLive(r.data as LiveCopyDesk) : (r.data as Review), r.source === "live", art.title))
      .finally(() => inflight.delete(art.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, a?.id, showDesk, !!rev]);

  const headline = rev?.headlines[cd.headline]?.text ?? a?.title ?? "";

  // Translate tab: live translation of the chosen headline.
  useEffect(() => {
    if (tab !== "translate" || !rev) return;
    const key = `${lang}|${headline}`;
    if (key in tr) return;
    let live = true;
    setTrBusy(true);
    askAI<{ title: string }>("translate", { lang, title: headline }, () => ({ title: translate(headline, lang) ?? "" }), { ...aiOpts(state), forceScripted: kano })
      .then((r) => live && setTr((m) => ({ ...m, [key]: r.data.title || null })))
      .finally(() => live && setTrBusy(false));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, lang, headline, !!rev]);

  if (!hydrated) return null;
  if (!a) {
    return (
      <>
        <TopBar crumbs={[{ href: "/control/stories", label: "Stories" }, "Not found"]} />
        <div className="pg">
          <div className="pnl empty">
            This story doesn&apos;t exist. <Link href="/control/stories">Back to stories</Link>
          </div>
        </div>
      </>
    );
  }

  const body = currentBody(a, cd, rev);
  const st = stateById(a.state);
  const sens = rev?.sensitivity ?? [];
  const open = sens.filter((s) => !cd.decisions[s.id]).length;
  const styleOpen = rev ? rev.style.filter((f) => !cd.styleDone[f.id]).length : 0;
  const published = a.status === "published";
  const [statusLabel, statusCls] = STATUS[a.status];
  const sub = state.submissions.find((s) => s.articleId === a.id);
  const log = state.audit
    .filter((e) => e.target && a.title && (e.target === a.title || e.target === headline))
    .slice()
    .reverse();

  const set = (patch: Partial<CopyDeskState>, audit?: string) => act.setCopyDesk(a.id, patch, audit, a.title);
  const paragraphs = bodyText
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const draftReady = title.trim().length > 5 && paragraphs.join(" ").length > 40;

  function saveDraft() {
    if (!editable) return;
    const t = title.trim();
    if (t === a!.title && paragraphs.join("\n") === a!.body.join("\n")) return;
    act.saveStory(a!.id, { title: t, body: paragraphs.length ? paragraphs : [""], summary: paragraphs[0]?.slice(0, 180) ?? "" }, t || "Untitled story");
  }

  async function submit() {
    const art = a!;
    saveDraft();
    setSubmitting(true);
    const t = title.trim() || art.title;
    const b = paragraphs.length ? paragraphs : art.body;
    act.submitStory(art.id, t, art.photos?.length ?? 0);
    toast("Submitted to the newsroom");
    if (art.id !== KANO_ID) {
      const r = await askAI<Submission["triage"]>("triage", { title: t, body: b }, () => fallbackTriage(art), aiOpts(state));
      const tri = { ...r.data, state: r.data.state === "none" ? "" : r.data.state };
      act.setTriage(art.id, tri, t);
    }
    setSubmitting(false);
  }

  function publish() {
    act.publishStory(a!.id, { title: headline, body, summary: rev?.summary ?? a!.summary });
    toast("Published. It's now on the homepage and at the top of the ticker.");
  }

  const issueLabel = (n: number) => `${n} sensitivity issue${n === 1 ? "" : "s"}`;

  return (
    <>
      <TopBar
        crumbs={[
          { href: isReporter ? "/control/stories" : "/control/submissions", label: isReporter ? "My stories" : "Submissions" },
          st ? `${st.name} State Command` : categoryById(a.category)?.name ?? "Story",
          a.title || "New story",
        ]}
      />
      <div className={`cnt${showDesk ? "" : " narrow"}`}>
        <div className="pnl ed">
          <div className="ed-top">
            <span className={`tag ${statusCls}`}>{statusLabel}</span>
            <span>
              {a.author}
              {a.author === "Musa Ibrahim" ? ", Kano correspondent" : ""}
              {a.status !== "draft" ? `, today at ${sub?.at ?? isoTime(a.date)}` : ", draft"}
            </span>
            {published && (
              <Link className="mini" href={`/news/${a.slug}`} target="_blank" style={{ marginLeft: "auto" }}>
                <Icon name="eye" /> View on npftv.net
              </Link>
            )}
          </div>

          {editable ? (
            <textarea className="ed-title" rows={2} value={title} onChange={(e) => setTitle(e.target.value)} onBlur={saveDraft} placeholder="Headline" aria-label="Headline" />
          ) : (
            <div className="ed-title">{published ? a.title : headline}</div>
          )}

          <div className="fields">
            <label className="fld">
              <span>Category</span>
              <select value={a.category} disabled={published} onChange={(e) => act.saveStory(a.id, { category: e.target.value }, a.title)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="fld">
              <span>State</span>
              <select value={a.state ?? ""} disabled={published} onChange={(e) => act.saveStory(a.id, { state: e.target.value || undefined }, a.title)}>
                <option value="">National</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <span className="fld">
              <span>Publish</span>
              {published ? "Published" : "When approved"}
            </span>
          </div>

          {a.photos && (
            <div className="photos">
              {a.photos.map((p) => (
                <div key={p} className="ph">
                  <Icon name="image" />
                  {p}
                </div>
              ))}
            </div>
          )}

          {editable && !kano ? (
            <div className="body">
              <textarea
                rows={12}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                onBlur={saveDraft}
                aria-label="Story text"
                placeholder={"Write your story. Leave a blank line between paragraphs.\n\nTip for the demo: include a detail the AI copy desk should catch, such as a suspect's name or where an operation is under way."}
              />
            </div>
          ) : (
            <div className="body">
              {body.map((p, i) => (
                <p key={i}>
                  <span className="pn">{i + 1}</span>
                  <Para n={i + 1} text={p} cd={cd} rev={showDesk && !published ? rev : undefined} />
                </p>
              ))}
            </div>
          )}

          <div className="log">
            <h4>Activity</h4>
            <ul>
              {log.map((e) => (
                <li key={e.id}>
                  <b>{isoTime(e.at)}</b>
                  {e.action} ({e.who})
                </li>
              ))}
              {!log.length && (
                <li>
                  <b>{isoTime(now.toISOString())}</b>
                  {a.status === "draft" ? "Draft saved on this device" : "No activity yet"}
                </li>
              )}
            </ul>
          </div>
        </div>

        {!showDesk ? (
          <div className="pnl" style={{ padding: 20, display: "grid", gap: 14, alignContent: "start" }}>
            <h3 style={{ color: "var(--indigo)", fontSize: 19 }}>{editable ? "Ready to send?" : "Sent to the newsroom"}</h3>
            {editable ? (
              <>
                <p style={{ fontSize: 14.5, color: "var(--muted)" }}>
                  Your story{a.photos?.length ? ` and ${a.photos.length} photos` : ""} go to the newsroom. The AI copy desk checks it first, then an editor reviews and approves it. Nothing is published without an editor.
                </p>
                <button className="btn btn-indigo" style={{ justifyContent: "center" }} disabled={submitting || (!kano && !draftReady)} onClick={submit}>
                  <Icon name="send" /> {submitting ? "Sending…" : "Submit for review"}
                </button>
                {!kano && !draftReady && <p style={{ fontSize: 12.5, color: "var(--muted)" }}>Add a headline and at least a couple of sentences.</p>}
              </>
            ) : (
              <p style={{ fontSize: 14.5, color: "var(--muted)" }}>{published ? "An editor approved and published your story." : "An editor will review your story. You'll be told if it's returned with changes."}</p>
            )}
            <p className="ai-note">
              <Icon name="spark" /> AI checks for sensitive details (ongoing operations, suspects not yet charged, victims and minors) before an editor sees it.
            </p>
          </div>
        ) : (
          <div className="pnl ai" data-ai-source={rev ? (rev.live ? "live" : "scripted") : "pending"}>
            <div className="ai-hd">
              <Icon name="spark" />
              <h3>AI copy desk</h3>
              <small>{rev ? "Checked just now" : "Checking…"}</small>
            </div>
            <div className="tabs" role="tablist">
              {(["review", "headlines", "translate", "seo"] as const).map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
                  {t === "seo" ? "SEO" : t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {!rev ? (
              <div className="blk" style={{ display: "grid", gap: 10 }}>
                <span className="skel" style={{ width: "30%" }} />
                <span className="skel" />
                <span className="skel" style={{ width: "80%" }} />
                <span className="skel" style={{ width: "30%", marginTop: 14 }} />
                <span className="skel" style={{ height: 50 }} />
                <span className="skel" style={{ height: 50 }} />
                <p className="ai-note" style={{ marginTop: 6 }}>
                  <Icon name="spark" /> Reading the story for sensitive details, house style and headlines…
                </p>
              </div>
            ) : (
              <>
                {tab === "review" && (
                  <>
                    <div className="blk">
                      <h4>Summary</h4>
                      <p>{rev.summary}</p>
                    </div>
                    <div className="blk">
                      <h4>
                        <Icon name="shield" style={{ width: 16, height: 16, color: open ? "var(--red)" : "var(--green)" }} />
                        Sensitivity check
                        <span className={`n ${open ? "red" : "ok"}`}>{open ? `${open} to fix` : sens.length ? "Resolved" : "No issues"}</span>
                      </h4>
                      {!sens.length && <p style={{ fontSize: 14 }}>No operational details, uncharged suspects, victims, minors or personal data found.</p>}
                      {sens.map((s) => {
                        const v = cd.decisions[s.id];
                        return (
                          <div key={s.id} className={`iss${v ? " res" : ""}`}>
                            <b>
                              <Icon name={v ? "check" : "alert"} />
                              {s.title}
                            </b>
                            <p>{v === "fixed" ? "Fixed in the story." : v === "ignored" ? "Ignored by the editor. Recorded in the audit log." : s.explanation}</p>
                            {!published && (
                              <div className="acts">
                                {v ? (
                                  <button className="mini" onClick={() => set({ decisions: { ...cd.decisions, [s.id]: undefined as never } }, `Undid sensitivity decision: ${s.title}`)}>
                                    Undo
                                  </button>
                                ) : (
                                  <>
                                    <button className="mini pri" onClick={() => set({ decisions: { ...cd.decisions, [s.id]: "fixed" } }, `Applied AI fix: ${s.fixLabel}`)}>
                                      {s.fixLabel}
                                    </button>
                                    <button className="mini" onClick={() => set({ decisions: { ...cd.decisions, [s.id]: "ignored" } }, `Ignored a sensitivity flag: ${s.title}`)}>
                                      Ignore
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="blk">
                      <h4>
                        House style<span className={`n ${styleOpen ? "yel" : "ok"}`}>{styleOpen ? `${styleOpen} fix${styleOpen === 1 ? "" : "es"}` : rev.style.length ? "Applied" : "No fixes"}</span>
                      </h4>
                      <div style={{ display: "grid", gap: 8 }}>
                        {rev.style.map((f) => (
                          <div key={f.id} className="fix">
                            <s>{f.find}</s>
                            <Icon name="arrow" style={{ width: 14, height: 14 }} />
                            <ins>{f.replace || "(remove)"}</ins>
                            {cd.styleDone[f.id] ? (
                              <span className="mini ok">
                                <Icon name="check" /> Applied
                              </span>
                            ) : (
                              <button className="mini" disabled={published} onClick={() => set({ styleDone: { ...cd.styleDone, [f.id]: true } }, `Applied house style fix: "${f.find}" to "${f.replace}"`)}>
                                Apply
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {!rev.style.length && <p style={{ fontSize: 14 }}>Matches house style.</p>}
                    </div>
                    <HeadlineBlock rev={rev} cd={cd} disabled={published} onPick={(i) => set({ headline: i })} />
                    {rev.hausa && (
                      <div className="blk">
                        <h4>
                          <Icon name="globe" style={{ width: 16, height: 16, color: "var(--green)" }} />
                          Hausa headline<span className="n yel">Needs review</span>
                        </h4>
                        <div className="tr">{rev.hausa}</div>
                        <p className="ai-note" style={{ marginTop: 8 }}>
                          Draft of the recommended headline. A Hausa speaker must check it before it is used. Other languages are in the Translate tab.
                        </p>
                      </div>
                    )}
                  </>
                )}
                {tab === "headlines" && <HeadlineBlock rev={rev} cd={cd} disabled={published} onPick={(i) => set({ headline: i })} />}
                {tab === "translate" && (
                  <div className="blk">
                    <h4>
                      <Icon name="globe" style={{ width: 16, height: 16, color: "var(--green)" }} />
                      Headline translation<span className="n yel">AI draft, needs review</span>
                    </h4>
                    <div className="tr" aria-live="polite">
                      {trBusy && !(`${lang}|${headline}` in tr) ? <span className="skel" style={{ width: "80%" }} /> : (tr[`${lang}|${headline}`] ?? "The translation service isn't available right now. Try again in a moment.")}
                    </div>
                    <div className="langs">
                      {LANGS.filter((l) => l.id !== "en").map((l) => (
                        <button key={l.id} className={lang === l.id ? "on" : ""} onClick={() => setLang(l.id)}>
                          {l.name}
                        </button>
                      ))}
                    </div>
                    <p className="ai-note" style={{ marginTop: 10 }}>
                      Names, numbers and dates are kept exact. Official and sensitive messages always need a reviewed translation.
                    </p>
                  </div>
                )}
                {tab === "seo" && (
                  <>
                    <div className="blk">
                      <h4>Search title</h4>
                      <p>{rev.seo.title}</p>
                    </div>
                    <div className="blk">
                      <h4>Meta description</h4>
                      <p>{rev.seo.description}</p>
                    </div>
                    {rev.altText.length > 0 && (
                      <div className="blk">
                        <h4>Photo alt text</h4>
                        <ul className="bullets" style={{ display: "grid", gap: 6, fontSize: 14, paddingLeft: 18 }}>
                          {rev.altText.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            <div className="ai-ft">
              <p>
                <Icon name="spark" />
                These are AI suggestions. Nothing is published until an editor approves it.
              </p>
              {published ? (
                <div className="row">
                  <Link className="btn btn-sm btn-yellow" href="/" target="_blank">
                    <Icon name="home" /> See it on the homepage
                  </Link>
                </div>
              ) : (
                <>
                  <div className="row">
                    <button
                      className="btn btn-line btn-sm"
                      disabled={a.status === "returned"}
                      onClick={() => {
                        act.returnStory(a.id, a.title);
                        toast("Returned to the reporter with notes");
                      }}
                    >
                      Return to reporter
                    </button>
                    <button className="btn btn-sm btn-indigo" disabled={!rev || open > 0 || !canPublish || a.status === "returned"} onClick={publish}>
                      Approve and publish
                    </button>
                  </div>
                  {rev && open > 0 && <div className="hint">Fix the {issueLabel(open)} to approve.</div>}
                  {rev && open === 0 && !canPublish && <div className="hint">Only an editor can approve and publish.</div>}
                  {rev && open === 0 && canPublish && a.status === "submitted" && <div className="hint ok">Ready to publish.</div>}
                  {rev?.live && (
                    <button className="mini" style={{ marginTop: 10 }} onClick={() => act.clearReview(a.id, a.title)}>
                      <Icon name="refresh" /> Check again
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function HeadlineBlock({ rev, cd, onPick, disabled }: { rev: Review; cd: CopyDeskState; onPick: (i: number) => void; disabled?: boolean }) {
  return (
    <div className="blk">
      <h4>Headline options</h4>
      <div className="hl" role="radiogroup" aria-label="Headline options">
        {rev.headlines.map((h, i) => (
          <label key={`${i}-${h.text}`} className={cd.headline === i ? "on" : ""}>
            <input type="radio" name="headline" checked={cd.headline === i} disabled={disabled} onChange={() => onPick(i)} />
            <span className="rd" />
            <span>
              {h.text}
              {h.note && <small>{h.note}</small>}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
