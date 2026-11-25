# NPFTV demo plan

Source: planning sessions in November 2026 and the "NPFTV Demo Plan" whiteboard (claude.ai artifact: https://claude.ai/artifact/3hTSW4HpS2u2jFVWWKZr3A).

**One fake world, four surfaces, AI throughout.**

## 1. Decisions already made

| Topic | Decision |
|---|---|
| What we build now | A clickable **demo**: fake data, no database, no real backend |
| Audience | Wide. Many people will see it, so it must be polished and clearly marked as a prototype |
| Products | NPFTV website, NPFTV Stream, NPFTV Control Room (CMS + **ERP**) |
| AI | **OpenAI API**, called only through one serverless function that holds the key |
| Brand | Keep the **current NPFTV brand** (indigo, logo yellow, Nigerian green, emblem). Layout ideas taken from a US Sheriff's Office website design (see `reference/design-inspiration.pdf`) |
| Viewer accounts | None. The public watches and reads without signing in |
| Staff access | Role picker (no passwords) in the demo |
| Hero | **The NPFTV emblem** (chosen). The live-TV-screen and real-photo options were not chosen |
| NPFTV and Stream | **Separate products, combined through shared content and the Control Room.** Stream has its own home, navigation, identity and address (stream.npftv.net); the main site links to it and embeds the live channel |
| Existing site | https://npftv.net (Next.js, font Archivo, indigo #1c0d37). The demo is a redevelopment, not an extension |

## 2. NPFTV and NPFTV Stream: separate, yet combined

This comes from the original PRD: NPFTV Stream is "a dedicated streaming platform offering live television and video-on-demand. It will operate independently while remaining accessible from the main NPFTV website", with its own homepage, navigation and identity, at a proposed `stream.npftv.net`, and a failure in one public product should not take the other down.

| | NPFTV (main site) | NPFTV Stream |
|---|---|---|
| Job | News, public safety, institutional information | Watching: live TV, on demand, guide, podcasts |
| Identity | "Nigeria Police Force / Television Network", light pages | "NPFTV Stream", dark video-first pages |
| Address | npftv.net | stream.npftv.net (demo: `/stream`) |
| Navigation | News, Watch, Programmes, Public safety, State commands, About | Live, Guide, On demand, Programmes, Podcasts, plus a link back to npftv.net |

**How they connect:**
- Watch live (header button, hero, quick-access row) opens Stream's live page.
- The homepage embeds a **Live on NPFTV Stream** module: player, on-air card, up next, "Open NPFTV Stream".
- Programme pages on the main site show the latest episodes and link to them on Stream.
- The same programme, episode and schedule records feed both. The Control Room manages both.
- Shared design system, shared search index (later), shared analytics (later).

**In the demo** both live in one Next.js app (Stream under `/stream` with its own layout), because the no-backend live sync needs one origin. The code is kept separate so Stream can become its own deployment for the real build.

## 3. How it fits together

```
                Presenter panel (hidden)
     go live / off-air, breaking news, push alert, scripted AI
                           |
                           v
 Control Room  --publishes, books-->  Shared mock data  -->  NPFTV website
 (CMS + ERP)                          (JSON seed +          NPFTV Stream
       ^                               localStorage)              ^
       |                                    |                     |
       +--------- drafts, checks ---- AI layer (OpenAI) -- answers, translates
```

- Run the demo as **two browser tabs side by side** (Control Room and the public site) plus a phone for the public steps. Cross-tab sync makes changes appear instantly.
- Routes: `/` (website), `/stream` (Stream), `/control` (Control Room). Presenter panel opens with a keyboard shortcut (suggest `Shift + P`) or a hidden corner button.

### Presenter panel controls

- Live state: **Live / Off-air / Technical difficulty** (shows the right player state everywhere)
- **Demo clock**: pin to a time (default **Monday 19:12 WAT**, The Beat on air) or follow real WAT
- **Breaking news**: push a headline into the ticker
- **Public safety alert**: push a prepared alert into the alert bar
- **Scripted AI** on/off (pre-written answers instead of live OpenAI calls)
- **Reset demo** (restore seed data)

## 4. The 10-minute demo script

| # | Who / where | What happens |
|---|---|---|
| 1 | A citizen, 7:00 pm WAT, on a phone | Homepage: the emblem hero with "On air now: The Beat", the alert bar, the news ticker, and the embedded Live on NPFTV Stream module |
| 2 | Open NPFTV Stream | Stream as its own product: the player with captions, the programme guide, and ✦ **Catch me up** |
| 3 | Scam checker ✦ | Paste a fake "your BVN is blocked" SMS; the warning signs are explained in plain words |
| 4 | Kano correspondent (Musa Ibrahim) | Switch to Control Room; submit a story with photos from Kano State Command |
| 5 | Editor-in-Chief (Amina Bello) ✦ | AI copy desk: summary, headlines, Hausa draft, sensitivity flags. Fix, approve, and it's on the homepage |
| 6 | Broadcast Manager | Schedules Thursday's press briefing from Force Headquarters; it appears in the programme guide at once |
| 7 | Network Director ✦ | ERP shows the crew, OB van and costs that briefing created; asks the daily brief a question |
| 8 | Close on the audit log | Every action recorded: who did what, when. AI drafted; people approved |

✦ = AI moment.

## 5. Screens to build

### NPFTV website (`/`)
- **Homepage**, in this order: prototype banner, public-safety alert bar, header (logo, nav, search, Watch live), Latest ticker, **emblem hero**, round quick-access row (Watch live, Programme guide, Scam checker ✦, Report a crime, State commands, Media centre), **Live on NPFTV Stream** module, message from the Network Director, news and press releases beside upcoming broadcasts (date blocks), programmes rail, Public Safety section with ✦ scam checker and guides, parade photo band, social feed, footer with alert sign-up
- **Newsroom**: category pages (National News, Police News, IGP's Activities, Operational Updates, State Commands, Investigations, Community Policing, Public Safety, Official Statements, Press Releases, International Relations, Human Interest) and an **article page**
- **Programmes**: list + one page per programme (description, schedule, episodes, related stories)
- **Public Safety**: hub, guides, active alerts, ✦ scam checker, "how to report a crime"
- **State Commands**: Nigeria map (tile map is fine) of the 36 states + FCT, then a state page
- **Media centre**: photos, videos, downloads with permissions
- **About NPFTV**: mandate, vision and mission, structure, leaders **by title only**, documents
- **Partner with NPFTV** and **Contact** (desks: newsroom, media relations, partnerships, programming, production, technical support, photography). Clearly not an emergency line
- ✦ Plain-language search; ✦ language switch (English, Hausa, Pidgin first; Yoruba and Igbo later)

### NPFTV Stream (`/stream`, its own layout)
- **Stream top bar** (designed): "NPFTV Stream" identity, Live / Guide / On demand / Programmes / Podcasts, search, link back to npftv.net
- **Stream home**: live hero (player + on air now), up next, rails (latest on demand, programmes, live events, podcasts). Not designed yet: build it from the live page's components
- **Live page** (designed): player with LIVE badge, viewer count, NPFTV bug, TV lower-third graphic, captions, controls; "On now" card; ✦ Catch me up; Up next; ✦ chapters ("Tonight's stories"); programme guide strip; Latest on demand rail
- **Off-air state**: a designed holding screen with next programme and schedule (never a spinner or "Loading…")
- **Programme guide (EPG)**: day and week views in WAT, now-line
- **On-demand library**: filters by programme, topic, date
- **Episode page**: player, chapters, ✦ catch-me-up summary, related episodes
- **Live events and premieres** (press briefings)
- **Podcasts**: The Insight Podcast
- ✦ **Ask NPFTV** assistant (public safety answers)

### Control Room: CMS (`/control`)
- Role picker: Reporter, News Editor, Editor-in-Chief, Broadcast Manager, Programme Manager, Media Manager, Public Information Officer, Network Director, Super Administrator
- Dashboard per role
- **Submissions inbox** with ✦ AI triage (category, urgency, duplicates)
- **Story editor** with the ✦ **AI copy desk** panel (designed): summary, sensitivity check, house style, headline options, translations, SEO. Workflow: Draft → Submitted → Approved → Scheduled/Published; also Returned, Rejected, Withdrawn
- **Homepage curator** (lead story, ticker, featured items)
- **Public safety alerts** (approval required before publishing)
- **Broadcast control**: live/off-air, now playing, live events
- **Programmes and schedule manager**
- **Media library**
- **Audit log**

### Control Room: ERP (`/control/ops/...`)
- **Overview** for the Network Director (designed): KPIs, ✦ daily brief with ask-the-data, approvals, production this week, budget by department, assets, correspondent map
- **Production**: calendar, crew assignment with clash warnings, studio and OB van bookings
- **Assets**: cameras, drones, OB vans, vehicles; check-out/in; maintenance
- **People**: civilian staff and seconded officers (with rank), rosters, leave
- **Finance**: budget vs actual by department and programme
- **Procurement**: requests with an approval chain
- **Sponsorship and airtime**: partners, PSA campaigns, sponsored segments booked against the schedule
- **Correspondents**: the 36 states + FCT, stories sent, response times
- **Approvals inbox**: one queue for articles, alerts, purchases, leave, sponsorship
- **Reports** with export

**The ERP story:** one event touches everything. "Press briefing, Thursday 11:00" creates an EPG entry, a live stream slot, a 4-person crew assignment, an OB Van 1 booking, a cost against the broadcast operations budget, and later an article and social clips.

## 6. Build order

1. Foundation: tokens, components, mock data store, app shells, role picker, presenter panel
2. NPFTV site: homepage (emblem hero, embedded Stream module), newsroom, article, programmes, Public Safety, State Commands
3. NPFTV Stream: own layout and top bar, Stream home, live player + off-air, programme guide, on-demand, episode page
4. Control Room CMS: dashboards, article workflow, submissions, broadcast control, alerts
5. Control Room ERP: production calendar, assets, finance + procurement, approvals, correspondents
6. AI: proxy function, copy desk, scam checker, Ask NPFTV, translations, daily brief, fallbacks
7. Polish and rehearse: mobile pass, run the script end to end, Reset demo, deploy

## 7. Out of scope for the demo

Real database, real authentication, real streaming infrastructure, payments, public comments, user-generated uploads, emergency dispatch, native mobile apps. (See the PRD draft in `reference/` for the full product, which these come from later.)
