"use client";

import { states, tier } from "@/data/places";
import { TopBar } from "@/components/control/Shell";
import { CorrespondentPanel } from "@/components/control/erp";

// Average response time (hours) from desk to newsroom, fictional, derived from volume.
const response = (n: number) => (n >= 20 ? 1.2 : n >= 10 ? 2.1 : n >= 6 ? 3.4 : 5.8);

export default function CorrespondentsPage() {
  const sorted = [...states].sort((a, b) => b.stories - a.stories);
  return (
    <>
      <TopBar crumbs={["Operations", "Correspondents"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Correspondents</h1>
            <p>The 36 state desks and the FCT: stories sent this month and how quickly they reach the newsroom.</p>
          </div>
        </div>
        <CorrespondentPanel />
        <div className="pnl tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Desk</th>
                <th>Zone</th>
                <th className="num">Stories, November</th>
                <th className="num">Avg. time to newsroom</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.zone}</td>
                  <td className="num">{s.stories}</td>
                  <td className="num">{response(s.stories)} hrs</td>
                  <td>
                    <span className={`tag ${tier(s.stories) === "l4" ? "tag-green" : tier(s.stories) === "" ? "tag-red" : "tag-soft"}`}>{tier(s.stories) === "l4" ? "Very active" : tier(s.stories) === "l3" ? "Active" : tier(s.stories) === "l2" ? "Steady" : "Needs support"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
