"use client";

import { fmtNaira } from "@/data/ops";
import { programmeById } from "@/data/programmes";
import { TopBar } from "@/components/control/Shell";
import { KpiTile } from "@/components/control/erp";
import { useDemo } from "@/lib/store";

export default function SponsorshipPage() {
  const { state } = useDemo();
  const active = state.sponsorships.filter((s) => s.status === "active");
  return (
    <>
      <TopBar crumbs={["Operations", "Sponsorship"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Sponsorship and airtime</h1>
            <p>Partners, public service campaigns and sponsored segments booked against the schedule. All partners are fictional.</p>
          </div>
        </div>
        <div className="kpis">
          <KpiTile icon="radio" label="Active campaigns" value={String(active.length)} note="on air this week" />
          <KpiTile icon="wallet" label="Active income" value={fmtNaira(active.reduce((a, s) => a + s.value, 0))} note="this quarter" />
          <KpiTile icon="stamp" label="Proposals" value={String(state.sponsorships.filter((s) => s.status === "proposed").length)} note="waiting for approval" />
          <KpiTile icon="file" label="Editorial rule" value="Labelled" note="every sponsored segment is marked on air" />
        </div>
        <div className="pnl tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Campaign</th>
                <th>Programme</th>
                <th className="num">Weeks</th>
                <th className="num">Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.sponsorships.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.partner}</td>
                  <td>{s.campaign}</td>
                  <td>{programmeById(s.programme)?.title}</td>
                  <td className="num">{s.weeks}</td>
                  <td className="num">{s.value ? fmtNaira(s.value) : "PSA (no fee)"}</td>
                  <td>
                    <span className={`tag ${s.status === "active" ? "tag-green" : s.status === "proposed" ? "tag-feat" : "tag-soft"}`}>{s.status[0].toUpperCase() + s.status.slice(1)}</span>
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
