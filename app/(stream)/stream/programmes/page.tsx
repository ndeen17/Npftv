"use client";

import { episodes, programmes } from "@/data/programmes";
import { Poster } from "@/components/site/bits";

export default function StreamProgrammes() {
  return (
    <section className="s-pad">
      <h1 style={{ fontSize: 34, marginBottom: 6 }}>Programmes</h1>
      <p className="s-lead">Every NPFTV programme, with episodes on demand.</p>
      <div className="posters">
        {programmes.map((p) => {
          const n = episodes.filter((e) => e.programmeId === p.id).length;
          return <Poster key={p.id} p={p} href={`/stream/on-demand?programme=${p.id}`} sub={`${p.scheduleText} · ${n} episode${n === 1 ? "" : "s"}`} />;
        })}
      </div>
    </section>
  );
}
