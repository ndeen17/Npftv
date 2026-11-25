"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "../Icon";

const NAV = [
  { href: "/stream/live", label: "Live", live: true },
  { href: "/stream/guide", label: "Guide" },
  { href: "/stream/on-demand", label: "On demand" },
  { href: "/stream/programmes", label: "Programmes" },
  { href: "/stream/podcasts", label: "Podcasts" },
];

export function StreamTop() {
  const path = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const isOn = (href: string) => path === href || path.startsWith(href + "/");
  return (
    <>
      <header className="s-top">
        <Link className="s-brand" href="/stream" aria-label="NPFTV Stream home">
          <img src="/images/logo.webp" alt="" />
          NPFTV <span>Stream</span>
        </Link>
        <nav className="s-nav" aria-label="Stream">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={isOn(n.href) ? "on" : ""}>
              {n.live && <span className="live-dot" />}
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="s-right">
          <form
            className="s-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/stream/on-demand?q=${encodeURIComponent(q)}`);
            }}
          >
            <Icon name="search" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search programmes" aria-label="Search programmes" />
          </form>
          <Link href="/stream/ask" title="Ask NPFTV" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="spark" style={{ color: "var(--yellow)", width: 18, height: 18 }} />
            <span className="hidden lg:inline">Ask</span>
          </Link>
          <Link href="/">npftv.net</Link>
        </div>
      </header>
      <nav className="s-mnav" aria-label="Stream (mobile)">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={isOn(n.href) ? "on" : ""}>
            {n.live && <span className="live-dot" />}
            {n.label}
          </Link>
        ))}
        <Link href="/stream/ask" className={isOn("/stream/ask") ? "on" : ""}>
          Ask NPFTV
        </Link>
      </nav>
    </>
  );
}

export function StreamFoot() {
  return (
    <footer className="s-foot">
      <span>
        <b>NPFTV Stream</b> · stream.npftv.net · Part of Nigeria Police Force Television.
      </span>
      <span>
        <Link href="/">Back to npftv.net</Link> · <b>Not an emergency service: call 112.</b>
      </span>
    </footer>
  );
}
