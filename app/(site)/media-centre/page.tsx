"use client";

import { useState } from "react";
import { mediaItems } from "@/data/public";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { PageHead } from "@/components/site/bits";
import { fmt } from "@/lib/time";

const KINDS = [
  { id: "all", label: "Everything" },
  { id: "photo", label: "Photos" },
  { id: "video", label: "Videos" },
  { id: "document", label: "Downloads" },
] as const;

export default function MediaCentrePage() {
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("all");
  const toast = useToast();
  const list = mediaItems.filter((m) => kind === "all" || m.kind === kind);
  return (
    <>
      <PageHead title="Media centre" intro="Photos, video and documents for the press and the public. Each item shows how you may use it." crumbs={[{ label: "Media centre" }]} />
      <section className="sec" style={{ paddingTop: 36 }}>
        <div className="wrap">
          <div className="chips" style={{ marginBottom: 28 }}>
            {KINDS.map((k) => (
              <button key={k.id} className={`chip${kind === k.id ? " on" : ""}`} onClick={() => setKind(k.id)}>
                {k.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((m) => (
              <article key={m.id} className="card-w" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ aspectRatio: "16/10", background: "var(--indigo)", position: "relative", display: "grid", placeItems: "center", color: "var(--yellow)" }}>
                  {m.img ? <img src={`/images/${m.img}.webp`} alt="" style={{ width: "100%", height: "100%", objectFit: m.img === "logo" ? "contain" : "cover", padding: m.img === "logo" ? 30 : 0 }} /> : <Icon name="file" style={{ width: 56, height: 56, strokeWidth: 1.4 }} />}
                  {m.kind === "video" && (
                    <span style={{ position: "absolute", width: 56, height: 56, borderRadius: "50%", background: "var(--yellow)", color: "var(--indigo)", display: "grid", placeItems: "center" }}>
                      <Icon name="play" fill style={{ marginLeft: 3 }} />
                    </span>
                  )}
                </div>
                <div style={{ padding: 16, display: "grid", gap: 8, flex: 1 }}>
                  <div className="meta">
                    <span className="cat">{m.kind === "document" ? "Download" : m.kind === "photo" ? "Photo" : "Video"}</span>
                    <span>{fmt.dayMonthYear(m.date)}</span>
                    <span>{m.size}</span>
                  </div>
                  <h3 style={{ fontSize: 18, color: "var(--indigo)" }}>{m.title}</h3>
                  <span className={`tag ${m.rights === "Free to use with credit" ? "tag-green" : m.rights === "Editorial use only" ? "tag-feat" : "tag-soft"}`} style={{ justifySelf: "start" }}>
                    {m.rights}
                  </span>
                  <div style={{ marginTop: "auto", paddingTop: 6 }}>
                    <button className="btn btn-sm btn-line" onClick={() => toast(m.rights === "Request permission" ? "Demo: permission requests go to the Photography desk." : "Demo: downloads are switched off in the prototype.")}>
                      <Icon name={m.rights === "Request permission" ? "mail" : "download"} /> {m.rights === "Request permission" ? "Request permission" : "Download"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
