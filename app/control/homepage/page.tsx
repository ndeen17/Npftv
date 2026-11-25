"use client";

import Link from "next/link";
import { categoryById } from "@/data/articles";
import { Icon } from "@/components/Icon";
import { TopBar } from "@/components/control/Shell";
import { useActions, useDemo } from "@/lib/store";

export default function HomepageCurator() {
  const { state } = useDemo();
  const act = useActions();
  const published = state.articles.filter((a) => a.status === "published").sort((a, b) => (a.date < b.date ? 1 : -1));
  const featured = state.featuredIds.map((id) => state.articles.find((a) => a.id === id)).filter((a): a is NonNullable<typeof a> => !!a);

  const move = (i: number, d: number) => {
    const ids = [...state.featuredIds];
    const j = i + d;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    act.setFeatured(ids);
  };

  return (
    <>
      <TopBar crumbs={["Newsroom", "Homepage"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Homepage curator</h1>
            <p>Choose the three stories in “News and press releases” and manage the Latest ticker.</p>
          </div>
          <Link className="btn btn-line btn-sm" href="/" target="_blank">
            <Icon name="eye" /> View homepage
          </Link>
        </div>
        <div className="row2">
          <div className="pnl">
            <div className="p-hd">
              <h3>Featured stories (in order)</h3>
            </div>
            {featured.map((a, i) => (
              <div key={a.id} className="rowlink">
                <div>
                  <h4>
                    {i + 1}. {a.title}
                  </h4>
                  <p>{categoryById(a.category)?.name}</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="mini" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                    ↑
                  </button>
                  <button className="mini" onClick={() => move(i, 1)} disabled={i === featured.length - 1} aria-label="Move down">
                    ↓
                  </button>
                  <button className="mini danger" onClick={() => act.setFeatured(state.featuredIds.filter((x) => x !== a.id))}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="p-hd" style={{ borderTop: "1px solid var(--line)" }}>
              <h3>Latest ticker</h3>
            </div>
            {state.ticker.map((t, i) => (
              <div key={i} className="rowlink">
                <div>
                  <h4>
                    <span className="cond" style={{ color: t.breaking ? "var(--red)" : "var(--yellow-deep)", marginRight: 8 }}>
                      {t.breaking ? "Breaking" : t.time}
                    </span>
                    {t.text}
                  </h4>
                </div>
                <button className="mini danger" onClick={() => act.removeTicker(i)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="pnl">
            <div className="p-hd">
              <h3>Published stories</h3>
            </div>
            <div style={{ maxHeight: 560, overflowY: "auto" }}>
              {published.map((a) => {
                const on = state.featuredIds.includes(a.id);
                return (
                  <div key={a.id} className="rowlink">
                    <div>
                      <h4 style={{ fontSize: 14 }}>{a.title}</h4>
                      <p>{categoryById(a.category)?.short}</p>
                    </div>
                    <button className={`mini${on ? " ok" : ""}`} disabled={on} onClick={() => act.setLead(a.id, a.title)}>
                      {on ? "Featured" : "Feature first"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
