"use client";

import { useState } from "react";
import { staff } from "@/data/ops";
import { TopBar } from "@/components/control/Shell";
import { KpiTile } from "@/components/control/erp";
import { useDemo } from "@/lib/store";

const DEPTS = ["All", "News", "Broadcast operations", "Programmes", "Digital", "Administration"];
const STATUS = { "on-duty": ["g", "On duty"], field: ["y", "In the field"], off: ["m", "Off today"], leave: ["r", "On leave"] } as const;

export default function PeoplePage() {
  const { state } = useDemo();
  const [d, setD] = useState("All");
  const crew = new Set(state.production.flatMap((p) => p.crew));
  const list = staff.filter((s) => d === "All" || s.department === d);
  return (
    <>
      <TopBar crumbs={["Operations", "People"]} search="Search staff" />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>People</h1>
            <p>Civilian staff and seconded police officers. All names are fictional.</p>
          </div>
        </div>
        <div className="kpis">
          <KpiTile icon="users" label="Staff" value={String(staff.length)} note={`${staff.filter((s) => s.rank).length} seconded officers`} />
          <KpiTile icon="check" label="On duty today" value={String(staff.filter((s) => s.status === "on-duty").length)} note="across all departments" />
          <KpiTile icon="map" label="In the field" value={String(staff.filter((s) => s.status === "field").length)} note="including correspondents" />
          <KpiTile icon="calendar" label="On leave" value={String(staff.filter((s) => s.status === "leave").length)} note="1 request waiting for approval" />
        </div>
        <div className="seg" style={{ justifySelf: "start" }}>
          {DEPTS.map((x) => (
            <button key={x} className={d === x ? "on" : ""} onClick={() => setD(x)}>
              {x}
            </button>
          ))}
        </div>
        <div className="pnl tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Rank</th>
                <th>Today</th>
                <th>This week</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.role}</td>
                  <td>{s.department}</td>
                  <td>{s.rank ?? <span style={{ color: "var(--muted)" }}>Civilian</span>}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <span className={`dot ${STATUS[s.status][0]}`} style={{ marginRight: 8 }} />
                    {STATUS[s.status][1]}
                  </td>
                  <td>{crew.has(s.id) ? <span className="tag tag-feat">Crewed on a shoot</span> : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
