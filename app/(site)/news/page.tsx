"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { categories, categoryById } from "@/data/articles";
import { PageHead, StoryRow } from "@/components/site/bits";
import { useDemo } from "@/lib/store";

function Newsroom() {
  const { state } = useDemo();
  const cat = useSearchParams().get("cat");
  const current = cat ? categoryById(cat) : undefined;
  const list = state.articles
    .filter((a) => a.status === "published" && (!cat || a.category === cat))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <PageHead
        title={current?.name ?? "Newsroom"}
        intro="Verified news from Force Headquarters and the 36 state commands and the FCT."
        crumbs={current ? [{ href: "/news", label: "News" }, { label: current.name }] : [{ label: "News" }]}
      />
      <section className="sec" style={{ paddingTop: 36 }}>
        <div className="wrap">
          <nav className="chips" aria-label="Categories" style={{ marginBottom: 32, overflowX: "auto", flexWrap: "nowrap", paddingBottom: 4 }}>
            <Link className={`chip${!cat ? " on" : ""}`} href="/news">
              All news
            </Link>
            {categories.map((c) => (
              <Link key={c.id} className={`chip${cat === c.id ? " on" : ""}`} href={`/news?cat=${c.id}`}>
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="card-w" style={{ padding: "28px 28px 6px" }}>
            {list.length ? list.map((a) => <StoryRow key={a.id} a={a} fresh={a.author === "Musa Ibrahim"} />) : <p style={{ padding: "8px 0 28px", color: "var(--muted)" }}>No stories in this category yet.</p>}
          </div>
        </div>
      </section>
    </>
  );
}

export default function NewsPage() {
  return (
    <Suspense>
      <Newsroom />
    </Suspense>
  );
}
