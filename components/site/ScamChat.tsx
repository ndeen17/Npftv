"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { aiOpts, askAI } from "@/lib/ai-client";
import { containsSecret, emergencyKind, MAX_QUESTIONS, redact, SCENARIOS, scriptedTurn, SELF_HARM_REPLY, type ChatMsg, type RiskCardData, type ScamTurn, type ScenarioId } from "@/lib/scamchat";
import { useDemo } from "@/lib/store";
import { Icon } from "../Icon";

const GREETING = "Tell me what's happening. You're not in trouble, and it's not your fault: lots of people are targeted. Choose what fits best, or type in your own words.";

const RISK = {
  high: { label: "High risk", cls: "high" },
  medium: { label: "Be careful", cls: "medium" },
  low: { label: "Lower risk", cls: "low" },
} as const;

export function RiskCard({ card, paid, scenario, onRestart }: { card: RiskCardData; paid: boolean; scenario: ScenarioId | null; onRestart: () => void }) {
  const r = RISK[card.risk];
  const share = `Watch out for this scam (from NPFTV's scam assistant): ${card.title}.\n${card.signs.map((s) => `• ${s}`).join("\n")}\nNever share your PIN, OTP or BVN with anyone.`;
  const ifPaid = card.ifPaid.length > 0 && (
    <div className={`rc-paid${paid ? " urgent" : ""}`}>
      <h4>{paid ? "You've already paid or shared details: do this now" : "If you've already paid or shared details"}</h4>
      <ol>
        {card.ifPaid.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </div>
  );
  return (
    <div className={`risk-card ${r.cls}`} role="region" aria-label="Scam assessment">
      <div className="rc-hd">
        <span className={`rc-pill ${r.cls}`}>{r.label}</span>
        <h3>{card.title}</h3>
      </div>
      {paid && ifPaid}
      {card.signs.length > 0 && (
        <div className="rc-sec">
          <h4>Warning signs</h4>
          <ul className="rc-signs">
            {card.signs.map((s) => (
              <li key={s}>
                <Icon name="alert" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
      {card.doNow.length > 0 && (
        <div className="rc-sec">
          <h4>Do this now</h4>
          <ol className="rc-steps">
            {card.doNow.map((s, i) => (
              <li key={s}>
                <span>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}
      {!paid && ifPaid}
      {card.talkTo && (
        <div className="rc-talk">
          <Icon name="users" />
          <p>{card.talkTo}</p>
        </div>
      )}
      {card.reportTo.length > 0 && (
        <p className="rc-report">
          <b>Who to report to:</b> {card.reportTo.join("; ")}. NPFTV can&apos;t take the report or recover money, but these can help.
        </p>
      )}
      <div className="rc-acts">
        <a className="btn btn-sm btn-line" href={`https://wa.me/?text=${encodeURIComponent(share)}`} target="_blank" rel="noopener noreferrer">
          <Icon name="share" /> Warn others on WhatsApp
        </a>
        {scenario === "police" ? (
          <Link className="btn btn-sm btn-line" href="/rights/bail">
            Read: Bail is free
          </Link>
        ) : (
          <Link className="btn btn-sm btn-line" href="/safety/guides/keeping-your-otp-safe">
            Read: Keeping your OTP safe
          </Link>
        )}
        <button className="btn btn-sm btn-indigo" onClick={onRestart}>
          <Icon name="refresh" /> Start again
        </button>
      </div>
    </div>
  );
}

export function ScamChat() {
  const { state } = useDemo();
  const [msgs, setMsgs] = useState<ChatMsg[]>([{ role: "assistant", text: GREETING }]);
  const [scenario, setScenario] = useState<ScenarioId | null>(null);
  const [quick, setQuick] = useState<string[]>([]);
  const [card, setCard] = useState<RiskCardData | null>(null);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [warn, setWarn] = useState(false);
  const [emergency, setEmergency] = useState<"self-harm" | "danger" | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Each conversation has an id. Answers that arrive after "Start again" belong to an old one and are dropped.
  const convo = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, busy, card]);

  const asked = msgs.filter((m) => m.role === "assistant").length - 1;
  const paid = msgs.some((m) => m.role === "user" && /yes, i (sent money|shared)|\bi (have )?(sent|paid|transferred)\b|already paid/i.test(m.text));

  async function next(history: ChatMsg[], sc: ScenarioId) {
    const id = convo.current;
    setBusy(true);
    setQuick([]);
    const final = history.filter((m) => m.role === "assistant").length - 1 >= MAX_QUESTIONS;
    const { data } = await askAI<ScamTurn>("scam-chat", { scenario: sc, history: history.slice(-10), final }, () => scriptedTurn(sc, history), aiOpts(state));
    if (id !== convo.current) return; // the person started again while we were answering
    if (data.isEmergency && !emergency) setEmergency("danger");
    if (data.kind === "result" && data.card) {
      setMsgs([...history, { role: "assistant", text: "Thank you. Here's what I think, and what to do next." }]);
      setCard(data.card);
    } else {
      setMsgs([...history, { role: "assistant", text: data.question }]);
      setQuick(data.quickReplies);
    }
    setBusy(false);
  }

  function say(raw: string, sc: ScenarioId | null = scenario) {
    const text0 = raw.trim();
    if (!text0 || busy) return;
    const hasSecret = containsSecret(text0);
    setWarn(hasSecret);
    const text = hasSecret ? redact(text0) : text0;
    const kind = emergencyKind(text);
    const scenarioNow = sc ?? "other";
    if (!scenario) setScenario(scenarioNow);
    const history: ChatMsg[] = [...msgs, { role: "user", text }];
    setInput("");
    if (kind) setEmergency(kind);
    if (kind === "self-harm") {
      setMsgs([...history, { role: "assistant", text: SELF_HARM_REPLY }]);
      setQuick(["I'm safe, let's keep going"]);
      return;
    }
    // Danger: the red 112 banner appears at once; the conversation carries on underneath it.
    setMsgs(history);
    void next(history, scenarioNow);
  }

  function pick(id: ScenarioId) {
    if (id === "other") {
      setScenario("other");
      inputRef.current?.focus();
      return;
    }
    const s = SCENARIOS.find((x) => x.id === id)!;
    setScenario(id);
    say(s.opener, id);
  }

  function restart() {
    convo.current += 1;
    setBusy(false);
    setMsgs([{ role: "assistant", text: GREETING }]);
    setScenario(null);
    setQuick([]);
    setCard(null);
    setInput("");
    setWarn(false);
    setEmergency(null);
  }

  const started = msgs.some((m) => m.role === "user");

  return (
    <div className="scam-chat">
      <div className="sc-hd">
        <span className="sc-av">
          <Icon name="shield" />
        </span>
        <div>
          <b>Scam assistant</b>
          <small>
            <Icon name="spark" style={{ width: 12, height: 12 }} /> AI · Nothing you type is stored
          </small>
        </div>
        {started && (
          <button className="mini" onClick={restart}>
            <Icon name="refresh" /> Start again
          </button>
        )}
      </div>

      {emergency && (
        <div className="emergency-strip sc-emerg">
          <span className="es-ic">
            <Icon name="phone" />
          </span>
          <p>
            <b>{emergency === "self-harm" ? "You matter. If you're in immediate danger, call 112." : "In danger right now? Call 112."}</b> It&apos;s free on every network.
          </p>
          <a className="btn btn-red btn-sm" href="tel:112">
            Call 112
          </a>
        </div>
      )}

      <div className="sc-log" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.text}
          </div>
        ))}
        {!started && !scenario && (
          <div className="sc-chips" role="group" aria-label="What's happening">
            {SCENARIOS.map((s) => (
              <button key={s.id} className="chip" onClick={() => pick(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        )}
        {busy && (
          <div className="bubble assistant typing" aria-label="Assistant is typing">
            <span />
            <span />
            <span />
          </div>
        )}
        {!busy && quick.length > 0 && !card && (
          <div className="sc-chips">
            {quick.map((q) => (
              <button key={q} className="chip" onClick={() => (q === "I'm safe, let's keep going" ? (setQuick([]), void next(msgs, scenario ?? "other")) : say(q))}>
                {q}
              </button>
            ))}
          </div>
        )}
        {card && <RiskCard card={card} paid={paid} scenario={scenario} onRestart={restart} />}
        <div ref={endRef} />
      </div>

      {!card && (
        <form
          className="sc-input"
          onSubmit={(e) => {
            e.preventDefault();
            say(input);
          }}
        >
          {warn && (
            <p className="sc-warn" role="alert">
              <Icon name="alert" /> Please don&apos;t share PINs, codes or account numbers with anyone, including us. We removed it from your message.
            </p>
          )}
          <div className="sc-row">
            <label htmlFor="sc-text" className="sr">
              Your message
            </label>
            <textarea
              id="sc-text"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={1200}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  say(input);
                }
              }}
              placeholder={scenario === "other" && !started ? "Tell me what's happening…" : "Type your answer…"}
            />
            <button className="btn btn-indigo" disabled={busy || !input.trim()} aria-label="Send">
              <Icon name="send" />
            </button>
          </div>
          {started && <small className="sc-progress">{Math.min(Math.max(asked, 0), MAX_QUESTIONS)} of up to {MAX_QUESTIONS} questions</small>}
        </form>
      )}
    </div>
  );
}
