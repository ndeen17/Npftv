"use client";

import Link from "next/link";
import { useState } from "react";
import { guideById } from "@/data/public";
import { askNpftv, type AskResult } from "@/lib/ai";
import { aiOpts, askAI } from "@/lib/ai-client";
import { useDemo } from "@/lib/store";
import { Icon } from "./Icon";

const SUGGESTIONS = ["Someone called asking for my OTP. What should I do?", "How do I travel safely at night?", "How do I report a stolen phone?", "How can I protect my house while I travel?"];

/** Public safety assistant. Works on light (site) and dark (Stream) backgrounds. */
export function AskNpftv({ dark }: { dark?: boolean }) {
  const { state } = useDemo();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [thread, setThread] = useState<{ q: string; a: AskResult }[]>([]);

  async function ask(question: string) {
    const text = question.trim().slice(0, 500);
    if (!text) return;
    setBusy(true);
    setQ("");
    const { data: a } = await askAI<AskResult>("ask-npftv", { question: text }, () => askNpftv(text), aiOpts(state));
    setThread((t) => [...t, { q: text, a }]);
    setBusy(false);
  }

  const fg = dark ? "#e4def5" : "var(--ink)";
  const sub = dark ? "#a79dc7" : "var(--muted)";
  const box = dark ? { background: "#1a0e33", border: "1px solid var(--line-dark)" } : { background: "#fff", border: "1px solid var(--line)" };

  return (
    <div style={{ ...box, borderRadius: 12, padding: 20, color: fg }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span className="tag tag-ai">
          <Icon name="spark" style={{ width: 13, height: 13 }} /> AI
        </span>
        <h3 style={{ fontSize: 22, color: dark ? "#fff" : "var(--indigo)" }}>Ask NPFTV</h3>
      </div>
      <p style={{ color: sub, fontSize: 14.5, marginBottom: 14 }}>Public safety questions, answered from NPFTV&apos;s checked guides. Not an emergency service: if you&apos;re in danger now, call 112.</p>

      <div aria-live="polite" style={{ display: "grid", gap: 12, marginBottom: thread.length || busy ? 14 : 0 }}>
        {thread.map((t, i) => (
          <div key={i} style={{ display: "grid", gap: 8 }}>
            <div style={{ justifySelf: "end", background: dark ? "rgba(255,255,255,.08)" : "var(--paper)", borderRadius: "12px 12px 2px 12px", padding: "8px 12px", fontSize: 14.5, maxWidth: "85%" }}>{t.q}</div>
            <div
              style={{
                borderLeft: `4px solid ${t.a.isEmergency ? "var(--red)" : "var(--yellow)"}`,
                background: t.a.isEmergency ? (dark ? "rgba(208,31,46,.18)" : "#fff5f6") : dark ? "rgba(245,197,24,.06)" : "#fffbea",
                borderRadius: "0 8px 8px 0",
                padding: "10px 14px",
                fontSize: 14.5,
              }}
            >
              {t.a.isEmergency && <b style={{ display: "block", color: "var(--red)", fontFamily: "var(--slab)", fontSize: 18 }}>Call 112 now</b>}
              {t.a.answer}
              {t.a.sources.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 13, color: sub }}>
                  Source:{" "}
                  {t.a.sources.map((s, j) => (
                    <span key={s}>
                      {j > 0 && ", "}
                      <Link href={`/public-safety/${s}`} style={{ textDecoration: "underline", color: dark ? "var(--yellow)" : "var(--indigo)" }}>
                        {guideById(s)?.title}
                      </Link>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div style={{ display: "grid", gap: 8 }}>
            <span className="skel" style={{ width: "90%" }} />
            <span className="skel" style={{ width: "70%" }} />
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
        style={{ display: "flex", gap: 8 }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={500}
          placeholder="Ask a public safety question"
          aria-label="Your question"
          style={{ flex: 1, minWidth: 0, height: 44, borderRadius: 6, padding: "0 12px", border: dark ? "1.5px solid rgba(255,255,255,.18)" : "1.5px solid var(--line)", background: dark ? "rgba(255,255,255,.06)" : "#fff", color: fg }}
        />
        <button className="btn btn-yellow" style={{ height: 44 }} disabled={busy}>
          <Icon name="send" /> Ask
        </button>
      </form>
      {!thread.length && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => ask(s)} style={{ fontSize: 12.5, padding: "4px 10px", borderRadius: 14, border: 0, background: dark ? "rgba(255,255,255,.07)" : "var(--paper)", color: dark ? "#cfc6ea" : "var(--indigo)" }}>
              {s}
            </button>
          ))}
        </div>
      )}
      <p className="ai-note" style={{ marginTop: 12, color: sub }}>
        <Icon name="spark" /> AI answers can be wrong. They come only from NPFTV&apos;s published guides and are not official police advice.
      </p>
    </div>
  );
}
