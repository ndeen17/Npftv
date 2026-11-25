"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { episodes, programmes } from "@/data/programmes";
import { EpisodeCard } from "@/components/stream/parts";

const TOPICS: Record<string, string[]> = {
  "Road safety": ["road", "travel", "festive", "patrol", "driver"],
  "Online safety": ["loan", "otp", "online", "scam", "app"],
  Community: ["community", "watch", "neighbourhood", "forum", "trust", "residents"],
  "Inside the Force": ["unit", "history", "bomb", "disposal", "training"],
};

function Library() {
  const params = useSearchParams();
  const router = useRouter();
  const programme = params.get("programme") ?? "all";
  const q = (params.get("q") ?? "").toLowerCase();
  const [topic, setTopic] = useState<string>("all");
  const [sort, setSort] = useState<"new" | "old">("new");

  const list = episodes
    .filter((e) => programme === "all" || e.programmeId === programme)
    .filter((e) => topic === "all" || TOPICS[topic].some((k) => `${e.title} ${e.summary}`.toLowerCase().includes(k)))
    .filter((e) => !q || `${e.title} ${e.summary} ${programmes.find((p) => p.id === e.programmeId)?.title}`.toLowerCase().includes(q))
    .sort((a, b) => (sort === "new" ? (a.date < b.date ? 1 : -1) : a.date < b.date ? -1 : 1));

  const setProgramme = (id: string) => router.replace(id === "all" ? "/stream/on-demand" : `/stream/on-demand?programme=${id}`);

  return (
    <section className="s-pad">
      <h1 style={{ fontSize: 34, marginBottom: 6 }}>On demand</h1>
      <p className="s-lead">{q ? `Results for “${params.get("q")}”.` : "Every episode, free to watch. Filter by programme, topic or date."}</p>
      <div className="filters">
        <select value={programme} onChange={(e) => setProgramme(e.target.value)} aria-label="Programme">
          <option value="all">All programmes</option>
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <button className={topic === "all" ? "on" : ""} onClick={() => setTopic("all")}>
          All topics
        </button>
        {Object.keys(TOPICS).map((t) => (
          <button key={t} className={topic === t ? "on" : ""} onClick={() => setTopic(t)}>
            {t}
          </button>
        ))}
        <select value={sort} onChange={(e) => setSort(e.target.value as "new" | "old")} aria-label="Sort by date">
          <option value="new">Newest first</option>
          <option value="old">Oldest first</option>
        </select>
      </div>
      {list.length ? (
        <div className="eps grid">
          {list.map((e) => (
            <EpisodeCard key={e.id} e={e} />
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--muted)" }}>No episodes match. Try another filter.</p>
      )}
    </section>
  );
}

export default function OnDemandPage() {
  return (
    <Suspense>
      <Library />
    </Suspense>
  );
}
