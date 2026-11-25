"use client";

import { mediaItems } from "@/data/public";
import { Icon } from "@/components/Icon";
import { TopBar } from "@/components/control/Shell";
import { fmt } from "@/lib/time";

export default function MediaLibrary() {
  return (
    <>
      <TopBar crumbs={["Broadcast", "Media library"]} search="Search media" />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Media library</h1>
            <p>Approved images, clips and documents, with usage rights. Only these images are cleared for the demo.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {mediaItems.map((m) => (
            <div key={m.id} className="pnl" style={{ overflow: "hidden" }}>
              <div style={{ aspectRatio: "16/10", background: "var(--indigo)", display: "grid", placeItems: "center", color: "var(--yellow)" }}>
                {m.img ? <img src={`/images/${m.img}.webp`} alt="" style={{ width: "100%", height: "100%", objectFit: m.img === "logo" ? "contain" : "cover", padding: m.img === "logo" ? 24 : 0 }} /> : <Icon name="file" style={{ width: 44, height: 44 }} />}
              </div>
              <div style={{ padding: 14, display: "grid", gap: 6 }}>
                <b style={{ fontSize: 14 }}>{m.title}</b>
                <small style={{ color: "var(--muted)" }}>
                  {m.kind} · {m.size} · {fmt.dayMonShort(m.date)}
                </small>
                <span className={`tag ${m.rights === "Free to use with credit" ? "tag-green" : m.rights === "Editorial use only" ? "tag-feat" : "tag-soft"}`} style={{ justifySelf: "start" }}>
                  {m.rights}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="pnl" style={{ padding: 16, fontSize: 14, color: "var(--muted)" }}>
          <b style={{ color: "var(--ink)" }}>Image rules:</b> no photos of identifiable public figures, and no AI-generated images of people. Ask the Photography desk for originals before launch.
        </div>
      </div>
    </>
  );
}
