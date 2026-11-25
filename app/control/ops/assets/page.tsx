"use client";

import { useState } from "react";
import { assets } from "@/data/ops";
import { TopBar } from "@/components/control/Shell";
import { useActions, useDemo } from "@/lib/store";
import type { AssetKind } from "@/lib/types";

const KINDS: { id: "all" | AssetKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ob-van", label: "OB vans" },
  { id: "camera", label: "Cameras and kit" },
  { id: "drone", label: "Drones" },
  { id: "vehicle", label: "Vehicles" },
  { id: "studio", label: "Studios" },
];

const DOT = { available: "g", booked: "y", out: "y", repair: "r" } as const;
const LABEL = { available: "Available", booked: "Booked", out: "Out", repair: "In repair" } as const;

export default function AssetsPage() {
  const { state, actor } = useDemo();
  const act = useActions();
  const [k, setK] = useState<(typeof KINDS)[number]["id"]>("all");
  const booked = new Set(state.production.flatMap((p) => p.assets));
  const list = assets.filter((a) => k === "all" || a.kind === k);
  const status = (id: string, base: keyof typeof DOT) => (state.checkedOut[id] ? "out" : base === "available" && booked.has(id) ? "booked" : base);

  return (
    <>
      <TopBar crumbs={["Operations", "Assets"]} search="Search assets" />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Assets</h1>
            <p>{assets.length} items: OB vans, cameras, drones, vehicles and studios. Check kit out and in, and track maintenance.</p>
          </div>
          <div className="seg">
            {KINDS.map((x) => (
              <button key={x.id} className={k === x.id ? "on" : ""} onClick={() => setK(x.id)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <div className="pnl tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Item</th>
                <th>Status</th>
                <th>Notes</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map((a) => {
                const s = status(a.id, a.status);
                return (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.name}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span className={`dot ${DOT[s]}`} style={{ marginRight: 8 }} />
                      {LABEL[s]}
                      {s === "booked" && a.id === "ob-1" ? ": Thursday" : ""}
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13.5 }}>{state.checkedOut[a.id] ? `Checked out by ${state.checkedOut[a.id]}` : a.note}</td>
                    <td style={{ textAlign: "right" }}>
                      {state.checkedOut[a.id] ? (
                        <button className="mini" onClick={() => act.checkIn(a.id, a.name)}>
                          Check in
                        </button>
                      ) : a.status === "available" && a.kind !== "studio" ? (
                        <button className="mini" onClick={() => act.checkOut(a.id, a.name, actor.who)}>
                          Check out
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
