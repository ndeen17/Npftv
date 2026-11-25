"use client";

import { assets, fmtNaira, staff } from "@/data/ops";
import { useDemo } from "@/lib/store";
import { fmt, toMin } from "@/lib/time";
import type { ProductionEvent } from "@/lib/types";
import { Icon } from "../Icon";

export const assetName = (id: string) => assets.find((a) => a.id === id)?.name ?? id;
export const staffName = (id: string) => staff.find((s) => s.id === id)?.name ?? id;

export function sortedProduction(list: ProductionEvent[]) {
  return [...list].sort((a, b) => (a.date === b.date ? toMin(a.start) - toMin(b.start) : a.date < b.date ? -1 : 1));
}

export function ProductionList() {
  const { state } = useDemo();
  return (
    <ul className="cal">
      {sortedProduction(state.production).map((e) => (
        <li key={e.id} className={e.id === "prod-press-briefing" ? "fresh" : ""}>
          <div className="d">
            <small>{fmt.weekdayShort(e.date)}</small>
            <b>{fmt.dayNum(e.date)}</b>
          </div>
          <div>
            <h4>{e.title}</h4>
            <p>{e.note}</p>
            <div className="res">
              {e.warn && (
                <span className="warn">
                  <Icon name="alert" />
                  {e.warn}
                </span>
              )}
              {!e.warn && e.crew.length > 0 && (
                <span>
                  <Icon name="users" />
                  {e.crew.length} crew
                </span>
              )}
              {e.assets
                .filter((a) => !a.startsWith("cam-"))
                .map((a) => (
                  <span key={a}>
                    <Icon name={a.startsWith("ob") ? "truck" : "home"} />
                    {assetName(a)}
                  </span>
                ))}
              {e.cost && (
                <span>
                  <Icon name="wallet" />
                  {fmtNaira(e.cost)}
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export interface Clash {
  what: string;
  with: string;
  suggestion: string;
}

/** Scripted crew-clash check: compares a proposed shoot with existing bookings. */
export function findClashes(events: ProductionEvent[], p: { date: string; start: string; end: string; crew: string[]; assets: string[] }): Clash[] {
  const out: Clash[] = [];
  const s = toMin(p.start);
  const e = toMin(p.end);
  for (const ev of events) {
    if (ev.date !== p.date || toMin(ev.end) <= s || toMin(ev.start) >= e) continue;
    for (const c of p.crew.filter((x) => ev.crew.includes(x))) {
      const free = staff.find((x) => x.role === staff.find((y) => y.id === c)?.role && !events.some((z) => z.crew.includes(x.id)) && x.id !== c && x.status !== "leave");
      out.push({ what: staffName(c), with: ev.title, suggestion: free ? `Use ${free.name} (${free.role.toLowerCase()}), who is free.` : "Move the shoot to the afternoon." });
    }
    for (const a of p.assets.filter((x) => ev.assets.includes(x))) {
      const alt = assets.find((x) => x.kind === assets.find((y) => y.id === a)?.kind && x.status === "available" && x.id !== a && !events.some((z) => z.assets.includes(x.id)) && !x.id.startsWith("mic") && !x.id.startsWith("light") && !x.id.startsWith("tripod") && !x.id.startsWith("laptop"));
      out.push({ what: assetName(a), with: ev.title, suggestion: alt ? `${alt.name} is available.` : "No alternative is free at that time." });
    }
  }
  for (const a of p.assets) {
    const x = assets.find((y) => y.id === a);
    if (x?.status === "repair") out.push({ what: x.name, with: "Maintenance", suggestion: `${x.note}. Drone 1 is available.` });
  }
  return out;
}
