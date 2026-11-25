"use client";

import Link from "next/link";
import { episodes, programmes } from "@/data/programmes";
import { Icon } from "@/components/Icon";
import { TopBar } from "@/components/control/Shell";
import { fmt } from "@/lib/time";

export default function ProgrammesAdmin() {
  return (
    <>
      <TopBar crumbs={["Broadcast", "Programmes"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>Programmes and episodes</h1>
            <p>The same records feed npftv.net and NPFTV Stream.</p>
          </div>
        </div>
        {programmes.map((p) => {
          const eps = episodes.filter((e) => e.programmeId === p.id);
          return (
            <div key={p.id} className="pnl">
              <div className="p-hd">
                <h3>
                  {p.title} <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted)", fontWeight: 400 }}>· {p.strand} · {p.scheduleText}</span>
                </h3>
                <Link href={`/programmes/${p.id}`} target="_blank">
                  Public page
                </Link>
              </div>
              <div className="tbl-wrap">
                <table className="tbl">
                  <tbody>
                    {eps.map((e) => (
                      <tr key={e.id}>
                        <td style={{ fontWeight: 600 }}>{e.title}</td>
                        <td>{fmt.dayMonShort(e.date)}</td>
                        <td className="num">{e.duration}</td>
                        <td>
                          <span className="tag tag-green">On demand</span>
                        </td>
                        <td>
                          <span className="res">
                            <span>
                              <Icon name="spark" />
                              {e.chapters.length} AI chapters, checked
                            </span>
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <Link className="mini" href={`/stream/episode/${e.id}`} target="_blank">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {!eps.length && (
                      <tr>
                        <td className="empty">No episodes on demand yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
