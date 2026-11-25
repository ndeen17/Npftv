"use client";

import { Icon, type IconName } from "@/components/Icon";
import { useToast } from "@/components/Toast";
import { TopBar } from "@/components/control/Shell";
import { budget, fmtNaira, programmeSpend } from "@/data/ops";
import { states } from "@/data/places";
import { useDemo } from "@/lib/store";

function toCsv(rows: (string | number)[][]) {
  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}

function download(name: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function ReportsPage() {
  const { state } = useDemo();
  const toast = useToast();
  const reports: { t: string; d: string; icon: IconName; run: () => void }[] = [
    {
      t: "Q4 budget by department",
      d: "Used against budget, with this week's commitments",
      icon: "wallet",
      run: () => download("npftv-demo-budget.csv", toCsv([["Department", "Used", "Budget", "%"], ...budget.map((b) => [b.department, fmtNaira(b.used), fmtNaira(b.budget), Math.round((b.used / b.budget) * 100)])])),
    },
    {
      t: "Spend by programme",
      d: "Q4 to date",
      icon: "film",
      run: () => download("npftv-demo-programmes.csv", toCsv([["Programme", "Used", "Budget"], ...programmeSpend.map((p) => [p.programme, fmtNaira(p.used), fmtNaira(p.budget)])])),
    },
    {
      t: "Correspondent network, November",
      d: "Stories by desk",
      icon: "map",
      run: () => download("npftv-demo-correspondents.csv", toCsv([["Desk", "Zone", "Stories"], ...states.map((s) => [s.name, s.zone, s.stories])])),
    },
    {
      t: "Audit log",
      d: "Every action recorded in this demo session",
      icon: "log",
      run: () => download("npftv-demo-audit.csv", toCsv([["When", "Who", "Role", "Action", "Item", "AI"], ...state.audit.map((e) => [e.at, e.who, e.role, e.action, e.target ?? "", e.ai ? "yes" : ""])])),
    },
  ];
  return (
    <>
      <TopBar crumbs={["Operations", "Reports"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Reports</h1>
            <p>Export the demo data as CSV. Every figure is fictional.</p>
          </div>
        </div>
        <div className="quick-tiles" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {reports.map((r) => (
            <button
              key={r.t}
              className="pnl qt"
              style={{ textAlign: "left" }}
              onClick={() => {
                r.run();
                toast(`Exported: ${r.t}`);
              }}
            >
              <span className="ic">
                <Icon name={r.icon} />
              </span>
              <span>
                {r.t}
                <small style={{ display: "block", fontWeight: 400, color: "var(--muted)", fontSize: 13 }}>{r.d}</small>
              </span>
              <Icon name="download" style={{ marginLeft: "auto", color: "var(--muted)" }} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
