"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { roleById } from "@/data/ops";
import { Icon, type IconName } from "@/components/Icon";
import { TopBar } from "@/components/control/Shell";
import { onAir, WATCHING_NOW } from "@/lib/broadcast";
import { useDemo } from "@/lib/store";
import { fmt, isoTime, watParts } from "@/lib/time";
import type { RoleId } from "@/lib/types";

const TILES: Record<RoleId, { href: string; label: string; icon: IconName }[]> = {
  reporter: [
    { href: "/control/stories/kano-forums", label: "Open my Kano draft", icon: "file" },
    { href: "/control/stories", label: "My stories", icon: "list" },
  ],
  "news-editor": [
    { href: "/control/submissions", label: "Review submissions", icon: "inbox" },
    { href: "/control/stories", label: "All stories", icon: "file" },
    { href: "/control/homepage", label: "Homepage curator", icon: "home" },
  ],
  "editor-in-chief": [
    { href: "/control/submissions", label: "Review submissions", icon: "inbox" },
    { href: "/control/homepage", label: "Homepage curator", icon: "home" },
    { href: "/control/alerts", label: "Safety alerts", icon: "alert" },
    { href: "/control/audit", label: "Audit log", icon: "log" },
  ],
  "broadcast-manager": [
    { href: "/control/schedule", label: "Schedule a live event", icon: "calendar" },
    { href: "/control/live", label: "Live control", icon: "radio" },
    { href: "/control/ops/production", label: "Production calendar", icon: "truck" },
  ],
  "programme-manager": [
    { href: "/control/programmes", label: "Programmes and episodes", icon: "film" },
    { href: "/control/schedule", label: "Schedule", icon: "calendar" },
  ],
  "media-manager": [
    { href: "/control/media", label: "Media library", icon: "image" },
    { href: "/control/programmes", label: "Programmes", icon: "film" },
  ],
  pio: [
    { href: "/control/alerts", label: "Public safety alerts", icon: "alert" },
    { href: "/control/stories", label: "Statements and stories", icon: "file" },
  ],
  "network-director": [],
  "super-admin": [
    { href: "/control/audit", label: "Audit log", icon: "log" },
    { href: "/control/ops/people", label: "Users and staff", icon: "users" },
    { href: "/control/ops", label: "Operations overview", icon: "layout" },
    { href: "/control/submissions", label: "Submissions", icon: "inbox" },
  ],
};

export default function Dashboard() {
  const { state, role, now } = useDemo();
  const router = useRouter();
  useEffect(() => {
    if (role === "network-director") router.replace("/control/ops");
  }, [role, router]);
  if (!role || role === "network-director") return null;

  const r = roleById(role);
  const p = watParts(now);
  const air = onAir(state.schedule, now, state.live);
  const greeting = p.minutes < 720 ? "Good morning" : p.minutes < 1020 ? "Good afternoon" : "Good evening";
  const myDrafts = state.articles.filter((a) => a.author === "Musa Ibrahim" && a.status !== "published");
  const published = state.articles.filter((a) => a.status === "published" && a.date.slice(0, 10) === p.date).length;

  const kpis: { label: string; value: string; note: string; icon: IconName }[] =
    role === "reporter"
      ? [
          { label: "Kano desk, November", value: "19", note: "stories sent this month", icon: "file" },
          { label: "Drafts and returned", value: String(myDrafts.length), note: "waiting for you", icon: "edit" },
        ]
      : [
          { label: "On air", value: air.state === "live" && air.current ? air.current.title : "Off air", note: air.current ? `until ${air.current.end}` : "returns at 06:00", icon: "radio" },
          { label: "Watching live now", value: WATCHING_NOW.toLocaleString("en-GB"), note: "18% more than last Monday", icon: "play" },
          { label: "Waiting for review", value: String(state.submissions.length), note: "from the correspondent desks", icon: "inbox" },
          { label: "Published today", value: String(published), note: "stories on npftv.net", icon: "file" },
        ];

  return (
    <>
      <TopBar crumbs={["Dashboard"]} />
      <div className="pg">
        <div className="hello">
          <div>
            <h1>
              {greeting}, {r.person.split(" ")[0]}.
            </h1>
            <p>
              {r.title} · {fmt.long(p.date)}, {p.hhmm} WAT
            </p>
          </div>
        </div>
        <div className="kpis" style={kpis.length === 2 ? { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" } : undefined}>
          {kpis.map((k) => (
            <div key={k.label} className="pnl kpi">
              <span>
                <Icon name={k.icon} />
                {k.label}
              </span>
              <b>{k.value}</b>
              <small>{k.note}</small>
            </div>
          ))}
        </div>
        <div className="quick-tiles">
          {TILES[role].map((t) => (
            <Link key={t.href} href={t.href} className="pnl qt">
              <span className="ic">
                <Icon name={t.icon} />
              </span>
              {t.label}
            </Link>
          ))}
        </div>
        <div className="row2">
          <div className="pnl">
            <div className="p-hd">
              <h3>{role === "reporter" ? "My stories" : "Needs attention"}</h3>
              <Link href={role === "reporter" ? "/control/stories" : "/control/submissions"}>See all</Link>
            </div>
            {(role === "reporter" ? myDrafts : state.submissions.map((s) => state.articles.find((a) => a.id === s.articleId)!).filter(Boolean)).slice(0, 5).map((a) => (
              <Link key={a.id} href={`/control/stories/${a.id}`} className="rowlink">
                <div>
                  <h4>{a.title}</h4>
                  <p>
                    {a.author} · {a.status}
                  </p>
                </div>
                <Icon name="chev" />
              </Link>
            ))}
            {role === "reporter" && !myDrafts.length && <div className="empty">Nothing waiting. Your stories are with the newsroom.</div>}
            {role !== "reporter" && !state.submissions.length && <div className="empty">Nothing waiting for review.</div>}
          </div>
          <div className="pnl">
            <div className="p-hd">
              <h3>Recent activity</h3>
              <Link href="/control/audit">Audit log</Link>
            </div>
            <ul className="appr">
              {state.audit.slice(0, 6).map((e) => (
                <li key={e.id} style={{ gridTemplateColumns: "48px 1fr" }}>
                  <span className="cond" style={{ color: "var(--muted)", fontWeight: 600 }}>
                    {isoTime(e.at)}
                  </span>
                  <span>
                    <b>
                      {e.action}
                      {e.ai && (
                        <span className="tag tag-ai" style={{ marginLeft: 6, fontSize: 10.5, padding: "1px 5px" }}>
                          AI
                        </span>
                      )}
                    </b>
                    <small>
                      {e.who}
                      {e.target ? ` · ${e.target}` : ""}
                    </small>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
