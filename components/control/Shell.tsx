"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { roleById, roles } from "@/data/ops";
import { useDemo } from "@/lib/store";
import type { RoleId } from "@/lib/types";
import { Icon, type IconName } from "../Icon";

const MobileToggleCtx = createContext<() => void>(() => {});

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  badge?: number;
}

function useNav(role: RoleId) {
  const { state } = useDemo();
  const waitingSubs = state.submissions.length;
  const waitingAppr = state.approvals.filter((a) => a.status === "waiting").length;
  const draftAlerts = state.draftAlerts.length;
  const pendingNotices = state.notices.filter((n) => n.status === "pending").length;
  const myDrafts = state.articles.filter((a) => a.author === "Musa Ibrahim" && (a.status === "draft" || a.status === "returned")).length;

  const newsroom: NavItem[] =
    role === "reporter"
      ? [
          { href: "/control", label: "Dashboard", icon: "layout" },
          { href: "/control/stories", label: "My stories", icon: "file", badge: myDrafts || undefined },
        ]
      : [
          { href: "/control", label: "Dashboard", icon: "layout" },
          { href: "/control/stories", label: "Stories", icon: "file" },
          { href: "/control/submissions", label: "Submissions", icon: "inbox", badge: waitingSubs || undefined },
          { href: "/control/alerts", label: "Safety alerts", icon: "alert", badge: draftAlerts || undefined },
          { href: "/control/homepage", label: "Homepage", icon: "home" },
        ];
  const broadcast: NavItem[] = [
    { href: "/control/live", label: "Live control", icon: "radio" },
    { href: "/control/schedule", label: "Schedule", icon: "calendar" },
    { href: "/control/programmes", label: "Programmes", icon: "film" },
    { href: "/control/media", label: "Media library", icon: "image" },
  ];
  // Citizen reporting: notices from police commands (and, in Phase 4, citizen reports to the newsroom).
  const newReports = state.reports.filter((r) => r.status === "received").length;
  const citizen: NavItem[] = [
    { href: "/control/reports", label: "Citizen reports", icon: "inbox", badge: newReports || undefined },
    { href: "/control/notices", label: "Notices", icon: "users", badge: pendingNotices || undefined },
  ];
  const ops: NavItem[] = [
    { href: "/control/ops", label: "Overview", icon: "layout" },
    { href: "/control/ops/production", label: "Production", icon: "truck" },
    { href: "/control/ops/assets", label: "Assets", icon: "box" },
    { href: "/control/ops/people", label: "People", icon: "users" },
    { href: "/control/ops/finance", label: "Finance", icon: "wallet" },
    { href: "/control/ops/procurement", label: "Procurement", icon: "file" },
    { href: "/control/ops/sponsorship", label: "Sponsorship", icon: "radio" },
    { href: "/control/ops/correspondents", label: "Correspondents", icon: "map" },
    { href: "/control/ops/approvals", label: "Approvals", icon: "stamp", badge: waitingAppr || undefined },
    { href: "/control/ops/reports", label: "Reports", icon: "list" },
  ];

  if (role === "network-director") {
    return [
      { title: "Operations", items: ops },
      {
        title: "Newsroom and broadcast",
        items: [
          { href: "/control/stories", label: "Stories", icon: "file" as IconName },
          { href: "/control/schedule", label: "Schedule", icon: "calendar" as IconName },
          { href: "/control/alerts", label: "Safety alerts", icon: "alert" as IconName },
        ],
      },
      { title: "Citizen reporting", items: citizen },
    ];
  }
  if (role === "super-admin") {
    return [
      { title: "Newsroom", items: newsroom },
      { title: "Citizen reporting", items: citizen },
      { title: "Broadcast", items: broadcast },
      { title: "Operations", items: ops },
    ];
  }
  if (role === "reporter") return [{ title: "Newsroom", items: newsroom }];
  if (role === "broadcast-manager" || role === "programme-manager") {
    return [
      { title: "Broadcast", items: broadcast },
      { title: "Operations", items: ops.filter((o) => ["Production", "Assets"].includes(o.label)) },
      { title: "Newsroom", items: newsroom.slice(0, 2) },
    ];
  }
  if (role === "media-manager") {
    return [
      { title: "Broadcast", items: broadcast.filter((b) => ["Media library", "Programmes"].includes(b.label)) },
      { title: "Newsroom", items: newsroom.slice(0, 2) },
      { title: "Operations", items: ops.filter((o) => ["Assets"].includes(o.label)) },
    ];
  }
  if (role === "pio") {
    return [
      { title: "Newsroom", items: newsroom },
      { title: "Citizen reporting", items: citizen },
      { title: "Broadcast", items: broadcast.slice(0, 2) },
    ];
  }
  // News Editor, Editor-in-Chief (as designed)
  return [
    { title: "Newsroom", items: newsroom },
    { title: "Citizen reporting", items: citizen },
    { title: "Broadcast", items: broadcast },
    {
      title: "Operations",
      items: ops.filter((o) => ["Production", "Assets", "Finance", "Approvals"].includes(o.label)),
    },
  ];
}

export function RolePicker() {
  const { setRole } = useDemo();
  const router = useRouter();
  return (
    <div className="picker">
      <div className="picker-in">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/images/logo.webp" alt="" style={{ width: 52, height: 52, borderRadius: "50%" }} />
          <span style={{ fontFamily: "var(--slab)", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
            NPFTV
            <small style={{ display: "block", fontFamily: "var(--sans)", fontSize: 13, color: "var(--yellow)", fontWeight: 500 }}>Control Room</small>
          </span>
        </div>
        <h1>Choose a role to explore</h1>
        <p className="lead">The Control Room is NPFTV&apos;s staff app: the newsroom, broadcast control and operations in one place. In this demo there are no passwords. Pick a role and you&apos;ll see what that person sees.</p>
        <div className="roles">
          {roles.map((r) => (
            <button
              key={r.id}
              className={`rcard${["reporter", "editor-in-chief", "broadcast-manager", "network-director"].includes(r.id) ? " script" : ""}`}
              onClick={() => {
                setRole(r.id);
                router.push(r.home);
              }}
            >
              <span className="av">{r.initials}</span>
              <span>
                <b>{r.title}</b>
                <span>{r.person === r.title ? "Shown by title only" : r.person}</span>
                <small>{r.blurb}</small>
              </span>
            </button>
          ))}
        </div>
        <p style={{ color: "#a79dc7", fontSize: 13.5, marginTop: 24 }}>
          Roles with a yellow edge appear in the 10-minute demo script. <Link href="/" style={{ color: "var(--yellow)" }}>Back to npftv.net</Link>
        </p>
      </div>
    </div>
  );
}

export function ControlShell({ children }: { children: ReactNode }) {
  const { role, setRole, hydrated } = useDemo();
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(false);

  // ?as=<role> switches role (used by the presenter panel's demo-script links).
  useEffect(() => {
    const as = params.get("as") as RoleId | null;
    if (as && roles.some((r) => r.id === as)) {
      setRole(as);
      router.replace(roleById(as).home);
    }
  }, [params, setRole, router]);

  useEffect(() => {
    setMenu(false);
    setMobile(false);
  }, [path]);

  if (!hydrated) return <div className="picker" />;
  if (!role) return <RolePicker />;
  return <Shell role={role} menu={menu} setMenu={setMenu} mobile={mobile} setMobile={setMobile}>{children}</Shell>;
}

function Shell({ role, children, menu, setMenu, mobile, setMobile }: { role: RoleId; children: ReactNode; menu: boolean; setMenu: (f: (b: boolean) => boolean) => void; mobile: boolean; setMobile: (b: boolean) => void }) {
  const { setRole } = useDemo();
  const router = useRouter();
  const path = usePathname();
  const r = roleById(role);
  const groups = useNav(role);
  const isOn = (href: string) => (href === "/control" || href === "/control/ops" ? path === href : path === href || path.startsWith(href + "/"));

  return (
    <div className="cr">
      <aside className={`sb${mobile ? " open" : ""}`} aria-label="Control Room navigation">
        <Link className="sb-brand" href="/control">
          <img src="/images/logo.webp" alt="" />
          <span>
            NPFTV<small>Control Room</small>
          </span>
        </Link>
        <button className="role" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label={`Signed in as ${r.person}, ${r.title}. Switch role`}>
          <span className="av">{r.initials}</span>
          <div>
            {r.person}
            <small>{r.person === r.title ? r.blurb.replace(/\.$/, "") : r.title}</small>
          </div>
          <Icon name="down" />
        </button>
        {menu && (
          <div className="role-menu">
            {roles.map((x) => (
              <button
                key={x.id}
                className={x.id === role ? "on" : ""}
                onClick={() => {
                  setRole(x.id);
                  setMenu(() => false);
                  router.push(x.home);
                }}
              >
                <span className="av">{x.initials}</span>
                {x.title}
              </button>
            ))}
            <button
              onClick={() => {
                setRole(null);
                router.push("/control");
              }}
            >
              <Icon name="back" style={{ width: 16, height: 16 }} /> Back to role picker
            </button>
          </div>
        )}
        {groups.map((g) => (
          <div key={g.title} className="sb-grp">
            <b>{g.title}</b>
            {g.items.map((it) => (
              <Link key={it.href + it.label} href={it.href} className={isOn(it.href) ? "on" : ""}>
                <Icon name={it.icon} />
                {it.label}
                {it.badge ? <em>{it.badge}</em> : null}
              </Link>
            ))}
          </div>
        ))}
        <div className="sb-grp">
          <Link href="/control/audit" className={isOn("/control/audit") ? "on" : ""}>
            <Icon name="log" />
            Audit log
          </Link>
        </div>
        <div className="sb-foot">
          <span>Demo build. Switch roles from the menu above.</span>
          <span>
            <Link href="/" target="_blank">
              Open npftv.net
            </Link>{" "}
            ·{" "}
            <Link href="/stream" target="_blank">
              Stream
            </Link>
          </span>
        </div>
      </aside>
      {mobile && <div onClick={() => setMobile(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 39 }} />}
      <div className="main">
        <MobileToggleCtx.Provider value={() => setMobile(true)}>{children}</MobileToggleCtx.Provider>
      </div>
    </div>
  );
}


/** Page top bar with breadcrumb. */
export function TopBar({ crumbs, search = "Search stories, media, staff" }: { crumbs: (string | { href: string; label: string })[]; search?: string }) {
  const openMenu = useContext(MobileToggleCtx);
  const { state } = useDemo();
  const router = useRouter();
  const [q, setQ] = useState("");
  const pending = state.approvals.filter((a) => a.status === "waiting").length + state.submissions.length;
  return (
    <div className="tb">
      <button className="ibtn sb-toggle" onClick={openMenu} aria-label="Open navigation">
        <Icon name="menu" />
      </button>
      <div className="crumb">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          const label = typeof c === "string" ? c : c.label;
          return (
            <span key={i} style={{ display: "contents" }}>
              {i > 0 && <Icon name="chev" />}
              {last ? <b>{label}</b> : typeof c === "string" ? <span>{c}</span> : <Link href={c.href}>{label}</Link>}
            </span>
          );
        })}
      </div>
      <div className="tb-r">
        <form
          className="tb-search"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/control/stories?q=${encodeURIComponent(q)}`);
          }}
        >
          <Icon name="search" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={search} aria-label="Search the Control Room" />
        </form>
        <Link className="ibtn" href="/control/ops/approvals" aria-label={`${pending} items need attention`}>
          <Icon name="bell" />
          {pending > 0 && <i />}
        </Link>
      </div>
    </div>
  );
}
