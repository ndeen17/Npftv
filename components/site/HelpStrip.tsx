"use client";

import Link from "next/link";
import { useState } from "react";
import { SUGGESTIONS } from "@/lib/assistant";
import { Icon, type IconName } from "../Icon";
import { openAssistant } from "./Assistant";

/** Entry card for the site-wide assistant: type a question or tap a suggestion. */
export function AskCard({ compact }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  return (
    <div className={`ask-card${compact ? " compact" : ""}`}>
      <div className="ask-card-hd">
        <span className="ask-card-ic">
          <Icon name="spark" />
        </span>
        <div>
          <h3>Ask NPFTV</h3>
          <p>Ask anything about scams, your rights, staying safe, sending us a report, missing persons or what&apos;s on. Our AI assistant points you to the right place.</p>
        </div>
      </div>
      <form
        className="ask-card-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!q.trim()) return openAssistant();
          openAssistant(q.trim());
          setQ("");
        }}
      >
        <label htmlFor={compact ? "ask-card-q2" : "ask-card-q"} className="sr">
          Your question
        </label>
        <input id={compact ? "ask-card-q2" : "ask-card-q"} value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Can police search my phone?" maxLength={800} />
        <button className="btn btn-yellow">
          <Icon name="send" /> Ask
        </button>
      </form>
      <div className="chips" style={{ marginTop: 10 }}>
        {SUGGESTIONS.slice(0, compact ? 3 : 4).map((s) => (
          <button key={s} className="chip" onClick={() => openAssistant(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

const TASKS: { href: string; icon: IconName; title: string; text: string }[] = [
  { href: "/safety/scam-check", icon: "shield", title: "I think I'm being scammed", text: "Talk it through and spot the warning signs." },
  { href: "/safety/report", icon: "send", title: "Something is happening near me", text: "Tell our newsroom so we can warn others." },
  { href: "/safety/missing", icon: "users", title: "Someone is missing", text: "Notices from police commands, and what to do." },
  { href: "/rights/complaints", icon: "stamp", title: "Complain about an officer", text: "Who handles complaints and how to prepare yours." },
];

/** Homepage "How can we help?" strip. */
export function HelpStrip() {
  return (
    <section className="sec help-strip">
      <div className="wrap">
        <div className="sec-hd">
          <div>
            <h2>How can we help?</h2>
            <p>Clear information and the right next step. In an emergency, call 112.</p>
          </div>
        </div>
        <div className="help-grid">
          <AskCard />
          <div className="task-grid">
            {TASKS.map((t) => (
              <Link key={t.href} href={t.href} className="task-card">
                <span className="tc-ic">
                  <Icon name={t.icon} />
                </span>
                <b>{t.title}</b>
                <small>{t.text}</small>
                <Icon name="arrow" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
