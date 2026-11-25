"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { categoryById } from "@/data/articles";
import { TopBar } from "@/components/control/Shell";
import { useActions, useDemo } from "@/lib/store";
import { fmt, isoDate } from "@/lib/time";
import type { ArticleStatus } from "@/lib/types";

const FILTERS: { id: "all" | ArticleStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "draft", label: "Drafts" },
  { id: "submitted", label: "Submitted" },
  { id: "returned", label: "Returned" },
  { id: "published", label: "Published" },
  { id: "withdrawn", label: "Withdrawn" },
];

const BADGE: Record<string, string> = { draft: "st-draft", submitted: "st", returned: "st-returned", published: "st-published", withdrawn: "st-returned", approved: "st-published", scheduled: "st", rejected: "st-returned" };

function Stories() {
  const { state, role } = useDemo();
  const act = useActions();
  const q = (useSearchParams().get("q") ?? "").toLowerCase();
  const [f, setF] = useState<(typeof FILTERS)[number]["id"]>(role === "reporter" ? "all" : "all");
  const mine = role === "reporter";
  const list = state.articles
    .filter((a) => !mine || a.author === "Musa Ibrahim")
    .filter((a) => f === "all" || a.status === f)
    .filter((a) => !q || `${a.title} ${a.summary}`.toLowerCase().includes(q))
    .sort((a, b) => (a.status === "draft" ? -1 : b.status === "draft" ? 1 : a.date < b.date ? 1 : -1));

  return (
    <>
      <TopBar crumbs={["Newsroom", mine ? "My stories" : "Stories"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>{mine ? "My stories" : "Stories"}</h1>
            <p>{mine ? "Kano desk. Drafts stay on your device until you submit them." : `${state.articles.filter((a) => a.status === "published").length} published, ${state.submissions.length} waiting for review.`}</p>
          </div>
          <div className="seg">
            {FILTERS.map((x) => (
              <button key={x.id} className={f === x.id ? "on" : ""} onClick={() => setF(x.id)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <div className="pnl tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Headline</th>
                <th>Category</th>
                <th>Author</th>
                <th>Date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id}>
                  <td style={{ maxWidth: 420 }}>
                    <Link href={`/control/stories/${a.id}`} style={{ fontWeight: 600, color: "var(--indigo)" }}>
                      {a.title}
                    </Link>
                  </td>
                  <td>{categoryById(a.category)?.short}</td>
                  <td>{a.author}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{fmt.dayMonShort(isoDate(a.date))}</td>
                  <td>
                    <span className={`tag ${BADGE[a.status]}`}>{a.status[0].toUpperCase() + a.status.slice(1)}</span>
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                    {a.status === "published" && !mine && role !== "network-director" ? (
                      <button className="mini danger" onClick={() => act.setArticleStatus(a.id, "withdrawn", a.title, "Withdrew a published story")}>
                        Withdraw
                      </button>
                    ) : a.status === "withdrawn" && !mine ? (
                      <button className="mini" onClick={() => act.setArticleStatus(a.id, "published", a.title, "Republished a story")}>
                        Republish
                      </button>
                    ) : (
                      <Link className="mini" href={`/control/stories/${a.id}`}>
                        Open
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!list.length && <div className="empty">No stories match.</div>}
        </div>
      </div>
    </>
  );
}

export default function StoriesPage() {
  return (
    <Suspense>
      <Stories />
    </Suspense>
  );
}
