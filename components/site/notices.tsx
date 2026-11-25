"use client";

import Link from "next/link";
import { stateById } from "@/data/places";
import type { Notice } from "@/data/notices";
import { fmt, watParts } from "@/lib/time";
import { Icon } from "../Icon";

/** A neutral silhouette. The demo never shows photos of people (docs/plan-v2.md, section 3). */
export function Silhouette({ kind }: { kind: Notice["kind"] }) {
  return (
    <div className={`sil ${kind}`} aria-hidden>
      <svg viewBox="0 0 120 120" role="presentation">
        <circle cx="60" cy="44" r="22" />
        <path d="M18 120c2-26 20-42 42-42s40 16 42 42z" />
      </svg>
      <span>Photo withheld in this demo</span>
    </div>
  );
}

export function daysSince(date: string, now: Date) {
  const today = watParts(now).date;
  const a = Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10));
  const b = Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 1, +today.slice(8, 10));
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

export function StatusLabel({ n }: { n: Notice }) {
  if (n.status === "found") return <span className="nlabel found">Found safe</span>;
  if (n.status === "withdrawn") return <span className="nlabel closed">Withdrawn</span>;
  return <span className={`nlabel ${n.kind}`}>{n.kind === "missing" ? "Missing" : "Wanted"}</span>;
}

export function PersonCard({ n, now }: { n: Notice; now: Date }) {
  const st = stateById(n.state);
  const days = daysSince(n.lastSeenDate, now);
  return (
    <Link href={`/safety/${n.kind}/${n.id}`} className={`person ${n.kind}${n.status === "found" ? " is-found" : ""}`}>
      <div className="person-top">
        <Silhouette kind={n.kind} />
        <StatusLabel n={n} />
      </div>
      <div className="person-body">
        <b>
          {n.name}
          {n.alias && <small> &ldquo;{n.alias}&rdquo;</small>}
        </b>
        <span className="person-meta">
          {n.age}, {n.sex.toLowerCase()} · {st?.name ?? ""}
        </span>
        {n.kind === "missing" ? (
          <span className="person-line">
            <Icon name="pin" /> Last seen {n.lastSeenPlace.split(",")[0]}
            {n.status === "published" && <em>{days === 0 ? "today" : `${days} day${days === 1 ? "" : "s"} ago`}</em>}
          </span>
        ) : (
          <span className="person-line">
            <Icon name="alert" /> Wanted for {n.offence?.toLowerCase()}
          </span>
        )}
        <span className="person-src">Issued by {n.issuedBy}</span>
      </div>
    </Link>
  );
}

export function issuedLine(n: Notice) {
  return `Issued by ${n.issuedBy} on ${fmt.dayMonthYear(n.issuedOn)}. Published by NPFTV.`;
}
