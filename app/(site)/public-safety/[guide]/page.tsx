"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { guideById, guides } from "@/data/public";
import { Icon, type IconName } from "@/components/Icon";
import { EmergencyNote, PageHead } from "@/components/site/bits";

export default function GuidePage() {
  const { guide } = useParams<{ guide: string }>();
  const g = guideById(guide);
  if (!g) {
    return (
      <section className="sec">
        <div className="wrap">
          <h1 style={{ color: "var(--indigo)" }}>Guide not found</h1>
          <Link className="link" href="/public-safety">
            Public safety
          </Link>
        </div>
      </section>
    );
  }
  return (
    <>
      <PageHead title={g.title} intro={g.short} crumbs={[{ href: "/public-safety", label: "Public safety" }, { label: g.title }]} />
      <section className="sec" style={{ paddingTop: 48 }}>
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div>
            <ol style={{ listStyle: "none", display: "grid", gap: 14 }}>
              {g.steps.map((s, i) => (
                <li key={i} className="card-w" style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 14, padding: 18, alignItems: "start" }}>
                  <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--indigo)", color: "var(--yellow)", display: "grid", placeItems: "center", fontFamily: "var(--slab)", fontWeight: 700, fontSize: 20 }}>{i + 1}</span>
                  <p style={{ fontSize: 17, lineHeight: 1.6, paddingTop: 8 }}>{s}</p>
                </li>
              ))}
            </ol>
            <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 18 }}>Checked by the Force Public Relations Department. Last reviewed November 2026 (demo content).</p>
          </div>
          <aside>
            <EmergencyNote />
            <h3 style={{ color: "var(--indigo)", margin: "28px 0 6px" }}>Other guides</h3>
            {guides
              .filter((x) => x.id !== g.id)
              .map((x) => (
                <Link key={x.id} className="guide" href={`/public-safety/${x.id}`}>
                  <span className="gi">
                    <Icon name={x.icon as IconName} />
                  </span>
                  <span className="gt">
                    {x.title}
                    <small>{x.short}</small>
                  </span>
                  <Icon name="chev" />
                </Link>
              ))}
          </aside>
        </div>
      </section>
    </>
  );
}
