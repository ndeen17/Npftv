"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES, categoryInfo, type ReportCategory } from "@/data/agencies";
import { LGAS } from "@/data/lgas";
import { stateById, states } from "@/data/places";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { PageHead } from "@/components/site/bits";
import { RoleNote } from "@/components/site/civic";
import { aiOpts, askAI } from "@/lib/ai-client";
import { REPORT_EXAMPLE, reportIntake, reportTriage, type ReportIntake, type ReportTriage } from "@/lib/reporting";
import { useActions, useDemo } from "@/lib/store";

type Step = "safety" | "danger" | "describe" | "review" | "sent";
const MY_REPORTS = "npftv-my-reports";
const SENT_TIMES = "npftv-report-times";
const LIMIT_PER_HOUR = 3;

function readList(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}
function writeList(key: string, v: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
}

export default function ReportPage() {
  const { state } = useDemo();
  const act = useActions();
  const toast = useToast();
  const [step, setStep] = useState<Step>("safety");
  const [text, setText] = useState("");
  const [hint, setHint] = useState<ReportCategory | undefined>();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<ReportIntake | null>(null);
  const [answer, setAnswer] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState(true);
  const [contact, setContact] = useState({ name: "", phone: "" });
  const [consent, setConsent] = useState(false);
  const [sentRef, setSentRef] = useState<string | null>(null);
  const [limited, setLimited] = useState(false);

  useEffect(() => {
    const hourAgo = Date.now() - 3600_000;
    setLimited(readList(SENT_TIMES).filter((t) => Number(t) > hourAgo).length >= LIMIT_PER_HOUR);
  }, [step]);

  async function organise() {
    const t = text.trim();
    if (t.length < 15) return;
    setBusy(true);
    const { data } = await askAI<ReportIntake>("report-intake", { text: t.slice(0, 2000) }, () => reportIntake(t, hint), aiOpts(state));
    setForm({ ...data, category: hint ?? data.category });
    setBusy(false);
    setStep("review");
  }

  async function send() {
    if (!form || !consent) return;
    const details = [text.trim(), answer.trim() ? `${form.followUp} ${answer.trim()}` : ""].filter(Boolean).join("\n\n");
    const rp = {
      category: form.category,
      summary: form.summary.trim() || text.trim().slice(0, 140),
      details,
      state: form.state,
      lga: form.lga.trim(),
      landmark: form.landmark.trim(),
      when: form.when.trim(),
      photos,
      anonymous,
      contact: anonymous || (!contact.name.trim() && !contact.phone.trim()) ? undefined : { name: contact.name.trim(), phone: contact.phone.trim() },
    };
    const ref = act.submitReport(rp);
    writeList(MY_REPORTS, [ref, ...readList(MY_REPORTS)].slice(0, 20));
    writeList(SENT_TIMES, [String(Date.now()), ...readList(SENT_TIMES)].slice(0, 10));
    setSentRef(ref);
    setStep("sent");
    window.scrollTo({ top: 0, behavior: "smooth" });
    // AI triage for the newsroom (never shown to the citizen).
    const { data } = await askAI<ReportTriage>("report-triage", { category: rp.category, summary: rp.summary, details: rp.details, place: [rp.landmark, rp.lga, stateById(rp.state)?.name].filter(Boolean).join(", ") }, () => reportTriage(rp), aiOpts(state));
    act.setReportTriage(ref, data, rp.summary);
  }

  const cat = form ? categoryInfo(form.category) : undefined;
  const stepNo = { safety: 1, danger: 1, describe: 2, review: 3, sent: 4 }[step];

  return (
    <>
      <PageHead title="Send a report to NPFTV" intro="Tell our newsroom what's happening near you: a flood, a fire, a crash, a community event. Verified reports help us warn and inform the public." crumbs={[{ href: "/safety", label: "Safety" }, { label: "Send a report" }]} />

      <section className="sec" style={{ paddingTop: 36 }}>
        <div className="wrap" style={{ maxWidth: 860 }}>
          <RoleNote>
            <b>This is not a police report, and NPFTV can&apos;t send help.</b> We&apos;re the police&apos;s television and news service: we use reports for news and public awareness. If anyone is in danger, call <a href="tel:112">112</a>. To report a crime, go to your nearest police station.
          </RoleNote>

          {step !== "sent" && (
            <ol className="wiz-steps" aria-label="Progress">
              {["Safety", "What's happening", "Check and send"].map((l, i) => (
                <li key={l} className={stepNo > i + 1 ? "done" : stepNo === i + 1 ? "on" : ""} aria-current={stepNo === i + 1 ? "step" : undefined}>
                  <span>{stepNo > i + 1 ? <Icon name="check" /> : i + 1}</span>
                  {l}
                </li>
              ))}
            </ol>
          )}

          {step === "safety" && (
            <div className="wiz-card">
              <h2>Is anyone in danger right now?</h2>
              <p>Danger to life comes first. Our newsroom can&apos;t respond to emergencies.</p>
              <div className="choice-row">
                <button className="choice danger" onClick={() => setStep("danger")}>
                  <Icon name="alert" />
                  <span>
                    <b>Yes, someone is in danger</b>
                    <small>Show me who to call now</small>
                  </span>
                </button>
                <button className="choice" onClick={() => setStep("describe")}>
                  <Icon name="check" />
                  <span>
                    <b>No, nobody is in immediate danger</b>
                    <small>Continue to my report</small>
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === "danger" && (
            <div className="wiz-card">
              <h2>Call for help first</h2>
              <a className="btn btn-red big-call" href="tel:112">
                <Icon name="phone" /> Call 112 now
              </a>
              <p style={{ color: "var(--muted)" }}>112 is free on every network and connects you to the police, fire and ambulance services.</p>
              <ul className="who-list">
                <li>
                  <b>Road crash:</b> FRSC on <a href="tel:122">122</a>, or 112
                </li>
                <li>
                  <b>Fire, flood, building collapse:</b> 112 (Fire Service, NEMA and your State Emergency Management Agency)
                </li>
                <li>
                  <b>Crime happening now:</b> 112, or your nearest police station
                </li>
              </ul>
              <p>When you and others are safe, you can tell our newsroom so we can warn people nearby.</p>
              <button className="btn btn-line" onClick={() => setStep("describe")}>
                I&apos;m safe now. Continue to my report <Icon name="arrow" />
              </button>
            </div>
          )}

          {step === "describe" && (
            <div className="wiz-card">
              {limited ? (
                <>
                  <h2>You&apos;ve sent several reports recently</h2>
                  <p>To keep the service fair, you can send up to {LIMIT_PER_HOUR} reports an hour. Please try again later. If anyone is in danger, call 112.</p>
                </>
              ) : (
                <>
                  <h2>What&apos;s happening?</h2>
                  <p>Describe it in your own words: what, where (the nearest landmark or junction helps) and when. Any language is fine.</p>
                  <div className="chips" role="group" aria-label="Type of report (optional)" style={{ margin: "4px 0 12px" }}>
                    {CATEGORIES.map((c) => (
                      <button key={c.id} className={`chip${hint === c.id ? " on" : ""}`} onClick={() => setHint(hint === c.id ? undefined : c.id)} aria-pressed={hint === c.id}>
                        {c.chip}
                      </button>
                    ))}
                  </div>
                  <label htmlFor="what" className="sr">
                    What&apos;s happening
                  </label>
                  <textarea id="what" className="wiz-text" value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} placeholder="For example: water is entering houses on our street near the Ganaja junction in Lokoja…" />
                  <div className="wiz-acts">
                    <button className="btn btn-indigo" onClick={organise} disabled={busy || text.trim().length < 15}>
                      <Icon name="spark" /> {busy ? "Organising your report…" : "Next: check my report"}
                    </button>
                    {!text && (
                      <button className="btn btn-line btn-sm" onClick={() => setText(REPORT_EXAMPLE)}>
                        Try an example
                      </button>
                    )}
                    <button className="btn btn-sm" style={{ background: "none", color: "var(--muted)" }} onClick={() => setStep("safety")}>
                      Back
                    </button>
                  </div>
                  <p className="ai-note" style={{ marginTop: 10 }}>
                    <Icon name="spark" /> AI organises your words into a report you can check and edit before sending.
                  </p>
                </>
              )}
            </div>
          )}

          {step === "review" && form && cat && (
            <div className="wiz-card">
              <h2>Check your report</h2>
              {form.isEmergency && (
                <div className="emergency-strip" style={{ marginBottom: 14 }}>
                  <span className="es-ic">
                    <Icon name="phone" />
                  </span>
                  <p>
                    <b>It sounds like someone may be in danger.</b> Call 112 first.
                  </p>
                  <a className="btn btn-red btn-sm" href="tel:112">
                    Call 112
                  </a>
                </div>
              )}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="field md:col-span-2">
                  What kind of report
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ReportCategory, followUp: categoryInfo(e.target.value).followUp })}>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field md:col-span-2">
                  Summary
                  <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} maxLength={200} />
                </label>
                <label className="field">
                  State
                  <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value, lga: "" })}>
                    <option value="">Choose a state</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id === "FC" ? "FCT (Abuja)" : s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Local government area
                  {LGAS[form.state] ? (
                    <select value={form.lga} onChange={(e) => setForm({ ...form, lga: e.target.value })}>
                      <option value="">Choose an LGA</option>
                      {LGAS[form.state].map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  ) : (
                    <input value={form.lga} onChange={(e) => setForm({ ...form, lga: e.target.value })} placeholder="e.g. Kano Municipal" />
                  )}
                </label>
                <label className="field">
                  Nearest landmark or junction
                  <input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} placeholder="e.g. opposite the First Bank" />
                </label>
                <label className="field">
                  When
                  <input value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value })} placeholder="e.g. about an hour ago" />
                </label>
                {form.followUp && (
                  <label className="field md:col-span-2">
                    {form.followUp} <small>(optional)</small>
                    <input value={answer} onChange={(e) => setAnswer(e.target.value)} />
                  </label>
                )}
                <label className="field md:col-span-2">
                  Photos or video <small>(optional; in this demo files are not uploaded)</small>
                  <input type="file" accept="image/*,video/*" multiple onChange={(e) => setPhotos(Array.from(e.target.files ?? []).map((f) => f.name).slice(0, 5))} />
                  {photos.length > 0 && <small>{photos.join(", ")}</small>}
                </label>
              </div>

              <fieldset className="contact-box">
                <legend>Your details</legend>
                <label className="check">
                  <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} /> Send anonymously
                </label>
                {!anonymous && (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2" style={{ marginTop: 10 }}>
                    <label className="field">
                      Name <small>(optional)</small>
                      <input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} autoComplete="name" />
                    </label>
                    <label className="field">
                      Phone, so the newsroom can check details <small>(optional)</small>
                      <input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} inputMode="tel" autoComplete="tel" />
                    </label>
                  </div>
                )}
                <label className="check" style={{ marginTop: 12 }}>
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>
                    I understand NPFTV uses reports only for news and public awareness, and can&apos;t send help. Contact details are never published (Nigeria Data Protection Act 2023).
                  </span>
                </label>
              </fieldset>

              <div className="wiz-acts">
                <button className="btn btn-indigo" onClick={send} disabled={!consent || !form.summary.trim() || !form.state}>
                  <Icon name="send" /> Send to the newsroom
                </button>
                <button className="btn btn-line btn-sm" onClick={() => setStep("describe")}>
                  Back
                </button>
              </div>
              {(!form.state || !consent) && <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>{!form.state ? "Choose a state to continue." : "Tick the box above to continue."}</p>}
            </div>
          )}

          {step === "sent" && sentRef && form && cat && (
            <div className="wiz-card sent">
              <span className="sent-ic">
                <Icon name="check" />
              </span>
              <h2>Sent to the NPFTV newsroom</h2>
              <div className="ref-box">
                <span>Your reference</span>
                <b>{sentRef}</b>
                <button
                  className="mini"
                  onClick={() => {
                    navigator.clipboard?.writeText(sentRef).catch(() => {});
                    toast("Reference copied");
                  }}
                >
                  <Icon name="copy" /> Copy
                </button>
              </div>
              <h3>What happens next</h3>
              <ol className="num-steps">
                <li>
                  <span>1</span>
                  <p>A newsroom editor reads your report.</p>
                </li>
                <li>
                  <span>2</span>
                  <p>We may check the facts with the state police command&apos;s public relations office.</p>
                </li>
                <li>
                  <span>3</span>
                  <p>If it helps the public, we may publish an alert, a story or mention it on air. We never publish your contact details.</p>
                </li>
              </ol>
              {cat.responders.length > 0 && (
                <div className="channel" style={{ marginTop: 18 }}>
                  <h3>For actual help, contact</h3>
                  <ul className="bullets" style={{ paddingLeft: 18, display: "grid", gap: 6 }}>
                    {cat.responders.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                    {cat.call.map((c) => (
                      <a key={c.tel} className="btn btn-red btn-sm" href={`tel:${c.tel}`}>
                        <Icon name="phone" /> {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {cat.safety.length > 0 && (
                <div className="channel" style={{ marginTop: 14, borderTop: "4px solid var(--yellow)" }}>
                  <h3>Stay safe</h3>
                  <ul className="bullets" style={{ paddingLeft: 18, display: "grid", gap: 6 }}>
                    {cat.safety.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <a className="btn btn-line btn-sm" style={{ alignSelf: "flex-start", marginTop: 6 }} href={`https://wa.me/?text=${encodeURIComponent(`${cat.label} safety advice (NPFTV):\n${cat.safety.map((s) => `• ${s}`).join("\n")}\nIn an emergency, call 112.`)}`} target="_blank" rel="noopener noreferrer">
                    <Icon name="share" /> Share this safety advice on WhatsApp
                  </a>
                </div>
              )}
              <div className="wiz-acts" style={{ marginTop: 20 }}>
                <Link className="btn btn-indigo" href={`/track?ref=${sentRef}`}>
                  Track my report <Icon name="arrow" />
                </Link>
                <button
                  className="btn btn-line"
                  onClick={() => {
                    setStep("safety");
                    setText("");
                    setForm(null);
                    setAnswer("");
                    setPhotos([]);
                    setConsent(false);
                    setHint(undefined);
                  }}
                >
                  Send another report
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
