"use client";

import Link from "next/link";
import { officerDuties, rightsTopics } from "@/data/rights";
import { Icon } from "@/components/Icon";
import { PageHead } from "@/components/site/bits";
import { EmergencyStrip, LegalNote, NextLink, RoleNote, SectionTitle } from "@/components/site/civic";

export default function RightsHub() {
  return (
    <>
      <PageHead
        title="Your rights"
        intro="Know where you stand. Clear, practical information on your rights and on police powers in Nigeria: what officers can do, what they can't, and what you can do."
        crumbs={[{ label: "Your rights" }]}
      />

      <section className="sec" style={{ paddingTop: 40, paddingBottom: 0 }}>
        <div className="wrap" style={{ display: "grid", gap: 14 }}>
          <RoleNote />
          <EmergencyStrip />
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <SectionTitle title="What's happening?" intro="Choose the situation closest to yours." />
          <div className="situations">
            {rightsTopics.map((t) => (
              <Link key={t.id} href={`/rights/${t.id}`} className="situation">
                <span className="s-ic">
                  <Icon name={t.icon} />
                </span>
                <small>{t.situation}</small>
                <b>{t.title}</b>
                <span className="link">
                  Read <Icon name="arrow" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="duty-panel">
            <h2>Officers have powers. You have rights.</h2>
            <p style={{ marginBottom: 16, color: "#c9c0e4" }}>Both are set out in law. Every officer must:</p>
            <ul>
              {officerDuties.map((d) => (
                <li key={d}>
                  <Icon name="check" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="free-banner">
            <span className="tag" style={{ background: "var(--indigo)", color: "#fff", alignSelf: "flex-start" }}>
              Remember
            </span>
            <b>Bail is free. Reporting a crime is free.</b>
            <p>No one should ask you or your family for money to be released, to &quot;open a file&quot; or to investigate a case.</p>
            <Link className="btn btn-indigo btn-sm" href="/rights/bail" style={{ alignSelf: "flex-start", marginTop: 6 }}>
              Read about bail
            </Link>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionTitle title="How things work" intro="What happens after a crime is reported, and how complaints about officers are handled." />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <NextLink href="/rights/investigations" icon="search" title="How investigations work" text="From your report to court, step by step, and how to follow up." />
            <NextLink href="/rights/complaints" icon="stamp" title="Complaints about officers" text="Who handles them, what happens, and how to prepare yours." />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3" style={{ marginTop: 28 }}>
            <div className="channel">
              <h3>Can&apos;t afford a lawyer?</h3>
              <p>The Legal Aid Council of Nigeria gives free legal help to people who can&apos;t afford a lawyer.</p>
              <small>
                <Icon name="info" style={{ width: 14, height: 14 }} /> Contact details to be confirmed
              </small>
            </div>
            <div className="channel">
              <h3>Human rights abuse?</h3>
              <p>The National Human Rights Commission (NHRC) receives complaints about human rights violations, including by officers.</p>
              <small>
                <Icon name="info" style={{ width: 14, height: 14 }} /> Contact details to be confirmed
              </small>
            </div>
            <div className="channel">
              <h3>Someone held too long?</h3>
              <p>A suspect must be taken to court within 24 hours if a court is within 40 km, otherwise within 48 hours.</p>
              <Link className="link" href="/rights/held-too-long" style={{ marginTop: "auto" }}>
                What to do <Icon name="arrow" />
              </Link>
            </div>
          </div>
          <LegalNote />
        </div>
      </section>
    </>
  );
}
