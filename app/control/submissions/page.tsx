"use client";

import Link from "next/link";
import { categoryById } from "@/data/articles";
import { stateById } from "@/data/places";
import { Icon } from "@/components/Icon";
import { TopBar } from "@/components/control/Shell";
import { useDemo } from "@/lib/store";

export default function SubmissionsPage() {
  const { state } = useDemo();
  const subs = [...state.submissions].sort((a, b) => (a.triage.urgency === b.triage.urgency ? (a.at < b.at ? 1 : -1) : a.triage.urgency === "priority" ? -1 : 1));
  return (
    <>
      <TopBar crumbs={["Newsroom", "Submissions"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Submissions</h1>
            <p>Stories from the 37 correspondent desks, sorted by AI triage. Open one to review it with the AI copy desk.</p>
          </div>
        </div>
        <div className="pnl">
          <div className="p-hd">
            <h3>Waiting for review ({subs.length})</h3>
            <span className="tag tag-ai">
              <Icon name="spark" style={{ width: 13, height: 13 }} /> AI triage
            </span>
          </div>
          {subs.length === 0 && <div className="empty">The inbox is empty. Nice work.</div>}
          {subs.map((s) => {
            const a = state.articles.find((x) => x.id === s.articleId);
            if (!a) return null;
            const dup = s.triage.possibleDuplicateOf ? state.articles.find((x) => x.id === s.triage.possibleDuplicateOf) : undefined;
            return (
              <Link key={s.id} href={`/control/stories/${a.id}`} className="rowlink">
                <div>
                  <h4>{a.title}</h4>
                  <p>
                    {s.from}, {s.desk} desk · today at {s.at}
                    {a.photos ? ` · ${a.photos.length} photos` : ""}
                  </p>
                  <div className="res" style={{ marginTop: 8 }}>
                    <span>
                      <Icon name="file" />
                      {categoryById(s.triage.category)?.name}
                    </span>
                    <span>
                      <Icon name="map" />
                      {stateById(s.triage.state)?.name}
                    </span>
                    <span className={s.triage.urgency === "priority" ? "bad" : ""}>
                      <Icon name={s.triage.urgency === "priority" ? "alert" : "clock"} />
                      {s.triage.urgency === "priority" ? "Priority: sensitive details found" : "Routine"}
                    </span>
                    {dup && (
                      <span className="warn">
                        <Icon name="alert" />
                        Possible duplicate of “{dup.title}”
                      </span>
                    )}
                  </div>
                </div>
                <span className="mini pri">Review</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
