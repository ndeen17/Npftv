"use client";

import Link from "next/link";
import { guides } from "@/data/public";
import { AskNpftv } from "@/components/AskNpftv";
import { Icon, type IconName } from "@/components/Icon";
import { ScamChecker } from "@/components/site/ScamChecker";
import { EmergencyNote, PageHead } from "@/components/site/bits";
import { PersonCard } from "@/components/site/notices";
import { useDemo } from "@/lib/store";

export default function PublicSafetyPage() {
  const { state, now } = useDemo();
  const missing = state.notices.filter((n) => n.kind === "missing" && n.status === "published").sort((a, b) => (a.issuedOn < b.issuedOn ? 1 : -1)).slice(0, 4);
  const alerts = [...state.activeAlerts, state.alertBar].filter((a, i, arr) => arr.findIndex((x) => x.id === a.id) === i);

  return (
    <>
      <PageHead title="Safety" intro="Practical advice checked by the Force, tools to spot scams, and current alerts. This website is not an emergency line: in an emergency, call 112." crumbs={[{ label: "Safety" }]} />

      <section className="sec" id="alerts" style={{ paddingTop: 48, paddingBottom: 0 }}>
        <div className="wrap">
          <div className="sec-hd">
            <h2>Active alerts</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {alerts.map((a) => (
              <div key={a.id} className="card-w" style={{ padding: 20, borderTop: `5px solid ${a.level === "urgent" ? "var(--red)" : "var(--yellow)"}` }}>
                <span className={`tag ${a.level === "urgent" ? "tag-red" : "tag-feat"}`}>{a.level === "urgent" ? "Urgent" : "Advice"}</span>
                <h3 style={{ color: "var(--indigo)", margin: "10px 0 6px" }}>{a.title}</h3>
                <p style={{ color: "#3b3452" }}>{a.body}</p>
                {a.verifiedBy && (
                  <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 10 }}>
                    <Icon name="check" style={{ width: 14, height: 14, display: "inline", verticalAlign: -2, color: "var(--green)" }} /> Verified by {a.verifiedBy}. Expires {a.expires}.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="send-a-report" style={{ paddingTop: 36, paddingBottom: 0 }}>
        <div className="wrap">
          <div className="report-cta">
            <div>
              <span className="tag tag-ai">
                <Icon name="spark" style={{ width: 13, height: 13 }} /> New
              </span>
              <h2>Seen something happening near you?</h2>
              <p>A flood, a fire, a crash, a community event: tell our newsroom. Verified reports help us warn and inform the public. This isn&apos;t a police report, and NPFTV can&apos;t send help. In an emergency, call 112.</p>
            </div>
            <div className="report-cta-acts">
              <Link className="btn btn-yellow" href="/safety/report">
                <Icon name="send" /> Send a report
              </Link>
              <Link className="btn btn-ghost" href="/track">
                Track a report
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec ps" id="scam-checker">
        <div className="wrap">
          <ScamChecker />
          <div className="guides" id="guides">
            <h3>Public safety guides</h3>
            <p>Practical advice, checked by the Force.</p>
            {guides.map((g) => (
              <Link key={g.id} className="guide" href={`/safety/guides/${g.id}`}>
                <span className="gi">
                  <Icon name={g.icon as IconName} />
                </span>
                <span className="gt">
                  {g.title}
                  <small>{g.short}</small>
                </span>
                <Icon name="chev" />
              </Link>
            ))}
            <EmergencyNote />
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }} id="missing-wanted">
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <h2>Missing and wanted persons</h2>
              <p>Notices issued by police commands, published by NPFTV. If you have information, contact the police, not NPFTV.</p>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link className="link" href="/safety/missing">
                Missing persons <Icon name="arrow" />
              </Link>
              <Link className="link" href="/safety/wanted">
                Wanted persons <Icon name="arrow" />
              </Link>
            </div>
          </div>
          <div className="people">
            {missing.map((n) => (
              <PersonCard key={n.id} n={n} now={now} />
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <AskNpftv />
          <div>
            <h3 style={{ color: "var(--indigo)", fontSize: 24, marginBottom: 8 }}>How to report a crime</h3>
            <p style={{ color: "var(--muted)", marginBottom: 16 }}>Reporting is free. Go to your nearest divisional police station, or call 112 if anyone is in danger now.</p>
            <Link className="btn btn-indigo" href="/safety/guides/how-to-report-a-crime">
              Read the guide <Icon name="arrow" />
            </Link>
            <h3 style={{ color: "var(--indigo)", fontSize: 24, margin: "36px 0 8px" }}>Find your state command</h3>
            <p style={{ color: "var(--muted)", marginBottom: 16 }}>News and contact details for the 36 state commands and the FCT.</p>
            <Link className="btn btn-line" href="/state-commands">
              State commands <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
