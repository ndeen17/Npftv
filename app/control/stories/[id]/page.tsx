"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { categories, categoryById, KANO_ID } from "@/data/articles";
import { stateById, states } from "@/data/places";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { TopBar } from "@/components/control/Shell";
import { LANGS, runAI, translate, type Lang } from "@/lib/ai";
import { canPublishRoles, currentBody, review, type Review } from "@/lib/copydesk";
import { defaultCopyDesk, useActions, useDemo, type CopyDeskState } from "@/lib/store";
import { isoTime } from "@/lib/time";
import type { ArticleStatus } from "@/lib/types";

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

/** Highlight the flagged phrases in the Kano story, or show them as fixed. */
function Para({ i, text, cd, kano }: { i: number; text: string; cd: CopyDeskState; kano: boolean }) {
  if (!kano) return <>{text}</>;
  const marks: { find: string; cls: string }[] = [];
  if (i === 2) {
    if (!cd.style) marks.push({ find: "have been been", cls: "sty" });
    if (cd.op === null) marks.push({ find: "the Sabon Gari market axis, where a team is currently tracking a suspected kidnapping gang", cls: "sens" });
    if (cd.op === "fixed") marks.push({ find: "to support an ongoing operation in the state", cls: "done" });
    if (cd.style) marks.push({ find: "have been deployed", cls: "done" });
  }
  if (i === 3) {
    if (cd.suspect === null) marks.push({ find: "A suspect, Sani G., 34, was arrested on Friday", cls: "sens" });
    if (cd.suspect === "fixed") marks.push({ find: "A 34-year-old man", cls: "done" });
  }
  let parts: (string | ReactNode)[] = [text];
  for (const m of marks) {
    parts = parts.flatMap((p, k): (string | ReactNode)[] => {
      if (typeof p !== "string" || !p.includes(m.find)) return [p];
      const [a, ...rest] = p.split(m.find);
      return [a, <mark key={`${m.cls}-${k}`} className={m.cls}>{m.find}</mark>, rest.join(m.find)];
    });
  }
  return <>{parts}</>;
}

export default function StoryEditor() {
  const { id } = useParams<{ id: string }>();
  const { state, role, hydrated, now } = useDemo();
  const act = useActions();
  const toast = useToast();
  const a = state.articles.find((x) => x.id === id);
  const cd = { ...defaultCopyDesk, ...state.copyDesk[id] };
  const [tab, setTab] = useState<"review" | "headlines" | "translate" | "seo">("review");
  const [rev, setRev] = useState<Review | null>(null);
  const [lang, setLang] = useState<Lang>("ha");
  const [title, setTitle] = useState("");

  const isReporter = role === "reporter";
  const canPublish = !!role && canPublishRoles.includes(role);
  const showDesk = !!a && !isReporter && a.status !== "draft";

  useEffect(() => {
    if (a) setTitle(a.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a?.id, a?.title]);

  // Run the AI review when an editor opens a submitted story.
  useEffect(() => {
    if (!a || !showDesk) return;
    let live = true;
    setRev(null);
    runAI(() => review(a), state.aiInstant).then((r) => live && setRev(r));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a?.id, showDesk]);

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

  const kano = a.id === KANO_ID;
  const body = currentBody(a, cd);
  const st = stateById(a.state);
  const sens = rev?.sensitivity ?? [];
  const open = sens.filter((s) => cd[s.key] === null).length;
  const styleOpen = rev ? rev.style.length - (cd.style ? rev.style.length : 0) : 0;
  const headline = rev?.headlines[cd.headline]?.text ?? a.title;
  const published = a.status === "published";
  const [statusLabel, statusCls] = STATUS[a.status];
  const sub = state.submissions.find((s) => s.articleId === a.id);
  const log = state.audit
    .filter((e) => e.target && (e.target === a.title || e.target === headline || (kano && e.target.startsWith("Kano"))))
    .slice()
    .reverse();

  const set = (patch: Partial<CopyDeskState>, audit?: string) => act.setCopyDesk(a.id, patch, audit, a.title);

  function publish() {
    act.publishStory(a!.id, { title: headline, body, summary: rev?.summary ?? a!.summary });
    toast("Published. It's now on the homepage and at the top of the ticker.");
  }

  return (
    <>
      <TopBar crumbs={[{ href: isReporter ? "/control/stories" : "/control/submissions", label: isReporter ? "My stories" : "Submissions" }, st ? `${st.name} State Command` : categoryById(a.category)?.name ?? "Story", a.title]} />
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
          {isReporter && (a.status === "draft" || a.status === "returned") ? (
            <textarea className="ed-title" rows={2} value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Headline" onBlur={() => title !== a.title && act.saveStory(a.id, { title }, title)} />
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
          <div className="body">
            {body.map((p, i) => (
              <p key={i}>
                <span className="pn">{i + 1}</span>
                <Para i={i} text={p} cd={cd} kano={kano && showDesk && !published} />
              </p>
            ))}
          </div>
          <div className="log">
            <h4>Activity</h4>
            <ul>
              {log.map((e) => (
                <li key={e.id}>
                  <b>{isoTime(e.at)}</b>
                  {e.action} ({e.who})
                </li>
              ))}
              {!log.length && a.status === "draft" && (
                <li>
                  <b>{isoTime(now.toISOString())}</b>Draft saved on this device
                </li>
              )}
            </ul>
          </div>
        </div>

        {!showDesk ? (
          <div className="pnl" style={{ padding: 20, display: "grid", gap: 14, alignContent: "start" }}>
            <h3 style={{ color: "var(--indigo)", fontSize: 19 }}>{a.status === "draft" || a.status === "returned" ? "Ready to send?" : "Sent to the newsroom"}</h3>
            {a.status === "draft" || a.status === "returned" ? (
              <>
                <p style={{ fontSize: 14.5, color: "var(--muted)" }}>Your story and {a.photos?.length ?? 0} photos go to the newsroom. An AI review runs first, then an editor checks and approves it. Nothing is published without an editor.</p>
                <button
                  className="btn btn-indigo"
                  style={{ justifyContent: "center" }}
                  onClick={() => {
                    act.submitStory(a.id, a.title);
                    toast("Submitted to the newsroom with 3 photos");
                  }}
                >
                  <Icon name="send" /> Submit for review
                </button>
              </>
            ) : (
              <p style={{ fontSize: 14.5, color: "var(--muted)" }}>{published ? "An editor approved and published your story." : "An editor will review your story. You'll be told if it's returned with changes."}</p>
            )}
            <p className="ai-note">
              <Icon name="spark" /> AI checks for sensitive details (ongoing operations, suspects not yet charged, victims and minors) before an editor sees it.
            </p>
          </div>
        ) : (
          <div className="pnl ai">
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
                        const v = cd[s.key];
                        return (
                          <div key={s.key} className={`iss${v ? " res" : ""}`}>
                            <b>
                              <Icon name={v ? "check" : "alert"} />
                              {s.title}
                            </b>
                            <p>{v === "fixed" ? "Fixed in the story." : v === "ignored" ? "Ignored by the editor. Recorded in the audit log." : s.where}</p>
                            {!published && (
                              <div className="acts">
                                {v ? (
                                  <button className="mini" onClick={() => set({ [s.key]: null } as Partial<CopyDeskState>, `Undid sensitivity decision: ${s.title}`)}>
                                    Undo
                                  </button>
                                ) : (
                                  <>
                                    <button className="mini pri" onClick={() => set({ [s.key]: "fixed" } as Partial<CopyDeskState>, `Applied AI fix: ${s.fixLabel}`)}>
                                      {s.fixLabel}
                                    </button>
                                    <button className="mini" onClick={() => set({ [s.key]: "ignored" } as Partial<CopyDeskState>, `Ignored a sensitivity flag: ${s.title}`)}>
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
                        House style<span className={`n ${styleOpen ? "yel" : "ok"}`}>{styleOpen ? `${styleOpen} fix` : rev.style.length ? "Applied" : "No fixes"}</span>
                      </h4>
                      {rev.style.map((f) => (
                        <div key={f.find} className="fix">
                          <s>{f.find}</s>
                          <Icon name="arrow" style={{ width: 14, height: 14 }} />
                          <ins>{f.replace}</ins>
                          {cd.style ? (
                            <span className="mini ok">
                              <Icon name="check" /> Applied
                            </span>
                          ) : (
                            <button className="mini" disabled={published} onClick={() => set({ style: true }, `Applied house style fix: "${f.find}" to "${f.replace}"`)}>
                              Apply
                            </button>
                          )}
                        </div>
                      ))}
                      {!rev.style.length && <p style={{ fontSize: 14 }}>Matches house style.</p>}
                    </div>
                    <HeadlineBlock rev={rev} cd={cd} disabled={published} onPick={(i) => set({ headline: i })} />
                    {rev.hausa && (
                      <div className="blk">
                        <h4>
                          <Icon name="globe" style={{ width: 16, height: 16, color: "var(--green)" }} />
                          Hausa headline<span className="n yel">Needs review</span>
                        </h4>
                        <div className="tr">{translate(headline, "ha") ?? rev.hausa}</div>
                        <p className="ai-note" style={{ marginTop: 8 }}>Draft only. A Hausa speaker must check this before it is used.</p>
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
                    <div className="tr">{translate(headline, lang) ?? "A draft for this language isn't prepared in the demo. In the real product, it is generated here for a fluent speaker to check."}</div>
                    <div className="langs">
                      {LANGS.filter((l) => l.id !== "en").map((l) => (
                        <button key={l.id} className={lang === l.id ? "on" : ""} onClick={() => setLang(l.id)}>
                          {l.name}
                        </button>
                      ))}
                    </div>
                    <p className="ai-note" style={{ marginTop: 10 }}>Names, numbers and dates are kept exact. Official and sensitive messages always need a reviewed translation.</p>
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
                        <ul style={{ display: "grid", gap: 6, fontSize: 14, paddingLeft: 18 }}>
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
                  {rev && open > 0 && (
                    <div className="hint">
                      Fix the {open} sensitivity issue{open === 1 ? "" : "s"} to approve.
                    </div>
                  )}
                  {rev && open === 0 && !canPublish && <div className="hint">Only an editor can approve and publish.</div>}
                  {rev && open === 0 && canPublish && a.status === "submitted" && <div className="hint ok">Ready to publish.</div>}
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
          <label key={h.text} className={cd.headline === i ? "on" : ""}>
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
