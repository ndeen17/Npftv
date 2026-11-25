// AI copy desk: the review format shared by the scripted Kano review and live model reviews,
// plus how the editor's decisions are applied to the story text.

import { KANO_ID } from "@/data/articles";
import { translate } from "@/lib/ai";
import type { CopyDeskState } from "@/lib/store";
import type { Article } from "@/lib/types";

export interface Headline {
  text: string;
  note?: string;
}

export interface SensitivityIssue {
  id: string;
  paragraph: number; // 1-based
  kind: string;
  title: string;
  explanation: string;
  quote: string; // exact text in the paragraph
  replacement: string;
  fixLabel: string;
}

export interface StyleFix {
  id: string;
  paragraph: number; // 1-based
  find: string;
  replace: string;
}

export interface Review {
  summary: string;
  sensitivity: SensitivityIssue[];
  style: StyleFix[];
  headlines: Headline[];
  hausa: string | null;
  seo: { title: string; description: string };
  altText: string[];
  live?: boolean;
}

const KANO_HEADLINES: Headline[] = [
  { text: "Kano opens safety forums in all 44 local government areas", note: "Clearest for search, 57 characters" },
  { text: "Residents and police to meet monthly under new Kano forums" },
  { text: "Kano command launches neighbourhood safety forums in 44 LGAs", note: "Reporter's original" },
];

/** The scripted review: exact for the demo's Kano story, a light generic pass for anything else. */
export function scriptedReview(a: Article): Review {
  if (a.id === KANO_ID) {
    return {
      summary: "Kano opens monthly safety forums in all 44 local government areas so residents and officers can meet regularly.",
      sensitivity: [
        {
          id: "op",
          paragraph: 3,
          kind: "operation",
          title: "Reveals where an operation is under way",
          explanation: "Paragraph 3 names the location of an active team.",
          quote: "to the Sabon Gari market axis, where a team is currently tracking a suspected kidnapping gang",
          replacement: "to support an ongoing operation in the state",
          fixLabel: "Remove that clause",
        },
        {
          id: "suspect",
          paragraph: 4,
          kind: "suspect",
          title: "Names a suspect who hasn't been charged",
          explanation: "Paragraph 4. House style: describe, don't name.",
          quote: "A suspect, Sani G., 34,",
          replacement: "A 34-year-old man",
          fixLabel: 'Use "a 34-year-old man"',
        },
      ],
      style: [{ id: "st0", paragraph: 3, find: "have been been", replace: "have been" }],
      headlines: KANO_HEADLINES,
      hausa: translate(KANO_HEADLINES[0].text, "ha"),
      seo: {
        title: "Kano opens safety forums in all 44 LGAs | NPFTV",
        description: "Residents, traditional leaders and divisional officers in Kano will meet every month at new neighbourhood safety forums.",
      },
      altText: [
        "Residents and officers at the launch of a neighbourhood safety forum in Nassarawa, Kano",
        "Divisional officers speaking with residents at the forum launch",
        "Residents gathered for the Kano safety forum launch",
      ],
    };
  }
  const short = a.title.length > 60 ? `${a.title.slice(0, 57)}…` : a.title;
  return {
    summary: a.summary || a.body[0]?.slice(0, 160) || "",
    sensitivity: [],
    style: [],
    headlines: [
      { text: a.title, note: "Reporter's original" },
      { text: short.replace(/^[A-Z][a-z]+:\s*/, ""), note: "Shorter, for social" },
    ].filter((h, i, arr) => arr.findIndex((x) => x.text === h.text) === i),
    hausa: null,
    seo: { title: `${short} | NPFTV`, description: a.summary },
    altText: [],
  };
}

/** Shape of the live model's copy-desk output (see lib/server/features.ts). */
export interface LiveCopyDesk {
  summary: string;
  headlines: Headline[];
  sensitivity: Omit<SensitivityIssue, "id">[];
  style: Omit<StyleFix, "id">[];
  hausaHeadline: string;
  seo: { title: string; description: string };
}

export function fromLive(x: LiveCopyDesk): Review {
  return {
    summary: x.summary,
    headlines: x.headlines,
    sensitivity: x.sensitivity.map((s, i) => ({ ...s, id: `s${i}` })),
    style: x.style.map((s, i) => ({ ...s, id: `st${i}` })),
    hausa: x.hausaHeadline || null,
    seo: x.seo,
    altText: [],
    live: true,
  };
}

/** The paragraphs as they currently stand, after the fixes the editor has applied. */
export function currentBody(a: Article, cd: CopyDeskState, rev: Review | undefined): string[] {
  if (!rev) return a.body;
  return a.body.map((p, i) => {
    let t = p;
    for (const f of rev.style) if (f.paragraph === i + 1 && cd.styleDone[f.id]) t = t.replace(f.find, f.replace);
    for (const s of rev.sensitivity) {
      if (s.paragraph === i + 1 && cd.decisions[s.id] === "fixed") {
        t = t.replace(s.quote, s.replacement).replace(/\s+([,.;:])/g, "$1").replace(/\s{2,}/g, " ").trim();
      }
    }
    return t;
  });
}

export const canPublishRoles = ["editor-in-chief", "news-editor", "super-admin"];
