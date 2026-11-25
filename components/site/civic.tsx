"use client";

// Shared building blocks for the citizen pages (rights, investigations, complaints, and later reporting).

import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL_REVIEW_NOTE, type LawRef } from "@/data/rights";
import { Icon } from "../Icon";

/** Makes NPFTV's role clear wherever a citizen might think they are talking to the police. */
export function RoleNote({ children }: { children?: ReactNode }) {
  return (
    <div className="role-note" role="note">
      <Icon name="info" />
      <p>
        {children ?? (
          <>
            <b>NPFTV is the Nigeria Police Force&apos;s television and news service.</b> We explain and inform. We can&apos;t send help, open a case or handle complaints. In an emergency, call{" "}
            <a href="tel:112">112</a>.
          </>
        )}
      </p>
    </div>
  );
}

export function LegalNote() {
  return (
    <p className="legal-note">
      <Icon name="scale" /> {LEGAL_REVIEW_NOTE}
    </p>
  );
}

export function InShort({ items }: { items: string[] }) {
  return (
    <div className="in-short">
      <h2>In short</h2>
      <ul>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

export function CanCannot({ can, cannot }: { can: string[]; cannot: string[] }) {
  return (
    <div className="cc">
      <div className="cc-col can">
        <h3>
          <span className="cc-ic">
            <Icon name="check" />
          </span>
          What officers can do
        </h3>
        <ul>
          {can.map((t) => (
            <li key={t}>
              <Icon name="check" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="cc-col cannot">
        <h3>
          <span className="cc-ic">
            <Icon name="x" />
          </span>
          What officers cannot do
        </h3>
        <ul>
          {cannot.map((t) => (
            <li key={t}>
              <Icon name="x" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function NumberedSteps({ items }: { items: string[] }) {
  return (
    <ol className="num-steps">
      {items.map((t, i) => (
        <li key={t}>
          <span>{i + 1}</span>
          <p>{t}</p>
        </li>
      ))}
    </ol>
  );
}

export function LawList({ items }: { items: LawRef[] }) {
  return (
    <ul className="law-list">
      {items.map((l) => (
        <li key={l.source}>
          <b>{l.source}</b>
          <span>{l.detail}</span>
        </li>
      ))}
    </ul>
  );
}

/** "In danger now?" strip, shown on every help page. */
export function EmergencyStrip() {
  return (
    <div className="emergency-strip">
      <span className="es-ic">
        <Icon name="phone" />
      </span>
      <p>
        <b>In danger right now?</b> Call 112. It&apos;s free on every network.
      </p>
      <a className="btn btn-red btn-sm" href="tel:112">
        Call 112
      </a>
    </div>
  );
}

export function SectionTitle({ title, intro, children }: { title: string; intro?: string; children?: ReactNode }) {
  return (
    <div className="sec-hd">
      <div>
        <h2>{title}</h2>
        {intro && <p>{intro}</p>}
      </div>
      {children}
    </div>
  );
}

export function NextLink({ href, title, text, icon }: { href: string; title: string; text: string; icon: Parameters<typeof Icon>[0]["name"] }) {
  return (
    <Link href={href} className="next-link">
      <span className="nl-ic">
        <Icon name={icon} />
      </span>
      <span>
        <b>{title}</b>
        <small>{text}</small>
      </span>
      <Icon name="arrow" />
    </Link>
  );
}
