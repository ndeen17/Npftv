"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { stateBySlug } from "@/data/places";
import { Icon } from "@/components/Icon";
import { EmergencyNote, PageHead, StoryRow } from "@/components/site/bits";
import { useDemo } from "@/lib/store";

export default function StatePage() {
  const { state: slug } = useParams<{ state: string }>();
  const { state } = useDemo();
  const s = stateBySlug(slug);
  if (!s) {
    return (
      <section className="sec">
        <div className="wrap">
          <h1 style={{ color: "var(--indigo)" }}>State not found</h1>
          <Link className="link" href="/state-commands">
            All state commands
          </Link>
        </div>
      </section>
    );
  }
  const news = state.articles.filter((a) => a.status === "published" && a.state === s.id).sort((a, b) => (a.date < b.date ? 1 : -1));
  const label = s.id === "FC" ? "FCT Police Command" : `${s.name} State Police Command`;

  return (
    <>
      <PageHead title={label} intro={`Headquarters in ${s.capital}. ${s.zone} zone.`} crumbs={[{ href: "/state-commands", label: "State commands" }, { label: s.name }]} />
      <section className="sec" style={{ paddingTop: 48 }}>
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div>
            <div className="sec-hd">
              <h2>Latest from {s.name}</h2>
            </div>
            <div className="card-w" style={{ padding: "24px 24px 4px" }}>
              {news.length ? (
                news.map((a) => <StoryRow key={a.id} a={a} fresh={a.author === "Musa Ibrahim"} />)
              ) : (
                <p style={{ color: "var(--muted)", paddingBottom: 20 }}>No published stories from this command yet. Our {s.name} correspondent sent {s.stories} stories this month, which are being reviewed.</p>
              )}
            </div>
          </div>
          <aside style={{ display: "grid", gap: 18, alignContent: "start" }}>
            <div className="card-w" style={{ padding: 20 }}>
              <h3 style={{ color: "var(--indigo)", fontSize: 19, marginBottom: 10 }}>Contact the command</h3>
              <ul style={{ listStyle: "none", display: "grid", gap: 8, fontSize: 14.5, color: "#3b3452" }}>
                <li style={{ display: "flex", gap: 8 }}>
                  <Icon name="pin" style={{ width: 16, height: 16, marginTop: 4, color: "var(--green)" }} />
                  Command headquarters, {s.capital}
                </li>
                <li style={{ display: "flex", gap: 8 }}>
                  <Icon name="phone" style={{ width: 16, height: 16, marginTop: 4, color: "var(--green)" }} />
                  Public relations desk (demo: no real number)
                </li>
                <li style={{ display: "flex", gap: 8 }}>
                  <Icon name="users" style={{ width: 16, height: 16, marginTop: 4, color: "var(--green)" }} />
                  The Commissioner of Police, {s.name}
                </li>
              </ul>
            </div>
            <div className="card-w" style={{ padding: 20 }}>
              <h3 style={{ color: "var(--indigo)", fontSize: 19 }}>NPFTV in {s.name}</h3>
              <p style={{ fontFamily: "var(--slab)", fontSize: 40, color: "var(--indigo)", lineHeight: 1.1, marginTop: 8 }}>{s.stories}</p>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>stories sent by our {s.name} correspondent in November</p>
            </div>
            <EmergencyNote />
          </aside>
        </div>
      </section>
    </>
  );
}
