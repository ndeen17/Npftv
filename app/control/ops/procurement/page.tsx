"use client";

import { fmtNaira } from "@/data/ops";
import { Icon } from "@/components/Icon";
import { TopBar } from "@/components/control/Shell";
import { useDemo } from "@/lib/store";

export default function ProcurementPage() {
  const { state } = useDemo();
  return (
    <>
      <TopBar crumbs={["Operations", "Procurement"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Procurement</h1>
            <p>Purchase requests and their approval chain. Anything over ₦5m needs the Network Director.</p>
          </div>
        </div>
        <div className="pnl tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Request</th>
                <th>From</th>
                <th className="num">Amount</th>
                <th>Approval chain</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.procurement.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.item}</td>
                  <td>{p.requestedBy}</td>
                  <td className="num">{fmtNaira(p.amount)}</td>
                  <td>
                    <span className="res">
                      {p.chain.map((c) => (
                        <span key={c.step} className={c.done ? "" : "warn"}>
                          <Icon name={c.done ? "check" : "clock"} />
                          {c.step}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td>
                    <span className={`tag ${p.status === "approved" ? "tag-green" : p.status === "declined" ? "tag-red" : "tag-feat"}`}>{p.status === "waiting" ? "Waiting" : p.status === "approved" ? "Approved" : "Declined"}</span>
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
