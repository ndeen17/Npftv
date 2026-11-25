// Scripted AI copy desk. Exact answers for the demo's Kano story; a light generic review for anything else.

import { KANO_ID } from "@/data/articles";
import { translate } from "@/lib/ai";
import type { Article } from "@/lib/types";
import type { CopyDeskState } from "@/lib/store";

export interface Headline {
  text: string;
  note?: string;
}

export interface Review {
  summary: string;
  sensitivity: { key: "op" | "suspect"; title: string; where: string; fixLabel: string }[];
  style: { find: string; replace: string }[];
  headlines: Headline[];
  hausa: string | null;
  seo: { title: string; description: string };
  altText: string[];
}

const KANO_HEADLINES: Headline[] = [
  { text: "Kano opens safety forums in all 44 local government areas", note: "Clearest for search, 57 characters" },
  { text: "Residents and police to meet monthly under new Kano forums" },
  { text: "Kano command launches neighbourhood safety forums in 44 LGAs", note: "Reporter's original" },
];

export function review(a: Article): Review {
  if (a.id === KANO_ID) {
    return {
      summary: "Kano opens monthly safety forums in all 44 local government areas so residents and officers can meet regularly.",
      sensitivity: [
        { key: "op", title: "Reveals where an operation is under way", where: "Paragraph 3 names the location of an active team.", fixLabel: "Remove that clause" },
        { key: "suspect", title: "Names a suspect who hasn't been charged", where: "Paragraph 4. House style: describe, don't name.", fixLabel: 'Use "a 34-year-old man"' },
      ],
      style: [{ find: "have been been", replace: "have been" }],
      headlines: KANO_HEADLINES,
      hausa: translate(KANO_HEADLINES[0].text, "ha"),
      seo: {
        title: "Kano opens safety forums in all 44 LGAs | NPFTV",
        description: "Residents, traditional leaders and divisional officers in Kano will meet every month at new neighbourhood safety forums.",
      },
      altText: ["Residents and officers at the launch of a neighbourhood safety forum in Nassarawa, Kano", "Divisional officers speaking with residents at the forum launch", "Residents gathered for the Kano safety forum launch"],
    };
  }
  const short = a.title.length > 60 ? `${a.title.slice(0, 57)}…` : a.title;
  return {
    summary: a.summary,
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

/** The paragraphs as they currently stand, after any fixes the editor has applied. */
export function currentBody(a: Article, cd: CopyDeskState): string[] {
  if (a.id !== KANO_ID) return a.body;
  return a.body.map((p, i) => {
    let t = p;
    if (cd.style) t = t.replace("have been been", "have been");
    if (i === 2 && cd.op === "fixed") t = t.replace(/ to the Sabon Gari market axis, where a team is currently tracking a suspected kidnapping gang\./, " to support an ongoing operation in the state.");
    if (i === 3 && cd.suspect === "fixed") t = t.replace("A suspect, Sani G., 34, was arrested", "A 34-year-old man was arrested");
    return t;
  });
}

export const canPublishRoles = ["editor-in-chief", "news-editor", "super-admin"];
