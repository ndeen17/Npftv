"use client";

import Link from "next/link";
import { followUpLadder, investigationSteps, victimRights } from "@/data/rights";
import { Icon } from "@/components/Icon";
import { PageHead } from "@/components/site/bits";
import { EmergencyStrip, LegalNote, NextLink, RoleNote } from "@/components/site/civic";

export default function InvestigationsPage() {
  return (
    <>
      <PageHead
        title="How investigations work"
        intro="What happens after a crime is reported to the police: from your statement to court, what to expect at each step, and how to follow up."
        crumbs={[{ href: "/rights", label: "Your rights" }, { label: "How investigations work" }]}
      />

      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div style={{ display: "grid", gap: 28, alignContent: "start" }}>
            <RoleNote>
              <b>NPFTV explains how the process works.</b> To report a crime, go to your nearest police station (reporting is free), or call 112 in an emergency. Follow-up on a case happens with the police, not NPFTV.
            </RoleNote>
            <ol className="timeline">
              {investigationSteps.map((s, i) => (
                <li key={s.title}>
                  <span className="tl-num">{i + 1}</span>
                  <div className="tl-card">
                    <h3>
                      {s.title}
                      <small>{s.time}</small>
                    </h3>
                    <p>{s.what}</p>
                    <div className="tl-cols">
                      <div>
                        <b>What to expect</b>
                        {s.expect}
                      </div>
                      <div>
                        <b>What you can do</b>
                        {s.youCan}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <p style={{ color: "var(--muted)", fontSize: 13.5 }}>Timings are illustrative. Every case is different.</p>
            <LegalNote />
          </div>

          <aside style={{ display: "grid", gap: 18, alignContent: "start" }}>
            <EmergencyStrip />
            <div className="channel">
              <h3>Your rights as a victim or witness</h3>
              <ul className="bullets" style={{ display: "grid", gap: 8, paddingLeft: 18, fontSize: 15, color: "#3b3452" }}>
                {victimRights.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
            <div className="channel">
              <h3>Following up on your case</h3>
              <p>If nothing seems to be happening, ask in this order:</p>
              <ol className="num-steps" style={{ marginTop: 6 }}>
                {followUpLadder.map((f, i) => (
                  <li key={f.who} style={{ padding: "10px 12px", gridTemplateColumns: "28px 1fr", gap: 10 }}>
                    <span style={{ width: 28, height: 28, fontSize: 14 }}>{i + 1}</span>
                    <p style={{ fontSize: 14.5, paddingTop: 2 }}>
                      <b style={{ display: "block", color: "var(--indigo)" }}>{f.who}</b>
                      {f.when}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <NextLink href="/rights/complaints" icon="stamp" title="Complaints about officers" text="If you were asked for money, ignored or mistreated." />
            <Link className="link" href="/rights">
              <Icon name="back" /> Your rights
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
