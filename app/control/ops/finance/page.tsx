"use client";

import { budget, fmtNaira, programmeSpend } from "@/data/ops";
import { TopBar } from "@/components/control/Shell";
import { BudgetBars, KpiTile } from "@/components/control/erp";
import { useDemo } from "@/lib/store";

export default function FinancePage() {
  const { state } = useDemo();
  const committed: Record<string, number> = {};
  for (const p of state.production) if (p.cost && p.budgetLine) committed[p.budgetLine] = (committed[p.budgetLine] ?? 0) + p.cost;
  const total = Object.values(committed).reduce((a, b) => a + b, 0);
  const digital = budget.find((b) => b.id === "digital")!;

  return (
    <>
      <TopBar crumbs={["Operations", "Finance"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Finance</h1>
            <p>Q4 2026: budget against actual spend, by department and programme.</p>
          </div>
        </div>
        <div className="kpis">
          <KpiTile icon="wallet" label="Q4 budget used" value="₦184.2m" note="of ₦270m" meter={68} />
          <KpiTile icon="calendar" label="Time left in quarter" value="5 weeks" note="No department is over 80%" />
          <KpiTile icon="truck" label="Committed this week" value={total ? fmtNaira(total) : "₦0"} note={total ? "Thursday's press briefing" : "No new bookings"} />
          <KpiTile icon="box" label="Digital, remaining" value={fmtNaira(digital.budget - digital.used)} note="60% used" />
        </div>
        <div className="row2">
          <div className="pnl">
            <div className="p-hd">
              <h3>Q4 budget by department</h3>
            </div>
            <BudgetBars committed={committed} />
          </div>
          <div className="pnl tbl-wrap">
            <div className="p-hd">
              <h3>Spend by programme</h3>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Programme</th>
                  <th className="num">Used</th>
                  <th className="num">Budget</th>
                  <th className="num">%</th>
                </tr>
              </thead>
              <tbody>
                {programmeSpend.map((p) => (
                  <tr key={p.programme}>
                    <td style={{ fontWeight: 600 }}>{p.programme}</td>
                    <td className="num">{fmtNaira(p.used)}</td>
                    <td className="num">{fmtNaira(p.budget)}</td>
                    <td className="num">{Math.round((p.used / p.budget) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
