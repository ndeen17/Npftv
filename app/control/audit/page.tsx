"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { TopBar } from "@/components/control/Shell";
import { useDemo } from "@/lib/store";
import { fmt, isoDate, isoTime } from "@/lib/time";

export default function AuditLog() {
  const { state } = useDemo();
  const [f, setF] = useState<"all" | "ai" | "people">("all");
  const list = state.audit.filter((e) => f === "all" || (f === "ai" ? e.ai : !e.ai));
  return (
    <>
      <TopBar crumbs={["Audit log"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Audit log</h1>
            <p>Every action, recorded: who did what, and when. AI drafted; people approved.</p>
          </div>
          <div className="seg">
            {(
              [
                ["all", "Everything"],
                ["people", "People"],
                ["ai", "AI"],
              ] as const
            ).map(([k, l]) => (
              <button key={k} className={f === k ? "on" : ""} onClick={() => setF(k)}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="pnl tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>When (WAT)</th>
                <th>Who</th>
                <th>Action</th>
                <th>Item</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id}>
                  <td style={{ whiteSpace: "nowrap" }} className="cond">
                    {fmt.dayMonShort(isoDate(e.at))}, {isoTime(e.at)}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <b style={{ fontWeight: 600 }}>{e.who}</b>
                    <small style={{ display: "block", color: "var(--muted)" }}>{e.role}</small>
                  </td>
                  <td>
                    {e.ai && (
                      <span className="tag tag-ai" style={{ marginRight: 6 }}>
                        <Icon name="spark" style={{ width: 12, height: 12 }} /> AI
                      </span>
                    )}
                    {e.action}
                  </td>
                  <td style={{ color: "var(--muted)" }}>{e.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
