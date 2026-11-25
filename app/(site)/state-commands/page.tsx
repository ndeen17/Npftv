"use client";

import Link from "next/link";
import { useState } from "react";
import { stateSlug, states, tier } from "@/data/places";
import { PageHead } from "@/components/site/bits";

const ZONES = ["North West", "North East", "North Central", "South West", "South East", "South South"];

export default function StateCommandsPage() {
  const [hover, setHover] = useState<string | null>(null);
  const h = states.find((s) => s.id === hover);
  return (
    <>
      <PageHead title="State commands" intro="News, contacts and programmes from the 36 state commands and the Federal Capital Territory. Choose a state on the map." crumbs={[{ label: "State commands" }]} />
      <section className="sec" style={{ paddingTop: 48 }}>
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] items-start">
          <div>
            <div className="tmap" role="list" aria-label="Map of Nigeria's states">
              {states.map((s) => (
                <Link
                  key={s.id}
                  role="listitem"
                  href={`/state-commands/${stateSlug(s)}`}
                  className={tier(s.stories)}
                  style={{ gridColumn: s.col, gridRow: s.row }}
                  aria-label={`${s.name}: ${s.stories} stories this month`}
                  onMouseEnter={() => setHover(s.id)}
                  onFocus={() => setHover(s.id)}
                  onMouseLeave={() => setHover(null)}
                >
                  {s.id}
                </Link>
              ))}
            </div>
            <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 14 }}>
              {h ? (
                <>
                  <b style={{ color: "var(--indigo)" }}>{h.name}</b>, capital {h.capital}. {h.stories} stories in November.
                </>
              ) : (
                "Tiles are shaded by the number of stories each command sent in November. Darker means more."
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {ZONES.map((z) => (
              <div key={z}>
                <h3 style={{ color: "var(--indigo)", fontSize: 19, marginBottom: 8 }}>{z}</h3>
                <ul style={{ listStyle: "none", display: "grid", gap: 4 }}>
                  {states
                    .filter((s) => s.zone === z)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((s) => (
                      <li key={s.id}>
                        <Link className="link" href={`/state-commands/${stateSlug(s)}`} style={{ fontWeight: 500 }}>
                          {s.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
