"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAir } from "@/lib/broadcast";
import { useDemo } from "@/lib/store";
import { Icon } from "../Icon";
import { useToast } from "../Toast";

const NAV = [
  { href: "/news", label: "News" },
  { href: "/stream", label: "Watch" },
  { href: "/programmes", label: "Programmes" },
  { href: "/safety", label: "Safety" },
  { href: "/state-commands", label: "State commands" },
  { href: "/about", label: "About" },
];

export function ProtoBanner({ text }: { text?: string }) {
  return (
    <div className="proto">
      <b>Prototype with demo data.</b> {text ?? "Stories, figures and names are fictional and not official NPF information."}
    </div>
  );
}

export function SiteHeader() {
  const { state, now } = useDemo();
  const path = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const air = onAir(state.schedule, now, state.live);
  const a = state.alertBar;

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [path]);

  return (
    <>
      <div className={`alert${a.level === "urgent" ? " urgent" : ""}`} role="region" aria-label="Public safety alert">
        <div className="wrap">
          <div className="alert-msg">
            <Icon name={a.level === "urgent" ? "alert" : "shield"} />
            <span>
              <b>{a.level === "urgent" ? `${a.title}:` : "Public safety alert:"}</b> {a.body}
            </span>{" "}
            <Link href={a.level === "urgent" ? "/safety#alerts" : "/safety#scam-checker"}>{a.level === "urgent" ? "Read the alert" : "How to spot a scam"}</Link>
          </div>
          <div className={`alert-side${air.state === "live" ? "" : " off"}`}>
            <span className="live-dot" />
            {air.state === "live" ? `Broadcasting live from Abuja, ${air.nowHHMM} WAT` : air.state === "technical" ? `Technical difficulty, ${air.nowHHMM} WAT` : `Off air, ${air.nowHHMM} WAT`}
          </div>
        </div>
      </div>

      <header className="hdr">
        <div className="wrap">
          <Link className="brand" href="/">
            <img src="/images/logo.webp" alt="NPFTV emblem" />
            <span className="brand-txt">
              <small>Nigeria Police Force</small>
              <strong>Television Network</strong>
            </span>
          </Link>
          <nav className="nav" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={path.startsWith(n.href) ? "on" : ""}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hdr-act">
            <button className="icon-btn search" aria-label="Search" aria-expanded={search} onClick={() => setSearch((s) => !s)}>
              <Icon name="search" />
            </button>
            <Link className="btn btn-red btn-sm" href="/stream/live">
              <span className="live-dot" /> Watch live
            </Link>
            <button className="icon-btn menu-btn" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
              <Icon name={menu ? "x" : "menu"} />
            </button>
          </div>
        </div>
      </header>

      {search && (
        <div className="search-bar">
          <div className="wrap">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/search?q=${encodeURIComponent(q)}`);
              }}
            >
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask in plain words, e.g. how do I travel safely at night?" aria-label="Search NPFTV" />
              <button className="btn btn-indigo">
                <Icon name="spark" /> Search
              </button>
            </form>
          </div>
        </div>
      )}

      {menu && (
        <nav className="mnav" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
          <Link href="/search">Search</Link>
          <Link href="/media-centre">Media centre</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      )}

      <div className="latest">
        <div className="wrap">
          <span className="latest-lbl">Latest</span>
          <div className="latest-items">
            {state.ticker.map((t, i) => {
              const art = t.articleId ? state.articles.find((x) => x.id === t.articleId) : undefined;
              const inner = (
                <>
                  <i>{t.breaking ? "Breaking" : t.time}</i> {t.text.replace(/^Breaking:\s*/i, "")}
                </>
              );
              return art ? (
                <Link key={i} href={`/news/${art.slug}`}>
                  {inner}
                </Link>
              ) : (
                <span key={i} className={t.breaking ? "brk" : ""}>
                  {inner}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export function SiteFooter() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  return (
    <footer className="ftr">
      <div className="flag-stripe" />
      <div className="wrap cols">
        <div className="ftr-brand">
          <img src="/images/logo.webp" alt="NPFTV emblem" />
          <p>Nigeria Police Force Television Network: live TV, verified news and public safety guidance.</p>
          <p className="tagline">
            Inform<em>.</em> Educate<em>.</em> Inspire<em>.</em>
          </p>
          <div className="socials">
            {["YT", "X", "IG", "FB", "TT"].map((s) => (
              <a key={s} href="#" aria-label={s} onClick={(e) => e.preventDefault()}>
                {s}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4>Watch</h4>
          <ul>
            <li>
              <Link href="/stream/live">Live TV</Link>
            </li>
            <li>
              <Link href="/stream/guide">Programme guide</Link>
            </li>
            <li>
              <Link href="/stream/on-demand">On demand</Link>
            </li>
            <li>
              <Link href="/stream/podcasts">Podcasts</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>News</h4>
          <ul>
            <li>
              <Link href="/news">Latest</Link>
            </li>
            <li>
              <Link href="/state-commands">State commands</Link>
            </li>
            <li>
              <Link href="/news?cat=press-releases">Press releases</Link>
            </li>
            <li>
              <Link href="/media-centre">Media centre</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Safety</h4>
          <ul>
            <li>
              <Link href="/safety#scam-checker">Scam checker</Link>
            </li>
            <li>
              <Link href="/safety#guides">Safety guides</Link>
            </li>
            <li>
              <Link href="/safety#alerts">Alerts</Link>
            </li>
            <li>
              <Link href="/safety/guides/how-to-report-a-crime">Report a crime</Link>
            </li>
          </ul>
        </div>
        <form
          className="signup"
          onSubmit={(e) => {
            e.preventDefault();
            setEmail("");
            toast("Demo only: nothing was sent and your email wasn't stored.");
          }}
        >
          <h4>Stay informed</h4>
          <p>Get public safety alerts and programme reminders by email.</p>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address" />
          <button className="btn btn-indigo">Subscribe</button>
        </form>
      </div>
      <div className="ftr-bottom">
        <div className="wrap">
          <span>© 2026 Nigeria Police Force Television</span>
          <a className="ftr-112" href="tel:112">
            <Icon name="phone" /> Not an emergency service. In an emergency, call 112
          </a>
          <nav>
            <Link href="/about#standards">Editorial standards</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/partner">Partner with NPFTV</Link>
            <Link href="/control">Staff: Control Room</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
