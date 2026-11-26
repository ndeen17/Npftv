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
      <a className="ftr-112" href="tel:112" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
        <Icon name="phone" style={{ width: 16, height: 16 }} /> Not an emergency service. In an emergency, call 112
      </a>
      <Link href="/">Back to npftv.net</Link>
    </footer>
  );
}
