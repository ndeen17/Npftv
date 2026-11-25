"use client";

import { useState } from "react";
import { DEMO_SCAM_SMS, scamCheck, type ScamResult } from "@/lib/ai";
import { aiOpts, askAI } from "@/lib/ai-client";
import { useDemo } from "@/lib/store";
import { Icon } from "../Icon";

const VERDICT = {
  very_likely_scam: { label: "Very likely a scam", cls: "" },
  possibly_scam: { label: "Possibly a scam", cls: "maybe" },
  no_obvious_signs: { label: "No obvious warning signs", cls: "ok" },
} as const;

export function ScamChecker({ id }: { id?: string }) {
  const { state } = useDemo();
  const [text, setText] = useState(DEMO_SCAM_SMS);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<ScamResult | null>(null);

  async function check() {
    if (!text.trim()) return;
    setBusy(true);
    setRes(null);
    const msg = text.trim().slice(0, 1000);
    // The demo-script SMS always gets the reviewed scripted answer; anything else goes to the live model.
    const { data: r } = await askAI<ScamResult>("scam-check", { message: msg }, () => scamCheck(msg), { ...aiOpts(state), forceScripted: msg === DEMO_SCAM_SMS });
    setRes(r);
    setBusy(false);
  }

  const v = res ? VERDICT[res.verdict] : null;

  return (
    <div className="scam" id={id}>
      <span className="tag tag-ai">
        <Icon name="spark" style={{ width: 14, height: 14 }} /> AI scam checker
      </span>
      <h2>Is this message a scam?</h2>
      <p>Paste a text, WhatsApp or email message. We&apos;ll point out the warning signs in plain language. Nothing you paste is stored.</p>
      <textarea aria-label="Message to check" value={text} maxLength={1000} onChange={(e) => setText(e.target.value)} placeholder="Paste the message here" />
      <div className="scam-row">
        <button className="btn btn-yellow" onClick={check} disabled={busy || !text.trim()}>
          <Icon name="shield" /> {busy ? "Checking…" : "Check message"}
        </button>
        <small>AI can make mistakes. If in doubt, call your bank on the number on your card.</small>
      </div>
      <div aria-live="polite">
        {busy && (
          <div className="result maybe" style={{ display: "grid", gap: 10 }}>
            <span className="skel" style={{ width: "40%", height: 18 }} />
            <span className="skel" style={{ width: "90%" }} />
            <span className="skel" style={{ width: "80%" }} />
            <span className="skel" style={{ width: "70%" }} />
          </div>
        )}
        {res && v && (
          <div className={`result ${v.cls}`}>
            <div className="result-hd">
              <b>{v.label}</b>
              {res.signs.length > 0 && (
                <span className="tag" style={{ background: "#fde3e5", color: "var(--red)" }}>
                  {res.signs.length} warning sign{res.signs.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
            {res.signs.length > 0 && (
              <ul>
                {res.signs.map((s) => (
                  <li key={s}>
                    <Icon name="alert" />
                    {s}
                  </li>
                ))}
              </ul>
            )}
            <p className="todo" style={res.signs.length ? undefined : { borderTop: 0, marginTop: 0, paddingTop: 0 }}>
              <b>What to do:</b> {res.whatToDo}
            </p>
            <p className="todo" style={{ fontSize: 13 }}>
              If someone is threatening you or you are in danger now, call <b>112</b>. NPFTV is not an emergency service.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
