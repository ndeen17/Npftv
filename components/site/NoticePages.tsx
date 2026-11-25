"use client";

import Link from "next/link";
import { useState } from "react";
import { stateById, states } from "@/data/places";
import type { Notice, NoticeKind } from "@/data/notices";
import { useToast } from "@/components/Toast";
import { useDemo } from "@/lib/store";
import { fmt } from "@/lib/time";
import { Icon } from "../Icon";
import { PageHead } from "./bits";
import { EmergencyStrip, NextLink, RoleNote, SectionTitle } from "./civic";
import { daysSince, issuedLine, PersonCard, Silhouette, StatusLabel } from "./notices";

const COPY: Record<NoticeKind, { title: string; intro: string; empty: string }> = {
  missing: {
    title: "Missing persons",
    intro: "Notices issued by police commands to help find people who are missing. Please look carefully and share them. Every share could help bring someone home.",
    empty: "No missing person notices match your filters.",
  },
  wanted: {
    title: "Wanted persons",
    intro: "People formally declared wanted by a police command. If you recognise someone, don't approach them. Tell the police.",
    empty: "No wanted person notices match your filters.",
  },
};

export function WantedRules() {
  return (
    <div className="rules" role="note">
      <h2>Before you read these notices</h2>
      <ul>
        <li>
          <Icon name="scale" />
          <span>
            <b>Everyone is presumed innocent until proven guilty in court.</b> Being declared wanted is not a conviction.
          </span>
        </li>
        <li>
          <Icon name="alert" />
          <span>
            <b>Do not approach or confront anyone.</b> Call 112 or go to your nearest police station.
          </span>
        </li>
        <li>
          <Icon name="info" />
          <span>Only people formally declared wanted by a police command appear here. NPFTV publishes the notice; it does not take information or tips.</span>
        </li>
      </ul>
    </div>
  );
}

export function NoticeList({ kind }: { kind: NoticeKind }) {
  const { state, now } = useDemo();
  const [st, setSt] = useState("all");
  const [age, setAge] = useState("all");
  const live = state.notices.filter((n) => n.kind === kind && n.status === "published");
  const list = live
    .filter((n) => st === "all" || n.state === st)
    .filter((n) => age === "all" || (age === "under18" ? n.age < 18 : age === "18to59" ? n.age >= 18 && n.age < 60 : n.age >= 60))
    .sort((a, b) => (a.issuedOn < b.issuedOn ? 1 : -1));
  const found = state.notices.filter((n) => n.kind === "missing" && n.status === "found" && n.closedOn && daysSince(n.closedOn, now) <= 7);
  const usedStates = Array.from(new Set(live.map((n) => n.state)));
  const c = COPY[kind];

  return (
    <>
      <PageHead title={c.title} intro={c.intro} crumbs={[{ href: "/safety", label: "Safety" }, { label: c.title }]} />
      <section className="sec" style={{ paddingTop: 40, paddingBottom: 0 }}>
        <div className="wrap" style={{ display: "grid", gap: 14 }}>
          {kind === "wanted" ? (
            <WantedRules />
          ) : (
            <RoleNote>
              <b>These notices are issued by police commands. NPFTV publishes them</b> to help find people. If you have information, contact the command that issued the notice or your nearest police station. In an emergency, call <a href="tel:112">112</a>.
            </RoleNote>
          )}
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 36 }}>
        <div className="wrap">
          <div className="filter-bar">
            <label className="sr" htmlFor="f-state">
              State
            </label>
            <select id="f-state" value={st} onChange={(e) => setSt(e.target.value)}>
              <option value="all">All states</option>
              {states
                .filter((s) => usedStates.includes(s.id))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
            {kind === "missing" && (
              <>
                <label className="sr" htmlFor="f-age">
                  Age
                </label>
                <select id="f-age" value={age} onChange={(e) => setAge(e.target.value)}>
                  <option value="all">All ages</option>
                  <option value="under18">Under 18</option>
                  <option value="18to59">18 to 59</option>
                  <option value="60plus">60 and over</option>
                </select>
              </>
            )}
            <span style={{ color: "var(--muted)", fontSize: 14 }}>
              {list.length} notice{list.length === 1 ? "" : "s"}
            </span>
          </div>
          {list.length ? (
            <div className="people">
              {list.map((n) => (
                <PersonCard key={n.id} n={n} now={now} />
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--muted)" }}>{c.empty}</p>
          )}

          {kind === "missing" && found.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <SectionTitle title="Found safe" intro="Recently closed notices. Thank you for sharing." />
              <div className="people">
                {found.map((n) => (
                  <PersonCard key={n.id} n={n} now={now} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {kind === "missing" ? (
            <div className="channel">
              <h3>If someone you know is missing</h3>
              <ol className="num-steps" style={{ marginTop: 6 }}>
                {[
                  "You don't need to wait 24 hours. Go to your nearest police station as soon as you're worried.",
                  "Take a recent photo, a description (height, clothes, any marks) and where and when they were last seen.",
                  "Tell the officer about any health condition, such as dementia or diabetes.",
                  "If you suspect trafficking or a child is missing, tell the police straight away. NAPTIP also handles trafficking.",
                  "Only share official notices. Unverified posts can spread wrong information and put people at risk.",
                ].map((t, i) => (
                  <li key={t} style={{ padding: "10px 12px", gridTemplateColumns: "28px 1fr", gap: 10 }}>
                    <span style={{ width: 28, height: 28, fontSize: 14 }}>{i + 1}</span>
                    <p style={{ fontSize: 15, paddingTop: 2 }}>{t}</p>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="channel">
              <h3>If you recognise someone</h3>
              <p>Note where and when you saw them, then tell the police: the command that issued the notice, your nearest station, or 112 if it&apos;s urgent. Don&apos;t share your suspicions on social media and don&apos;t try to catch anyone yourself.</p>
            </div>
          )}
          <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
            <EmergencyStrip />
            <NextLink href={kind === "missing" ? "/safety/wanted" : "/safety/missing"} icon="users" title={kind === "missing" ? "Wanted persons" : "Missing persons"} text={kind === "missing" ? "People declared wanted by police commands." : "Help find people who are missing."} />
          </div>
        </div>
      </section>
    </>
  );
}

export function NoticeDetail({ kind, id }: { kind: NoticeKind; id: string }) {
  const { state, now, hydrated } = useDemo();
  const toast = useToast();
  const n = state.notices.find((x) => x.id === id && x.kind === kind && x.status !== "pending");

  if (!n) {
    return (
      <section className="sec">
        <div className="wrap" style={{ maxWidth: 760 }}>
          {hydrated && (
            <>
              <h1 style={{ fontSize: 40, color: "var(--indigo)" }}>Notice not found</h1>
              <p style={{ margin: "12px 0 24px", color: "var(--muted)" }}>It may not be published yet, or it has been withdrawn.</p>
              <Link className="btn btn-indigo" href={`/safety/${kind}`}>
                All {kind} persons
              </Link>
            </>
          )}
        </div>
      </section>
    );
  }

  const st = stateById(n.state);
  const days = daysSince(n.lastSeenDate, now);
  const title = kind === "missing" ? `Missing: ${n.name}` : `Wanted: ${n.name}`;
  const shareText =
    kind === "missing"
      ? `MISSING: ${n.name}, ${n.age}. Last seen ${n.lastSeenPlace} on ${fmt.dayMonthYear(n.lastSeenDate)}. ${n.clothing ? `Wearing ${n.clothing.toLowerCase()}. ` : ""}If you have information, contact the ${n.issuedBy} or your nearest police station. Official notice: npftv.net/safety/missing/${n.id}`
      : `WANTED by the ${n.issuedBy}: ${n.name} (${n.offence}). Do not approach. Call 112 or your nearest police station. Official notice: npftv.net/safety/wanted/${n.id}`;
  const facts: [string, string | undefined][] =
    kind === "missing"
      ? [
          ["Age", `${n.age}`],
          ["Sex", n.sex],
          ["Last seen", `${n.lastSeenPlace}, ${fmt.long(n.lastSeenDate)}`],
          ["Height", n.height],
          ["Build and features", n.build],
          ["Wearing", n.clothing],
        ]
      : [
          ["Alias", n.alias ? `"${n.alias}"` : undefined],
          ["Age", `${n.age}`],
          ["Sex", n.sex],
          ["Wanted for", n.offence],
          ["Last known area", n.lastSeenPlace],
          ["Height", n.height],
          ["Build and features", n.build],
          ["Case reference", n.caseRef],
        ];

  return (
    <>
      <PageHead title={title} intro={`${n.issuedBy}${st ? ` · ${st.zone}` : ""}`} crumbs={[{ href: "/safety", label: "Safety" }, { href: `/safety/${kind}`, label: kind === "missing" ? "Missing persons" : "Wanted persons" }, { label: n.name }]}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
          {n.status === "published" && (
            <a className="btn btn-yellow btn-sm" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
              <Icon name="share" /> Share on WhatsApp
            </a>
          )}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              navigator.clipboard?.writeText(shareText).catch(() => {});
              toast("Notice copied");
            }}
          >
            <Icon name="copy" /> Copy notice
          </button>
        </div>
      </PageHead>

      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div style={{ display: "grid", gap: 22, alignContent: "start" }}>
            {n.status === "found" && (
              <div className="found-banner" role="status">
                <Icon name="check" />
                <span>
                  <b>Found safe</b> on {fmt.dayMonthYear(n.closedOn!)}. Thank you to everyone who shared this notice.
                </span>
              </div>
            )}
            {n.status === "withdrawn" && (
              <div className="role-note">
                <Icon name="info" />
                <p>This notice was withdrawn by the issuing command on {fmt.dayMonthYear(n.closedOn!)}.</p>
              </div>
            )}
            {kind === "wanted" && n.status === "published" && <WantedRules />}
            <div className="notice-hero">
              <div style={{ position: "relative" }}>
                <Silhouette kind={kind} />
                <StatusLabel n={n} />
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                <div>
                  <h2 style={{ fontSize: 34, color: "var(--indigo)" }}>{n.name}</h2>
                  {kind === "missing" && n.status === "published" && (
                    <p style={{ marginTop: 6 }}>
                      <span className="tag tag-feat" style={{ fontSize: 13 }}>
                        Missing for {days} day{days === 1 ? "" : "s"}
                      </span>
                    </p>
                  )}
                </div>
                <p style={{ fontSize: 17, lineHeight: 1.6, color: "#2b2442" }}>{n.description}</p>
                <div className="facts">
                  <dl>
                    {facts
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k} style={{ display: "contents" }}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
                <p style={{ fontSize: 13.5, color: "var(--muted)" }}>{issuedLine(n)} All details in this demo are fictional.</p>
              </div>
            </div>
          </div>

          <aside style={{ display: "grid", gap: 14, alignContent: "start" }}>
            {n.status === "published" && (
              <div className="seen-box">
                <h2>{kind === "missing" ? `Have you seen ${n.name.split(" ")[0]}?` : "Do you recognise this person?"}</h2>
                {kind === "wanted" && <p style={{ color: "#fff", fontWeight: 600 }}>Do not approach them.</p>}
                <ol>
                  <li>
                    <span>1</span>
                    <p>
                      <b>Contact the {n.issuedBy}.</b> Contact details to be confirmed.
                    </p>
                  </li>
                  <li>
                    <span>2</span>
                    <p>
                      <b>Or go to your nearest police station</b> and mention this notice.
                    </p>
                  </li>
                  <li>
                    <span>3</span>
                    <p>
                      <b>If it&apos;s urgent, call 112.</b>
                    </p>
                  </li>
                </ol>
                <a className="btn btn-red" href="tel:112" style={{ justifyContent: "center" }}>
                  <Icon name="phone" /> Call 112
                </a>
                <p style={{ fontSize: 13, color: "#a79dc7" }}>NPFTV publishes this notice for the police. We can&apos;t receive information or tips.</p>
              </div>
            )}
            <NextLink href={`/safety/${kind}`} icon="users" title={kind === "missing" ? "All missing persons" : "All wanted persons"} text="See every current notice." />
          </aside>
        </div>
      </section>
    </>
  );
}

export type { Notice };
