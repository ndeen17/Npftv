"use client";

import { useState } from "react";
import { contactDesks } from "@/data/public";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { EmergencyNote, PageHead } from "@/components/site/bits";

export default function ContactPage() {
  const toast = useToast();
  const [desk, setDesk] = useState(contactDesks[0].name);
  return (
    <>
      <PageHead title="Contact NPFTV" intro="Choose the right desk and we'll reply within two working days. This is not an emergency line: in an emergency, call 112." crumbs={[{ label: "Contact" }]} />
      <section className="sec" style={{ paddingTop: 48 }}>
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <EmergencyNote />
            <h2 style={{ color: "var(--indigo)", margin: "32px 0 12px", fontSize: 28 }}>Our desks</h2>
            {contactDesks.map((d) => (
              <div key={d.name} className="guide">
                <span className="gi">
                  <Icon name="mail" />
                </span>
                <span className="gt">
                  {d.name}
                  <small>
                    {d.note} · {d.email}
                  </small>
                </span>
              </div>
            ))}
          </div>
          <form
            className="card-w"
            style={{ padding: 28, display: "grid", gap: 16, alignContent: "start" }}
            onSubmit={(e) => {
              e.preventDefault();
              (e.target as HTMLFormElement).reset();
              toast(`Demo only: nothing was sent to the ${desk} desk.`);
            }}
          >
            <h2 style={{ color: "var(--indigo)", fontSize: 28 }}>Send a message</h2>
            {[
              ["Your name", "text", "name"],
              ["Email address", "email", "email"],
            ].map(([l, t, n]) => (
              <label key={n} style={{ display: "grid", gap: 6, fontWeight: 600, fontSize: 14 }}>
                {l}
                <input required type={t} name={n} style={{ height: 44, border: "1.5px solid var(--line)", borderRadius: 6, padding: "0 12px", fontWeight: 400 }} />
              </label>
            ))}
            <label style={{ display: "grid", gap: 6, fontWeight: 600, fontSize: 14 }}>
              Desk
              <select value={desk} onChange={(e) => setDesk(e.target.value)} style={{ height: 44, border: "1.5px solid var(--line)", borderRadius: 6, padding: "0 12px", fontWeight: 400, background: "#fff" }}>
                {contactDesks.map((d) => (
                  <option key={d.name}>{d.name}</option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: 6, fontWeight: 600, fontSize: 14 }}>
              Message
              <textarea required rows={5} style={{ border: "1.5px solid var(--line)", borderRadius: 6, padding: 12, fontWeight: 400 }} />
            </label>
            <p style={{ fontSize: 13.5, color: "var(--muted)" }}>Don&apos;t use this form to report a crime. Go to your nearest police station, or call 112 in an emergency.</p>
            <button className="btn btn-indigo" style={{ justifySelf: "start" }}>
              <Icon name="send" /> Send message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
