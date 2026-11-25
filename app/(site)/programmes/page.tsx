"use client";

import { programmes } from "@/data/programmes";
import { PageHead, Poster } from "@/components/site/bits";

export default function ProgrammesPage() {
  return (
    <>
      <PageHead title="Programmes" intro="Every NPFTV show, with full episodes on demand on NPFTV Stream." crumbs={[{ label: "Programmes" }]} />
      <section className="sec" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 24 }}>
            {programmes.map((p) => (
              <Poster key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
