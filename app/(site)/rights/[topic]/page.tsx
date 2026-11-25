"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { rightsTopicById, rightsTopics } from "@/data/rights";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { PageHead } from "@/components/site/bits";
import { CanCannot, EmergencyStrip, InShort, LawList, LegalNote, NextLink, NumberedSteps } from "@/components/site/civic";

export default function RightsTopicPage() {
  const { topic } = useParams<{ topic: string }>();
  const toast = useToast();
  const t = rightsTopicById(topic);

  if (!t) {
    return (
      <section className="sec">
        <div className="wrap">
          <h1 style={{ color: "var(--indigo)" }}>Topic not found</h1>
          <Link className="link" href="/rights">
            Your rights
          </Link>
        </div>
      </section>
    );
  }

  // A short, shareable summary (WhatsApp is how most Nigerians share information).
  const shareText = `${t.title} (NPFTV, Know your rights)\n\n${t.inShort.map((x) => `• ${x}`).join("\n")}\n\nRead more on npftv.net/rights/${t.id}`;
  const others = rightsTopics.filter((x) => x.id !== t.id).slice(0, 4);

  return (
    <>
      <PageHead title={t.title} intro={t.situation} crumbs={[{ href: "/rights", label: "Your rights" }, { label: t.title }]}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
          <a className="btn btn-yellow btn-sm" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
            <Icon name="share" /> Share on WhatsApp
          </a>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              navigator.clipboard?.writeText(shareText).catch(() => {});
              toast("Summary copied");
            }}
          >
            <Icon name="copy" /> Copy summary
          </button>
        </div>
      </PageHead>

      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div style={{ display: "grid", gap: 28, alignContent: "start" }}>
            <InShort items={t.inShort} />
            <CanCannot can={t.can} cannot={t.cannot} />
            <div>
              <h2 style={{ color: "var(--indigo)", fontSize: 26, marginBottom: 12 }}>What you can do</h2>
              <NumberedSteps items={t.whatToDo} />
            </div>
            <div className="role-note" style={{ borderLeftColor: "var(--yellow-deep)" }}>
              <Icon name="stamp" />
              <p>
                <b>If your rights were not respected</b>, you can complain about the officer. NPFTV can&apos;t take complaints, but we explain who handles them and how to prepare yours.{" "}
                <Link href="/rights/complaints" style={{ color: "var(--indigo)", textDecoration: "underline" }}>
                  How complaints are handled
                </Link>
              </p>
            </div>
            <div>
              <h2 style={{ color: "var(--indigo)", fontSize: 26, marginBottom: 12 }}>The law</h2>
              <LawList items={t.law} />
              <LegalNote />
            </div>
          </div>
          <aside style={{ display: "grid", gap: 14, alignContent: "start" }}>
            <EmergencyStrip />
            <h3 style={{ color: "var(--indigo)", fontSize: 20, marginTop: 10 }}>Other situations</h3>
            {others.map((o) => (
              <NextLink key={o.id} href={`/rights/${o.id}`} icon={o.icon} title={o.title} text={o.situation} />
            ))}
            <Link className="link" href="/rights">
              All topics <Icon name="arrow" />
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
