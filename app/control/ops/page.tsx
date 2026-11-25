"use client";

import Link from "next/link";
import { assets, kpis } from "@/data/ops";
import { TopBar } from "@/components/control/Shell";
import { ApprovalList, BudgetBars, CorrespondentPanel, DailyBrief, KpiTile } from "@/components/control/erp";
import { ProductionList } from "@/components/control/production";
import { useDemo } from "@/lib/store";
import { fmt, watParts } from "@/lib/time";

export default function OpsOverview() {
  const { state, now } = useDemo();
  const p = watParts(now);
  const waiting = state.approvals.filter((a) => a.status === "waiting");
  const bigPurchases = waiting.filter((a) => a.amountNote === "Over ₦5m").length;
  const ob1Booked = state.production.some((x) => x.assets.includes("ob-1"));
  const greeting = p.minutes < 720 ? "Good morning" : p.minutes < 1020 ? "Good afternoon" : "Good evening";
  const camsFree = assets.filter((a) => a.id.startsWith("cam-") && a.status === "available").length;

  return (
    <>
      <TopBar crumbs={["Operations", "Overview"]} search="Search assets, staff, requests" />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>{greeting}. Here&apos;s the network today.</h1>
            <p>
              {fmt.long(p.date)}, {p.hhmm} WAT
            </p>
          </div>
          <Link className="btn btn-line btn-sm" href="/control/ops/reports">
            Export report
          </Link>
        </div>

        <div className="kpis">
          <KpiTile icon="play" label="Watching live now" value={kpis.watching.toLocaleString("en-GB")} note={kpis.watchingNote} up />
          <KpiTile icon="radio" label="Stream uptime, November" value={kpis.uptime} note={kpis.uptimeNote} />
          <KpiTile icon="wallet" label="Q4 budget used" value="₦184.2m" note="of ₦270m" meter={68} />
          <KpiTile icon="stamp" label="Waiting for your approval" value={String(waiting.length)} note={bigPurchases ? `${bigPurchases} are purchases over ₦5m` : "No large purchases waiting"} />
        </div>

        <div className="row2">
          <DailyBrief />
          <div className="pnl">
            <div className="p-hd">
              <h3>Waiting for your approval</h3>
              <Link href="/control/ops/approvals">All {waiting.length}</Link>
            </div>
            <ApprovalList limit={4} />
          </div>
        </div>

        <div className="row3">
          <div className="pnl">
            <div className="p-hd">
              <h3>Production this week</h3>
              <Link href="/control/ops/production">Calendar</Link>
            </div>
            <ProductionList />
          </div>
          <div className="pnl">
            <div className="p-hd">
              <h3>Q4 budget by department</h3>
              <Link href="/control/ops/finance">Finance</Link>
            </div>
            <BudgetBars />
          </div>
          <div className="pnl">
            <div className="p-hd">
              <h3>Assets</h3>
              <Link href="/control/ops/assets">All assets</Link>
            </div>
            <ul className="assets">
              <li>
                <span className={`dot ${ob1Booked ? "y" : "g"}`} />
                <b>OB Van 1</b>
                <small>{ob1Booked ? "Booked Thursday" : "Available"}</small>
              </li>
              <li>
                <span className="dot g" />
                <b>OB Van 2</b>
                <small>Available</small>
              </li>
              <li>
                <span className="dot g" />
                <b>Camera kits</b>
                <small>{camFreeText(camsFree)}</small>
              </li>
              <li>
                <span className="dot r" />
                <b>Drones</b>
                <small>2 of 3, Drone 2 in repair</small>
              </li>
              <li>
                <span className="dot y" />
                <b>Vehicles</b>
                <small>6 of 9 out today</small>
              </li>
            </ul>
          </div>
        </div>

        <CorrespondentPanel />
      </div>
    </>
  );
}

function camFreeText(n: number) {
  return `${n} of 18 available`;
}
