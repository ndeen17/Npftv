"use client";

import Link from "next/link";
import { useState } from "react";
import { complaintChannels, complaintChecklist, complaintSteps } from "@/data/rights";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { PageHead } from "@/components/site/bits";
import { EmergencyStrip, LegalNote, RoleNote, SectionTitle } from "@/components/site/civic";
import { COMPLAINT_EXAMPLE, complaintHelper, type ComplaintChannel, type ComplaintDraft, type ComplaintSectionId } from "@/lib/ai";
import { aiOpts, askAI } from "@/lib/ai-client";
import { useDemo } from "@/lib/store";

const CHANNEL_NAME: Record<ComplaintChannel, string> = {
  cru: "NPF Complaint Response Unit",
  psc: "Police Service Commission",
  nhrc: "National Human Rights Commission",
  courts: "a lawyer or the Legal Aid Council",
};

function draftText(d: ComplaintDraft) {
  return complaintChecklist
    .filter((c) => d.sections[c.id as ComplaintSectionId]?.trim())
    .map((c) => `${c.label.toUpperCase()}\n${d.sections[c.id as ComplaintSectionId].trim()}`)
    .join("\n\n");
}

export default function ComplaintsPage() {
  const { state } = useDemo();
  const toast = useToast();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<ComplaintDraft | null>(null);

  async function build() {
    const t = text.trim();
    if (t.length < 20) return;
    setBusy(true);
    setDraft(null);
    const { data } = await askAI<ComplaintDraft>("complaint-helper", { text: t.slice(0, 3000) }, () => complaintHelper(t), aiOpts(state));
    setDraft(data);
    setBusy(false);
  }

  const setSection = (id: ComplaintSectionId, v: string) => setDraft((d) => (d ? { ...d, sections: { ...d.sections, [id]: v } } : d));
  const full = draft ? `Complaint about a police officer\n\n${draftText(draft)}` : "";

  return (
    <>
      <PageHead
        title="Complaints about officers"
        intro="If an officer asked you for money, mistreated you or broke the rules, you can complain. Here's who handles complaints, what happens, and how to prepare yours."
        crumbs={[{ href: "/rights", label: "Your rights" }, { label: "Complaints about officers" }]}
      />

      <section className="sec" style={{ paddingTop: 40, paddingBottom: 0 }}>
        <div className="wrap" style={{ display: "grid", gap: 14 }}>
          <RoleNote>
            <b>NPFTV can&apos;t take or investigate complaints.</b> We&apos;re the police&apos;s television and news service. This page explains how complaints are handled and who to contact, and helps you write yours down. You send it yourself. In an emergency, call <a href="tel:112">112</a>.
          </RoleNote>
          <EmergencyStrip />
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <SectionTitle title="Who to contact" intro="Start with the Complaint Response Unit. The others can help if you get no response or the matter is serious." />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {complaintChannels.map((c, i) => (
              <div key={c.name} className={`channel${i === 0 ? " first" : ""}`}>
                {i === 0 && (
                  <span className="tag tag-feat" style={{ alignSelf: "flex-start" }}>
                    Start here
                  </span>
                )}
                <h3>{c.name}</h3>
                <p>{c.handles}</p>
                <small>
                  <Icon name="info" style={{ width: 14, height: 14 }} />
                  {c.contact}
                </small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionTitle title="What happens after you complain" intro="How the police and oversight bodies generally handle a complaint." />
          <ol className="stepper">
            {complaintSteps.map((s) => (
              <li key={s.title}>
                <b>{s.title}</b>
                {s.text}
              </li>
            ))}
          </ol>
          <p style={{ marginTop: 14, color: "var(--muted)", fontSize: 14.5 }}>
            Officers should not threaten or punish anyone for complaining. If you are threatened, include it in your complaint, and in an emergency call 112.
          </p>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-start">
          <div>
            <SectionTitle title="Prepare your complaint" intro="A complaint with clear details is easier to act on. Gather what you can:" />
            <ul className="checklist">
              {complaintChecklist.map((c) => (
                <li key={c.id}>
                  <Icon name="check" />
                  <span>
                    <b>{c.label}</b>
                    <small>{c.hint}</small>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="helper" id="helper">
            <span className="tag tag-ai">
              <Icon name="spark" style={{ width: 14, height: 14 }} /> AI helper
            </span>
            <h2>Help me write it down</h2>
            <p>Tell us what happened in your own words. We&apos;ll organise it into a clear complaint you can copy and send. Nothing is stored or sent to NPFTV.</p>
            <label className="sr" htmlFor="complaint-text">
              What happened
            </label>
            <textarea id="complaint-text" value={text} maxLength={3000} onChange={(e) => setText(e.target.value)} placeholder="For example: what happened, when and where, and anything you remember about the officer." />
            <div className="helper-row">
              <button className="btn btn-yellow" onClick={build} disabled={busy || text.trim().length < 20}>
                <Icon name="spark" /> {busy ? "Organising…" : "Organise my complaint"}
              </button>
              {!text && (
                <button className="btn btn-ghost btn-sm" onClick={() => setText(COMPLAINT_EXAMPLE)}>
                  Try an example
                </button>
              )}
              <small>{text.trim().length > 0 && text.trim().length < 20 ? "Add a little more detail." : "AI can make mistakes. Check every detail before you send it."}</small>
            </div>

            <div aria-live="polite">
              {busy && (
                <div className="draft" style={{ display: "grid", gap: 10 }}>
                  <span className="skel" style={{ width: "40%", height: 18 }} />
                  <span className="skel" />
                  <span className="skel" style={{ width: "85%" }} />
                  <span className="skel" style={{ width: "70%" }} />
                </div>
              )}
              {draft && !busy && (
                <div className="draft">
                  {draft.isEmergency && (
                    <div className="emergency-strip" style={{ marginBottom: 14 }}>
                      <span className="es-ic">
                        <Icon name="phone" />
                      </span>
                      <p>
                        <b>If you or someone else is in danger now, call 112 first.</b>
                      </p>
                      <a className="btn btn-red btn-sm" href="tel:112">
                        Call 112
                      </a>
                    </div>
                  )}
                  <div className="draft-hd">
                    <b>Your complaint, ready to send</b>
                    <span className="tag tag-soft">You can edit every part</span>
                  </div>
                  {draft.missing.length > 0 && (
                    <>
                      <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 6 }}>Add these if you can. They make a complaint stronger:</p>
                      <div className="missing-list">
                        {draft.missing.map((m) => (
                          <span key={m} className="tag tag-feat">
                            {complaintChecklist.find((c) => c.id === m)?.label}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  {complaintChecklist.map((c) => {
                    const id = c.id as ComplaintSectionId;
                    const v = draft.sections[id] ?? "";
                    return (
                      <div key={id} className={`draft-field${v ? "" : " missing"}`}>
                        <label htmlFor={`f-${id}`}>{c.label}</label>
                        <textarea id={`f-${id}`} rows={id === "what" ? 5 : 2} value={v} placeholder={c.hint} onChange={(e) => setSection(id, e.target.value)} />
                      </div>
                    );
                  })}
                  <div className="role-note" style={{ margin: "6px 0 14px", borderLeftColor: "var(--green)" }}>
                    <Icon name="send" />
                    <p>
                      <b>Send it to the {CHANNEL_NAME[draft.channel]}.</b> {draft.channelReason}
                    </p>
                  </div>
                  <div className="draft-acts">
                    <button
                      className="btn btn-indigo btn-sm"
                      onClick={() => {
                        navigator.clipboard?.writeText(full).catch(() => {});
                        toast("Complaint copied. Paste it into your message or email.");
                      }}
                    >
                      <Icon name="copy" /> Copy
                    </button>
                    <a className="btn btn-line btn-sm" href={`https://wa.me/?text=${encodeURIComponent(full)}`} target="_blank" rel="noopener noreferrer">
                      <Icon name="share" /> Share on WhatsApp
                    </a>
                    <a className="btn btn-line btn-sm" href={`mailto:?subject=${encodeURIComponent("Complaint about a police officer")}&body=${encodeURIComponent(full)}`}>
                      <Icon name="mail" /> Email
                    </a>
                  </div>
                  <p className="ai-note" style={{ marginTop: 12 }}>
                    <Icon name="spark" /> Written with AI from your words. Nothing was stored or sent to NPFTV. Check every detail before you send it.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link href="/rights" className="next-link">
              <span className="nl-ic">
                <Icon name="scale" />
              </span>
              <span>
                <b>Know your rights</b>
                <small>What officers can and can&apos;t do when they stop, search or arrest you.</small>
              </span>
              <Icon name="arrow" />
            </Link>
            <Link href="/rights/investigations" className="next-link">
              <span className="nl-ic">
                <Icon name="search" />
              </span>
              <span>
                <b>How investigations work</b>
                <small>From your report to court, and how to follow up.</small>
              </span>
              <Icon name="arrow" />
            </Link>
          </div>
          <LegalNote />
        </div>
      </section>
    </>
  );
}
