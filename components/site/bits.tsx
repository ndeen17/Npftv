"use client";

import Link from "next/link";
import { categoryById } from "@/data/articles";
import { programmeById } from "@/data/programmes";
import type { Article, Programme, ScheduleSlot } from "@/lib/types";
import { fmt, isoDate } from "@/lib/time";
import { Icon, type IconName } from "../Icon";
import { useActions, useDemo } from "@/lib/store";

export function ArticleThumb({ a }: { a: Article }) {
  if (a.thumb === "eod" || a.thumb === "parade") {
    return <img src={`/images/${a.thumb}.webp`} alt={a.thumb === "eod" ? "Bomb disposal officers in protective suits" : "Officers in blue helmets on parade"} />;
  }
  return (
    <div className="th-graphic">
      <Icon name={(a.graphicIcon as IconName) ?? "file"} />
    </div>
  );
}

/** The homepage's lead story: large picture on top, slab headline below. */
export function LeadStory({ a, fresh }: { a: Article; fresh?: boolean }) {
  const cat = categoryById(a.category);
  return (
    <article className={`story lead${fresh ? " new" : ""}`}>
      <Link href={`/news/${a.slug}`} className="th" tabIndex={-1} aria-hidden>
        <ArticleThumb a={a} />
      </Link>
      <div>
        <div className="meta">
          <span className="cat">{cat?.short ?? cat?.name}</span>
          <span>{fmt.dayMonthYear(isoDate(a.date))}</span>
          {fresh && <span className="tag tag-feat">Just published</span>}
        </div>
        <h3>
          <Link href={`/news/${a.slug}`}>{a.title}</Link>
        </h3>
        <p>{a.summary}</p>
        <Link className="link" href={`/news/${a.slug}`}>
          Read story <Icon name="arrow" />
        </Link>
      </div>
    </article>
  );
}

export function StoryRow({ a, fresh, compact }: { a: Article; fresh?: boolean; compact?: boolean }) {
  const cat = categoryById(a.category);
  return (
    <article className={`story${fresh ? " new" : ""}${compact ? " compact" : ""}`}>
      <Link href={`/news/${a.slug}`} className="th" tabIndex={-1} aria-hidden>
        <ArticleThumb a={a} />
      </Link>
      <div>
        <div className="meta">
          <span className="cat">{cat?.short ?? cat?.name}</span>
          <span>{fmt.dayMonthYear(isoDate(a.date))}</span>
          {fresh && <span className="tag tag-feat">Just published</span>}
        </div>
        <h3>
          <Link href={`/news/${a.slug}`}>{a.title}</Link>
        </h3>
        <p>{a.summary}</p>
        <Link className="link" href={`/news/${a.slug}`}>
          Read story
        </Link>
      </div>
    </article>
  );
}

export function Poster({ p, sub, href }: { p: Programme; sub?: string; href?: string }) {
  return (
    <Link className="prog" href={href ?? `/programmes/${p.id}`}>
      <div className={`art ${p.poster}`}>
        {p.poster === "a4" && <img src="/images/eod.webp" alt="" />}
        {p.poster === "a5" ? (
          <>
            <span className="mk" />
            <small>{p.strand}</small>
          </>
        ) : (
          <>
            <small>{p.strand}</small>
            {p.poster !== "a4" && <span className="mk" />}
          </>
        )}
        <h3>{p.title}</h3>
      </div>
      <p>
        {p.title}
        <span>{sub ?? p.scheduleText}</span>
      </p>
    </Link>
  );
}

export function DateBlock({ date }: { date: string }) {
  return (
    <div className="date">
      <small>{fmt.monShort(date)}</small>
      <b>{fmt.dayNum(date)}</b>
    </div>
  );
}

export function UpcomingItem({ s, primary }: { s: ScheduleSlot; primary?: boolean }) {
  const { state } = useDemo();
  const act = useActions();
  const reminded = state.reminders.includes(s.id);
  const prog = s.programmeId ? programmeById(s.programmeId) : undefined;
  const tag = s.id === "evt-press-briefing" ? "Live event" : s.title.startsWith("Premiere") ? "Premiere" : prog?.title ?? "Live event";
  const title = s.id === "evt-press-briefing" ? s.title : s.title.startsWith("Premiere") ? "The Force in Focus: inside the Air Wing" : s.subtitle;
  return (
    <div className="up">
      <DateBlock date={s.date} />
      <div>
        <span className={`tag ${tag === "Live event" ? "tag-feat" : "tag-soft"}`}>{tag}</span>
        <h4>{title}</h4>
        <ul>
          <li>
            <Icon name="clock" />
            {fmt.weekday(s.date)}, {s.event && s.id === "evt-press-briefing" ? `${s.start} to ${s.end}` : s.start} WAT
          </li>
          {s.location ? (
            <li>
              <Icon name="pin" />
              {s.location}
            </li>
          ) : (
            <li>
              <Icon name="film" />
              Documentary, 48 minutes
            </li>
          )}
        </ul>
        <div className="up-tags">
          <button className={`btn btn-sm ${primary ? "btn-indigo" : "btn-line"}`} onClick={() => act.toggleReminder(s.id)} aria-pressed={reminded}>
            <Icon name={reminded ? "check" : "bell"} />
            {reminded ? "Reminder set" : "Remind me"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PageHead({ title, intro, crumbs, children }: { title: string; intro?: string; crumbs?: { href?: string; label: string }[]; children?: React.ReactNode }) {
  return (
    <section className="page-hd">
      <div className="wrap">
        {crumbs && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} style={{ display: "contents" }}>
                <Icon name="chev" />
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function EmergencyNote() {
  return (
    <div className="emerg">
      <b>This website is not an emergency line</b>
      If you or someone else is in danger now, call 112.
    </div>
  );
}
