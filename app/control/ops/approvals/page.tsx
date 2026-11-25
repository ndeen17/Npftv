"use client";

import Link from "next/link";
import { TopBar } from "@/components/control/Shell";
import { ApprovalList } from "@/components/control/erp";
import { useDemo } from "@/lib/store";

export default function ApprovalsPage() {
  const { state, role } = useDemo();
  const waiting = state.approvals.filter((a) => a.status === "waiting").length;
  const canDecide = role === "network-director" || role === "super-admin";
  return (
    <>
      <TopBar crumbs={["Operations", "Approvals"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Approvals</h1>
            <p>One queue for articles, alerts, purchases, leave and sponsorship. {waiting} waiting.</p>
          </div>
        </div>
        {!canDecide && <div className="pnl" style={{ padding: 14, fontSize: 14, color: "var(--muted)" }}>You can see this queue, but only the Network Director can approve these items. Switch role from the sidebar to try it.</div>}
        <div className="pnl">
          <ApprovalList showActions />
        </div>
        {state.submissions.length > 0 && (
          <div className="pnl" style={{ padding: 14, fontSize: 14 }}>
            {state.submissions.length} stories are waiting for an editor in <Link href="/control/submissions" style={{ color: "var(--indigo)", fontWeight: 600 }}>Submissions</Link>.
          </div>
        )}
      </div>
    </>
  );
}
