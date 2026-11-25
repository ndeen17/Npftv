"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHead } from "@/components/site/bits";
import { EmergencyStrip } from "@/components/site/civic";
import { ScamChat } from "@/components/site/ScamChat";
import { ScamChecker } from "@/components/site/ScamChecker";

const COMMON = [
  { t: "\"Your BVN has been blocked\"", d: "Texts and calls asking you to \"update\" your BVN or give an OTP." },
  { t: "Fake police or EFCC", d: "Threats of arrest unless you pay. Officers never ask for money by phone." },
  { t: "Romance and \"customs fees\"", d: "Someone you met online needs money for a parcel, a ticket or a hospital bill." },
  { t: "Jobs, visas and loans with a fee", d: "Pay first to \"process\" your job, visa or loan. Real offers don't charge." },
  { t: "Double your money", d: "Ponzi, crypto and forex schemes promising fixed high returns." },
  { t: "\"Wrong transfer, please refund\"", d: "A fake credit alert, then a request to send money back." },
];

export default function ScamCheckPage() {
  return (
    <>
      <PageHead
        title="Is this a scam? Let's check together"
        intro="Talk it through with our scam assistant. Tell it what's happening, a message, a call, an online relationship, an offer, and it will help you spot the warning signs and decide what to do."
        crumbs={[{ href: "/safety", label: "Safety" }, { label: "Scam assistant" }]}
      />

      <section className="sec" style={{ paddingTop: 36 }}>
        <div className="wrap grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
          <ScamChat />
          <aside style={{ display: "grid", gap: 14 }}>
            <EmergencyStrip />
            <div className="channel">
              <h3>Common scams in Nigeria</h3>
              <ul style={{ listStyle: "none", display: "grid", gap: 10 }}>
                {COMMON.map((c) => (
                  <li key={c.t} style={{ fontSize: 14.5 }}>
                    <b style={{ display: "block", color: "var(--indigo)" }}>{c.t}</b>
                    <span style={{ color: "#3b3452" }}>{c.d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="role-note">
              <Icon name="info" />
              <p>
                <b>NPFTV can&apos;t take scam reports or recover money.</b> If you&apos;ve lost money, call your bank first, then report it at your nearest police station or to the EFCC.
              </p>
            </div>
            <Link className="link" href="/safety/guides/keeping-your-otp-safe">
              Guide: Keeping your OTP safe <Icon name="arrow" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="sec ps" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ display: "block" }}>
          <div className="sec-hd">
            <div>
              <h2>Prefer to paste a message?</h2>
              <p>Paste a text, WhatsApp or email message and we&apos;ll point out the warning signs.</p>
            </div>
          </div>
          <ScamChecker chatLink={false} />
        </div>
      </section>
    </>
  );
}
