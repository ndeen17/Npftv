# NPFTV Demo: project memory for Claude Code

You are building a **clickable demo** of a new digital platform for **NPFTV (Nigeria Police Force Television)**. It is a prototype to show stakeholders, built on **fake data, with no database and no real backend**. Many people will see it, so it must look finished and must never be mistaken for official NPF information.

Read these before writing code:

| File | What it holds |
|---|---|
| `docs/demo-plan.md` | Scope, architecture, the 10-minute demo script, every screen to build, ERP modules, build order |
| `docs/design-system.md` | Colours, type, components, page layouts, hero options, image rules |
| `docs/ai-features.md` | Every AI feature, the OpenAI proxy, prompts, guardrails, scripted fallbacks |
| `docs/mock-data.md` | Data entities, the canonical schedule, figures that must stay consistent, the demo clock |
| `docs/open-questions.md` | Decisions still open, with the working assumption for each |
| `design/npftv-design-v3.html` | Approved visual direction. Open it in a browser. Match it. |
| `design/src/*.html` | HTML/CSS source of each designed screen, to port into components |
| `design/assets/` | The only approved images: `logo.webp`, `emblem.webp`, `eod.webp`, `parade.webp` (see "Images" below) |
| `docs/reference/` | The earlier PRD draft (v0.1), the website audit, and the design inspiration PDF |

## What we are building

One Next.js app with three areas that share one fake dataset:

1. **NPFTV** (`/`): the public website. News, programmes, public safety, state commands, media centre, about, contact.
2. **NPFTV Stream** (`/stream` in the demo; `stream.npftv.net` in the real product): live TV and on-demand video with a programme guide (EPG). **Stream is a separate product that is still part of NPFTV** (see below).
3. **NPFTV Control Room** (`/control`): the staff app. **CMS** (newsroom, broadcast, programmes, alerts) plus **ERP** (production, assets, people, finance, procurement, sponsorship, correspondents, approvals). Users pick a role from a role picker; there is no login form.

Plus an **AI layer** used across all three, and a hidden **presenter panel** (Shift + P) to drive the demo live.

> **Decision (25 Nov 2026): live AI with gpt-5-mini, no other backend.** No database and no other server code. One Vercel function, `app/api/ai/route.ts`, holds `OPENAI_API_KEY` and calls OpenAI (Responses API, strict JSON schemas). Feature prompts, input checks and output checks live in `lib/server/features.ts`. The browser calls `askAI()` in `lib/ai-client.ts`, which falls back to the scripted answers in `lib/ai.ts` / `lib/copydesk.ts` on any error or after 15 seconds, or when the presenter turns on "Scripted AI only". The exact demo-script inputs (the BVN SMS, the Kano story, the three Director question chips) always use their reviewed scripted answers. Live features: scam checker, Ask NPFTV, search, article and headline translation (Hausa, Pidgin, Yoruba, Igbo), Catch me up, copy desk for any story other than Kano (reporters can write new stories), submission triage, ask-the-data. Check them with `node scripts/test-ai.mjs` while the app runs.

### NPFTV Stream: separate, yet combined

- **Separate:** Stream has its own home page, its own navigation, its own name and identity ("NPFTV Stream"), and its own address (`stream.npftv.net` in the real product). It works on its own: someone can go straight to Stream without touching the main site. In the demo it uses its own layout with its own top bar (no npftv.net header), in its own route group (`app/(stream)/stream/...`), with its own components, so it can be split into a separate app later.
- **Combined:** the main site's **Watch live** button and hero lead to Stream; the homepage embeds a **Live on NPFTV Stream** module (player, on-air card, up next, "Open NPFTV Stream"); Stream links back to npftv.net; programmes, episodes and the schedule are the **same records** on both; one Control Room manages both; both use the same design system.
- **Why `/stream` in the demo:** with no backend, the live sync between Control Room and the public pages only works on one origin (localStorage + BroadcastChannel). A real subdomain is a different origin and would break that. Show `stream.npftv.net` as Stream's address in labels and links, but route it to `/stream`.

The core demo moment: **an action in the Control Room visibly changes the public site.** Approve a story and it appears on the homepage. Schedule a press briefing and it appears in the programme guide while the ERP books a crew and the OB van.

## Stack and conventions

- **Next.js (App Router) + TypeScript + Tailwind CSS**, deployed to **Vercel**.
- Fonts: **Zilla Slab** (headings, 500/600/700) and **Archivo** (body and UI, variable width axis) via `next/font/google`.
- Design tokens live in Tailwind config / CSS variables, named as in `docs/design-system.md`. Do not invent new colours.
- Mock data lives in `data/*.json` (or typed `data/*.ts`). Read it through one small store module, never import JSON directly into pages.
- Runtime changes (approved stories, new schedule items, live/off-air state) are kept in **localStorage** and synced across tabs with **BroadcastChannel** (fallback: the `storage` event). A **Reset demo** button restores the seed data.
- **Only server code:** `app/api/ai/route.ts` (see the decision above). Never import `lib/server/*` from a client component.
- Code map: `data/` (seed data), `lib/store.tsx` (state, cross-tab sync, actions + audit log), `lib/broadcast.ts` (on air / up next), `lib/time.ts` (WAT clock), `lib/ai.ts` (scripted AI), `styles/` (design CSS ported from `design/src`, scoped `.site`, `.strm`, `.ctl`), `components/`, `app/(site)`, `app/(stream)/stream`, `app/control`.
- Keep components small and reusable: `LiveBadge`, `LowerThird`, `ProgrammeCard`, `StoryRow`, `DateBlock`, `QuickAction`, `KpiTile`, `ApprovalItem`, and so on.
- Responsive down to 360px. Visible keyboard focus. Respect `prefers-reduced-motion` (the pulsing live dot is the only ambient animation).
- Use British English spelling in UI copy (programme, organisation, centre). Times are shown in **WAT**.

## Hero and images

- **Homepage hero (chosen by the client): the NPFTV emblem.** Plain indigo with a soft violet glow, the stacked tagline "Inform. Educate. Inspire." on the left, the emblem glowing on the right, an "On air now" line under the buttons. Source: `design/src/hero_emblem.html`. The live TV-screen and real-photo heroes were not chosen.
- Images, in `design/assets/` (copy to `public/images/`):
  - `logo.webp` (200px, transparent circle): header, footer, player bug, avatars
  - `emblem.webp` (1000x750, emblem on an indigo plate): **the hero**, and the Network Director section
  - `parade.webp` (1080x718): the embedded Live module and Stream player still, and the photo band
  - `eod.webp` (984x656): news thumbnail, The Force in Focus poster, on-demand thumbnail
- They were captured from npftv.net at web resolution. Ask NPFTV for originals (and a vector logo) before launch. Everything else is typographic artwork: programme posters, social thumbnails, placeholders.

## Non-negotiable rules

1. **Prototype banner on every page:** "Prototype with demo data. Stories, figures and names are fictional and not official NPF information."
2. **Fictional people only.** Staff and reporters get invented names (e.g. Amina Bello, Musa Ibrahim). **Real leaders are referred to by title only** ("the Inspector-General", "the Network Director", "the Commissioner of Police"). Never put invented quotes in a real person's mouth.
3. **No photos of identifiable public figures.** Use only the images in `design/assets/`. Do not pull YouTube thumbnails or other npftv.net photos: they show the IGP, the President and senior officials.
4. **Do not use the AI-generated crew image** (`npftv-crew.webp` on npftv.net). The client rejected it.
5. **Not an emergency service.** Contact pages, the footer, Ask NPFTV and the scam checker all say so, and point to **112** for emergencies.
6. **AI drafts, people approve.** Nothing AI-generated is published without an editor's approval in the workflow. Translations are labelled "AI draft, needs review".
7. **Never ship the OpenAI key to the browser.** No `NEXT_PUBLIC_` key, no client-side OpenAI calls. `.env.local` stays out of git.
8. **Staff "login" is a role picker**, never a password form.
9. Host on a **separate demo address**, never on the live npftv.net domain.

## Build order (milestones)

1. **Foundation:** scaffold, tokens, fonts, layout shells for `/`, `/stream`, `/control`, the mock-data store with cross-tab sync, role picker, presenter panel, prototype banner.
2. **NPFTV site:** homepage with the emblem hero and the embedded Live on NPFTV Stream module (match the design exactly), newsroom list + article page, programmes + programme page, Public Safety hub with scam checker UI, State Commands map, Media centre, About, Contact.
3. **NPFTV Stream:** its own layout and top bar, Stream home, live page (player, TV graphics, captions, live/off-air states), EPG, on-demand library, episode page.
4. **Control Room CMS:** role dashboards, submissions inbox, story editor with AI copy-desk panel, approval workflow, homepage curator, alerts, broadcast control, schedule manager, audit log.
5. **Control Room ERP:** Network Director overview, production calendar, assets, people, finance + procurement, sponsorship, correspondents, approvals inbox.
6. **AI:** `/api/ai` proxy (gpt-5-mini), then each feature with its scripted fallback.
7. **Polish and rehearse:** mobile pass, run the demo script end to end, deploy.

The folder already contains `docs/` and `design/`, so `create-next-app .` may refuse to run here. Scaffold into a temporary folder and move the files in, or set the project up by hand. Keep `docs/` and `design/` where they are.

Work milestone by milestone. At the end of each one, run the app, check the screens against `design/npftv-design-v3.html`, and summarise what is done and what is next.

## Commands (once scaffolded)

```bash
npm run dev      # local dev on http://localhost:3000
npm run build    # production build check
npm run typecheck
```

Environment: `.env.local` with `OPENAI_API_KEY` (optional: `OPENAI_MODEL`, default `gpt-5-mini`; `AI_DAILY_REQUEST_LIMIT`, default 2000). On Vercel, add the same under Settings, Environment Variables, then redeploy. Without a key everything still works on scripted answers.
