"use client";

import Link from "next/link";
import { programmes } from "@/data/programmes";
import { guides, socialPosts } from "@/data/public";
import { Icon, type IconName } from "@/components/Icon";
import { LiveModule } from "@/components/site/LiveModule";
import { ScamChecker } from "@/components/site/ScamChecker";
import { EmergencyNote, Poster, StoryRow, UpcomingItem } from "@/components/site/bits";
import { onAir, upcomingEvents } from "@/lib/broadcast";
import { useDemo } from "@/lib/store";

const QUICK: { href: string; label: string; icon: IconName; fill?: boolean; ai?: boolean }[] = [
  { href: "/stream/live", label: "Watch live", icon: "play", fill: true },
  { href: "/stream/guide", label: "Programme guide", icon: "calendar" },
  { href: "/public-safety#scam-checker", label: "Scam checker", icon: "shield", ai: true },
  { href: "/public-safety/how-to-report-a-crime", label: "Report a crime", icon: "phone" },
  { href: "/state-commands", label: "State commands", icon: "map" },
  { href: "/media-centre", label: "Media centre", icon: "image" },
];

export default function HomePage() {
  const { state, now } = useDemo();
  const air = onAir(state.schedule, now, state.live, 1);
  const stories = state.featuredIds.map((id) => state.articles.find((a) => a.id === id)).filter((a): a is NonNullable<typeof a> => !!a && a.status === "published");
  const upcoming = upcomingEvents(state.schedule, now).slice(0, 3);
  const nextUp = air.next[0];

  return (
    <>
      <section className="hero hero-emblem">
        <div className="hero-img">
          <img src="/images/emblem.webp" alt="NPFTV emblem" />
        </div>
        <div className="wrap">
          <div className="kicker">Nigeria Police Force Television</div>
          <h1>
            <span>
              Inform<em>.</em>
            </span>
            <span>
              Educate<em>.</em>
            </span>
            <span>
              Inspire<em>.</em>
            </span>
          </h1>
          <p>Live television, verified news and public safety guidance from the Nigeria Police Force, on every screen.</p>
          <div className="hero-ctas">
            <Link className="btn btn-yellow" href="/stream/live">
              <Icon name="play" fill /> Watch live
            </Link>
            <Link className="btn btn-ghost" href="/stream/guide">
              <Icon name="calendar" /> Today&apos;s schedule
            </Link>
          </div>
          <div className="onair">
            {air.current && air.state !== "off-air" ? (
              <>
                <span className="tag tag-live">
                  <span className="live-dot" /> On air now
                </span>
                <b>{air.current.title}</b>
                <span>
                  until {air.current.end}
                  {nextUp ? `, then ${nextUp.title}` : ""}
                </span>
              </>
            ) : (
              <>
                <span className="tag off">Off air</span>
                <b>{nextUp ? nextUp.title : "NPFTV"}</b>
                <span>{nextUp ? `returns at ${nextUp.start}` : "returns at 06:00"}</span>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="quick">
        <div className="wrap">
          {QUICK.map((q) => (
            <Link key={q.label} className="q" href={q.href}>
              <span className="q-ic">
                <Icon name={q.icon} fill={q.fill} />
                {q.ai && <span className="tag tag-ai">AI</span>}
              </span>
              {q.label}
            </Link>
          ))}
        </div>
      </div>

      <LiveModule />

      <section className="sec dir">
        <div className="wrap">
          <figure className="dir-fig">
            <div className="ph">
              <img src="/images/emblem.webp" alt="NPFTV emblem" />
            </div>
            <figcaption>
              Network Director<small>Nigeria Police Force Television</small>
            </figcaption>
          </figure>
          <div className="dir-txt">
            <h2>A message from the Network Director</h2>
            <p>
              NPFTV exists so that every Nigerian can see, hear and understand the work of their police. We report what is verified, we explain what it means for your safety, and we give you a clear way to
              talk back.
            </p>
            <p>Watch us live, catch up on any programme, and use our public safety tools whenever you need them. Thank you for watching.</p>
            <div className="sig">The Network Director, NPFTV</div>
            <Link className="btn btn-line" href="/about">
              About NPFTV <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="sec nu">
        <div className="wrap">
          <div>
            <div className="sec-hd">
              <h2>News and press releases</h2>
              <Link className="link" href="/news">
                All news <Icon name="arrow" />
              </Link>
            </div>
            {stories.map((a) => (
              <StoryRow key={a.id} a={a} fresh={a.author === "Musa Ibrahim"} />
            ))}
          </div>
          <div>
            <div className="sec-hd">
              <h2>Upcoming broadcasts</h2>
              <Link className="link" href="/stream/guide">
                Full schedule <Icon name="arrow" />
              </Link>
            </div>
            {upcoming.map((s, i) => (
              <UpcomingItem key={s.id} s={s} primary={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <h2>Programmes</h2>
              <p>Every NPFTV show, with full episodes on demand.</p>
            </div>
            <Link className="link" href="/programmes">
              All programmes <Icon name="arrow" />
            </Link>
          </div>
          <div className="progs">
            {programmes
              .filter((p) => p.id !== "insight-podcast")
              .map((p) => (
                <Poster key={p.id} p={p} sub={p.scheduleText} />
              ))}
          </div>
        </div>
      </section>

      <section className="sec ps" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ScamChecker />
          <div className="guides">
            <h3>Public safety guides</h3>
            <p>Practical advice, checked by the Force.</p>
            {guides.map((g) => (
              <Link key={g.id} className="guide" href={`/public-safety/${g.id}`}>
                <span className="gi">
                  <Icon name={g.icon as IconName} />
                </span>
                <span className="gt">
                  {g.title}
                  <small>{g.short}</small>
                </span>
                <Icon name="chev" />
              </Link>
            ))}
            <EmergencyNote />
          </div>
        </div>
      </section>

      <section className="band">
        <img src="/images/parade.webp" alt="Police officers on parade" />
        <div className="wrap">
          <h2>Telling the police story, from every state</h2>
          <p>Reporting from the 36 states and the Federal Capital Territory.</p>
        </div>
      </section>

      <section className="sec social">
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <h2>From our channels</h2>
              <p>Highlights from NPFTV on YouTube, X, Instagram and Facebook.</p>
            </div>
          </div>
          <div className="posts">
            {socialPosts.map((p) => (
              <article key={p.id} className="post">
                <div className="post-hd">
                  <img src="/images/logo.webp" alt="" />
                  <div>
                    NPF Television<small>{p.ago}</small>
                  </div>
                  <span className="plat">{p.platform}</span>
                </div>
                {p.media === "thumb" && (
                  <div className="pimg pthumb">
                    <span>Behind the scenes</span>
                    <b>The Beat</b>
                    <i>
                      <Icon name="play" fill />
                    </i>
                  </div>
                )}
                {p.media === "big" && <p className="ptxt big">{p.big}</p>}
                {(p.media === "eod" || p.media === "emblem") && (
                  <div className="pimg">
                    <img src={`/images/${p.media}.webp`} alt="" />
                  </div>
                )}
                <p className="ptxt">{p.text}</p>
                <div className="post-ft">
                  <span>{p.stats[0]}</span>
                  <span>{p.stats[1]}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="social-cta">
            <a className="btn btn-yellow" href="#" onClick={(e) => e.preventDefault()}>
              See all channels
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
