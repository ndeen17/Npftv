"use client";

// "Ask NPFTV": the website-wide assistant (not on NPFTV Stream or the Control Room).
// Open it from anywhere with: window.dispatchEvent(new CustomEvent("npftv:ask", { detail: { prompt?: string } }))

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { aiOpts, askAI } from "@/lib/ai-client";
import { GREETING, resolveAction, scriptedReply, SUGGESTIONS, type AssistantReply, type ChatTurn, type LiveSnapshot } from "@/lib/assistant";
import { onAir } from "@/lib/broadcast";
import { containsSecret, redact } from "@/lib/scamchat";
import { useDemo } from "@/lib/store";
import { fmt, watParts } from "@/lib/time";
import { Icon } from "../Icon";

const KEY = "npftv-assistant-chat";

interface Msg extends ChatTurn {
  reply?: AssistantReply; // assistant messages carry their actions and follow-ups
}

export function openAssistant(prompt?: string) {
  window.dispatchEvent(new CustomEvent("npftv:ask", { detail: { prompt } }));
}

export function Assistant() {
  const { state, now } = useDemo();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [warn, setWarn] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const msgsRef = useRef<Msg[]>([]);
  msgsRef.current = msgs;

  // Restore the conversation for this browser tab.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(KEY);
      if (saved) setMsgs(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(msgs.slice(-30)));
    } catch {}
  }, [msgs]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [msgs, busy, open]);

  const snapshot = useCallback((): LiveSnapshot => {
    const air = onAir(state.schedule, now, state.live, 3);
    const p = watParts(now);
    return {
      now: `${fmt.long(p.date)}, ${p.hhmm} WAT`,
      onAir: air.current && air.state !== "off-air" ? `${air.current.title}${air.current.live && air.state === "live" ? " (live)" : ""}, until ${air.current.end}` : "Off air (NPFTV broadcasts 06:00 to 23:00 WAT)",
      next: air.next.map((s) => `${s.start} ${s.title}: ${s.subtitle}`),
      headlines: state.articles
        .filter((a) => a.status === "published")
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 5)
        .map((a) => a.title),
      alerts: state.activeAlerts.map((a) => `${a.title}: ${a.body}`.slice(0, 200)),
      missing: state.notices.filter((n) => n.kind === "missing" && n.status === "published").map((n) => `${n.name}, ${n.age}, last seen ${n.lastSeenPlace}`),
    };
  }, [state, now]);

  const ask = useCallback(
    async (raw: string) => {
      const text0 = raw.trim();
      if (!text0 || busy) return;
      const secret = containsSecret(text0);
      setWarn(secret);
      const text = secret ? redact(text0) : text0;
      const history: Msg[] = [...msgsRef.current, { role: "user" as const, text }];
      setMsgs(history);
      setInput("");
      setBusy(true);
      const turns: ChatTurn[] = [{ role: "assistant" as const, text: GREETING }, ...history.map(({ role, text: t }): ChatTurn => ({ role, text: t }))].slice(-10);
      const snap = snapshot();
      const { data } = await askAI<AssistantReply>("assistant", { history: turns, snapshot: snap }, () => scriptedReply(text, snap), aiOpts(state));
      setMsgs([...history, { role: "assistant", text: data.reply, reply: data }]);
      setBusy(false);
    },
    [busy, snapshot, state],
  );

  // Open from anywhere on the site, optionally with a question.
  useEffect(() => {
    const onAsk = (e: Event) => {
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt;
      setOpen(true);
      if (prompt) setTimeout(() => ask(prompt), 50);
    };
    window.addEventListener("npftv:ask", onAsk);
    return () => window.removeEventListener("npftv:ask", onAsk);
  }, [ask]);

  // Give focus back to the button after the panel closes (it only renders once closed).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) wasOpen.current = true;
    else if (wasOpen.current) {
      wasOpen.current = false;
      if (!document.activeElement || document.activeElement === document.body) fabRef.current?.focus();
    }
  }, [open]);

  // Focus, Esc to close, keep Tab inside the panel.
  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), textarea, input")).filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // On phones the panel is full screen: close it when the person follows a link.
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 760) setOpen(false);
  }, [path]);

  const lastAssistant = [...msgs].reverse().find((m) => m.role === "assistant");

  return (
    <>
      {!open && (
        <button ref={fabRef} className="ask-fab" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="Ask NPFTV, our AI assistant">
          <Icon name="spark" />
          <span>Ask NPFTV</span>
        </button>
      )}
      {open && (
        <div ref={panelRef} className="ask-panel" role="dialog" aria-modal="true" aria-labelledby="ask-title">
          <div className="ask-hd">
            <img src="/images/logo.webp" alt="" />
            <div>
              <b id="ask-title">Ask NPFTV</b>
              <small>
                <Icon name="spark" style={{ width: 12, height: 12 }} /> AI assistant · not an emergency line
              </small>
            </div>
            {msgs.length > 0 && (
              <button className="ask-icon" onClick={() => setMsgs([])} aria-label="Start a new conversation" title="New conversation">
                <Icon name="refresh" />
              </button>
            )}
            <button
              className="ask-icon"
              onClick={() => setOpen(false)}
              aria-label="Close Ask NPFTV"
            >
              <Icon name="x" />
            </button>
          </div>

          <div className="ask-log" aria-live="polite">
            <div className="bubble assistant">{GREETING}</div>
            {msgs.length === 0 && (
              <div className="sc-chips">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="chip" onClick={() => ask(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className="ask-turn">
                <div className={`bubble ${m.role}`}>{m.text}</div>
                {m.reply && m.reply.actions.length > 0 && (
                  <div className="ask-actions">
                    {m.reply.actions.map((a) => {
                      const r = resolveAction(a);
                      if (!r) return null;
                      return r.tel ? (
                        <a key={a.id + a.param} className={`btn btn-sm ${r.primary ? "btn-red" : "btn-line"}`} href={r.href}>
                          <Icon name="phone" /> {r.label}
                        </a>
                      ) : (
                        <Link key={a.id + a.param} className="btn btn-sm btn-line" href={r.href}>
                          {r.label} <Icon name="arrow" />
                        </Link>
                      );
                    })}
                  </div>
                )}
                {m === lastAssistant && !busy && m.reply && m.reply.followUps.length > 0 && (
                  <div className="sc-chips">
                    {m.reply.followUps.map((f) => (
                      <button key={f} className="chip" onClick={() => ask(f)}>
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="bubble assistant typing" aria-label="Ask NPFTV is typing">
                <span />
                <span />
                <span />
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="ask-input"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            {warn && (
              <p className="sc-warn" role="alert">
                <Icon name="alert" /> Please don&apos;t share PINs, codes or account numbers. We removed it from your message.
              </p>
            )}
            <div className="sc-row">
              <label htmlFor="ask-text" className="sr">
                Ask a question
              </label>
              <textarea
                id="ask-text"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={800}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
                placeholder="Type your question…"
              />
              <button className="btn btn-indigo" disabled={busy || !input.trim()} aria-label="Send">
                <Icon name="send" />
              </button>
            </div>
            <p className="ask-note">NPFTV informs; it can&apos;t send help or act on reports. In an emergency, call 112.</p>
          </form>
        </div>
      )}
    </>
  );
}
