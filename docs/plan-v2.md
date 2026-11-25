# NPFTV demo, version 2: citizen services and a lighter look

Plan written 25 November 2026. Status: **approved. Phases 1 to 3 done (25 Nov); Phase 4 next.**

**Decisions (25 Nov 2026):**
- **Stream:** a dark "theatre" band for the player only, with light pages around it.
- **Wanted persons:** included, with the safeguards in Phase 3.
- **Flood demo moment:** added as an optional script step. Flooding is only the example: reporting covers any event.
- **NPFTV is the police's media arm, not the police.** It informs, educates and inspires. It doesn't take crime reports, handle complaints, investigate, or send help. Every citizen feature is public information or public reporting for news and awareness, and always points people to the body that can act. See Section 1a.
- **Complaints:** NPFTV explains how complaints about officers are handled and points to the right bodies. No complaint form and no complaint tracking on NPFTV.
- **Citizen reports:** sent to the NPFTV newsroom for news and public awareness, with tracking of the newsroom's progress. NPFTV does not forward or escalate them.
- **No dead links between phases:** each phase adds its own homepage, quick-access and navigation entry points when its pages go live (Phase 1 does not link to pages that don't exist yet).

## 1. What we are changing, and why

Version 1 is strong on broadcasting (news, Stream, the Control Room). Version 2 makes NPFTV useful to a citizen **on a bad day**: someone being scammed, someone who sees a flood rising, someone whose relative is missing, someone stopped by an officer who wants to know their rights, someone who wants to complain about an officer. It also makes the whole product feel lighter and friendlier.

**Requests, mapped to the plan**

| # | Request | Where in this plan |
|---|---|---|
| 1 | White footer | Phase 1 |
| 2 | Stream feels too dark; add white | Phase 1 |
| 3 | Remove "Upcoming broadcasts" from the landing page | Phase 1 |
| 4 | Scam checker should be conversational, cover romance pressure and other scenarios | Phase 5 |
| 5 | Citizens can report events around them (floods, fires, crashes, not only crime) | Phase 4 |
| 6 | Citizens' rights and police powers in clear language | Phase 2 |
| 7 | Wanted persons and missing persons | Phase 3 |
| 8 | How investigations are handled | Phase 2 |
| 9 | How complaints about officers are handled | Phase 2 |
| 10 | A general chatbot, available everywhere, with actionable answers about everything on the platform | Phase 6 |
| 11 | Everything grounded in Nigeria | Section 3, applies to every phase |
| 12 | Proper UI/UX, even for a demo | Section 4, applies to every phase |

**What must not break:** the 10-minute demo script (BVN text, Kano story, press briefing, Director's brief), cross-tab live sync, scripted fallbacks for every AI feature, the prototype banner, "not an emergency service, call 112", British English, WAT times, and responsiveness down to 360px.

## 1a. What NPFTV is, and isn't

NPFTV (Nigeria Police Force Television) is the **media arm** of the Nigeria Police Force: a broadcaster and publisher. Its job is to **inform, educate and inspire**.

| NPFTV does | NPFTV does not |
|---|---|
| Report verified police news and public safety information | Take crime reports or open cases |
| Explain citizens' rights, police powers and how processes work | Investigate, arrest, or send officers or help |
| Publish alerts and notices issued by police commands (missing persons, wanted persons, safety alerts) | Handle complaints about officers, or decide their outcome |
| Receive citizen reports for news coverage and public awareness | Forward, escalate or act on reports |
| Point people to the right body: 112, the nearest station, NEMA, FRSC, the Complaint Response Unit, NHRC, the Legal Aid Council | Promise that anyone will respond |

**What this means for every screen:**
- Any form or chat that a citizen might mistake for "telling the police" says plainly: *"NPFTV is the police's television and news service. We can't send help or open a case. In an emergency, call 112."*
- Every page ends with **who to contact** to get something done, and NPFTV's own part is limited to informing.
- Citizen reports are framed as *"Send a report to the NPFTV newsroom"*: they help NPFTV warn and inform the public. They are never framed as a police report.

## 2. Product goals for version 2

1. **A citizen can get help in under a minute**: describe a situation in plain words (or Pidgin, Hausa, Yoruba, Igbo) and get a clear next step.
2. **Every route ends in an action**: a number to call, the right agency to contact, a page to read, or a report to the newsroom. No dead ends.
3. **Trust and safety first**: never pretend to be an emergency service, never shame a victim, never expose a suspect who hasn't been charged, never invent law.
4. **The newsroom sees what citizens send**: citizen reports reach the NPFTV newsroom in the Control Room with AI triage; verified ones can become public awareness alerts or stories. NPFTV doesn't forward or escalate reports. This adds a second "Control Room changes the public site" moment.
5. **It looks and feels finished**: lighter, calmer, consistent with the approved brand.

## 3. Nigeria first: decisions that apply everywhere

**Emergency and helplines**
- **112** is the national emergency number (free on all networks). It appears on every emergency path.
- **FRSC 122** for road crashes and road emergencies (Federal Road Safety Corps).
- For other agencies (NEMA, state emergency management agencies (SEMAs), fire services, NPF Complaint Response Unit, NAPTIP, NHRC, Legal Aid Council), we name the agency and what it handles, but **show "Contact details to be confirmed by NPFTV" instead of inventing phone numbers.** Real numbers are added only once NPFTV supplies verified ones. This goes on the client question list.

**Who handles what (used by reporting, the scam checker and the chatbot)**

| Situation | Main responder | Also |
|---|---|---|
| Crime in progress, danger to life | Police, through 112 | |
| Flood, building collapse, large disaster | NEMA / state SEMA, through 112 | Police for crowd and traffic control |
| Fire | State or Federal Fire Service, through 112 | |
| Road crash, road blockage | FRSC 122, or 112 | Police |
| Financial fraud, scams | Your bank first, then the NPF National Cybercrime Centre (NPF-NC3) or the EFCC | |
| Human trafficking, missing child | Police, and NAPTIP for trafficking | |
| Officer misconduct | NPF Complaint Response Unit | Police Service Commission, National Human Rights Commission (NHRC) |
| Can't afford a lawyer | Legal Aid Council of Nigeria | |

**Law that the "Your rights" content draws on** (plain-language summaries, each with its source):
- **Constitution of the Federal Republic of Nigeria 1999**, Chapter IV: s.34 dignity (no torture or degrading treatment), s.35 personal liberty (told the reason for arrest in writing within 24 hours, in a language you understand; the right to remain silent until you've spoken to a lawyer; brought before a court within 24 hours if a court is within 40 km, otherwise within 48 hours), s.36 fair hearing and presumed innocent, s.37 privacy, s.41 freedom of movement.
- **Administration of Criminal Justice Act 2015 (ACJA)**: no arrest of someone in place of a suspect ("arrest in lieu"); no arrest for a purely civil matter or a breach of contract; a woman is searched by a woman; arrests are recorded; humane treatment.
- **Police Act 2020**: officers' powers and duties; bail at a police station is free.
- **Anti-Torture Act 2017.**
- **Nigeria Data Protection Act 2023 (NDPA)**: governs any personal data we collect in reports and complaints.

**Mandatory safeguard:** every rights, investigations and complaints page is labelled *"Demo content. To be reviewed by NPF Legal before publication."* Section numbers are only shown where we are confident of them. Where we aren't, we cite the Act without a section number.

**Places:** reports use **state, then LGA, then nearest landmark** (e.g. "opposite the First Bank, Lokoja"), because many Nigerian addresses are landmark-based. For the demo we include LGA lists for the states used in the script (Kogi, Lagos, FCT, Kano) and free text elsewhere. The "Use my location" option is shown, but in the demo it only fills the state.

**Connectivity and devices:** most visitors are on phones, often on expensive or patchy data. So: no autoplay, small images, forms that work with one thumb, nothing lost if the connection drops (reports are drafted locally first), and a "Share on WhatsApp" button on alerts and missing-person notices.

**Languages:** UI in English. The chatbot and the scam assistant reply in the user's language if they write in Pidgin, Hausa, Yoruba or Igbo, with a "machine translation" note.

**Fictional people, again:** all wanted and missing persons are fictional. **No photos.** We use neutral silhouette cards with a "Photo withheld in this demo" label, and never use photos of real people.

## 4. UX and design principles for version 2

- **Lighter, calmer.** White and paper surfaces dominate. Indigo is used for headers and for focus moments (the hero, the player band), not as wallpaper.
- **Talk, don't form.** For stressful situations (scams, reporting), start with a conversation or one simple question, then show a structured summary to confirm. Long forms come last, pre-filled.
- **One primary action per screen.** Yellow button = the thing to do next.
- **Emergency always one tap away.** A consistent "In danger now? Call 112" strip on every help page, inside the chatbot and in report forms.
- **No shame, no blame.** Copy is written for frightened or embarrassed people, especially romance-scam victims.
- **Show what happens next.** A citizen report gets a reference number (e.g. `NPFTV-RPT-26-04817`) and says what the newsroom does with it. Nothing promises a police response.
- **Accessible:** keyboard paths, visible focus, 4.5:1 contrast on all new light surfaces, labelled form fields, `aria-live` for chat messages, reduced motion respected.
- **Consistent components:** new pages reuse the existing tokens (no new colours), Zilla Slab headings and Archivo text, plus a small set of new shared components (Section 7).

## 5. New information architecture

**Main navigation (website)**

`News · Watch · Programmes · Safety · Your rights · State commands · About`

- **Safety** (was "Public safety") becomes the hub for: scam assistant, send a report to the newsroom, missing and wanted persons (police notices), alerts, safety guides.
- **Your rights** is the hub for: rights and police powers, how investigations work, and how complaints about officers are handled (information only).
- The mobile menu groups these under the same two headings.

**New routes**

| Route | Page |
|---|---|
| `/safety` | Safety hub (replaces `/public-safety`, which redirects) |
| `/safety/scam-check` | Conversational scam assistant |
| `/safety/report` | Send a report to the NPFTV newsroom (public reporting for news and awareness) |
| `/safety/missing` and `/safety/missing/[id]` | Missing persons, list and notice |
| `/safety/wanted` and `/safety/wanted/[id]` | Wanted persons, list and notice |
| `/safety/alerts` | Active alerts, including verified community alerts |
| `/safety/guides/[id]` | Safety guides (moved) |
| `/rights` | Your rights: hub |
| `/rights/[topic]` | Topics: when stopped, if arrested, at the station, bail, searches, your phone, detention limits, women and children, what officers must do, what officers cannot do |
| `/rights/investigations` | How a case is investigated, step by step |
| `/rights/complaints` | How complaints about officers are handled, who to contact, and how to prepare your complaint (no form: NPFTV doesn't take complaints) |
| `/track` | Track a report you sent to the newsroom |
| `/control/reports` | Control Room: citizen reports to the newsroom |
| `/control/notices` | Control Room: missing and wanted notices issued by police commands, published by the newsroom |

**Homepage, new order**

1. Prototype banner, alert bar, header, Latest ticker (unchanged)
2. Emblem hero (unchanged)
3. Quick-access row, still 6 circles: **Watch live · Scam check (AI) · Send a report · Missing & wanted · Know your rights · State commands**. Programme guide and Media centre stay in the navigation and footer.
4. Live on NPFTV Stream (unchanged)
5. **"How can we help?"**: a new strip with the chatbot entry ("Ask anything: scams, your rights, reporting, programmes…") and 4 task cards (I'm being scammed / Something is happening near me / Someone is missing / How do I complain about an officer?).
6. Message from the Network Director (unchanged)
7. **News and press releases, now full width** (lead story large, plus 2 more). **"Upcoming broadcasts" removed**: what's coming up stays in the Live module and on Stream.
8. Programmes rail (unchanged)
9. Safety section: guides plus a compact scam-assistant teaser (the full chat lives on its own page)
10. Missing persons strip (two notices, "Have you seen them?")
11. Photo band, social feed (unchanged)
12. **White footer**

## 6. Phases

Each phase ends with: type check, production build, the full demo-script test, the new tests for that phase, a mobile check at 360, 390 and 768px, and a short summary for approval before the next phase.

### Phase 1: Visual refresh and homepage restructure (size: M)

**1a. White footer**
- White background, 4px flag stripe on top, indigo slab headings, ink links, muted body text, a paper-coloured bottom bar.
- The newsletter sign-up becomes an outlined input with an indigo button.
- Keep the 112 notice, in bold red text, not a red block.
- Same footer on the website; Stream gets a lighter version of its own footer.

**1b. A lighter Stream, keeping its own identity**
- **Top bar:** white, with the indigo "NPFTV" wordmark, a yellow "Stream" label and indigo nav pills (active pill indigo with white text, live dot red).
- **"Theatre" band:** the player and its side cards (On now, Catch me up, Up next) sit on a deep indigo band, because video looks best on dark and it keeps the TV feel. The band ends after the chapters.
- **Everything below on paper and white:** programme guide, rails, on demand, podcasts, Ask NPFTV, episode details. Guide slots become white cards with a 1px line border; the current slot stays yellow and the now-line stays red.
- **Holding screens** (off air, technical difficulty) are unchanged: they are inside the player.
- Contrast check on every new combination.
- `docs/design-system.md` is updated: "Stream: light pages with a dark theatre band".

**1c. Homepage:** "Upcoming broadcasts" is removed, and news goes full width (a lead story plus two). The "How can we help?" strip and the new quick-access circles are added in the phases whose pages they link to.

**1d. Navigation:** "Public safety" becomes "Safety" at `/safety`. `/public-safety` and old guide links redirect, and all internal links are updated. "Your rights" joins the navigation in Phase 2.

**Acceptance:** the demo script still passes. No horizontal scroll at 360px. Lighthouse accessibility 95+ on the homepage and Stream live. Visual check against the approved design (brand and type unchanged, surfaces lighter).

### Phase 2: Your rights, investigations, complaints (size: M, mostly content)

**2a. Your rights and police powers (`/rights`)**
- **Hub:** "Know where you stand." Situation-first cards: *Stopped on the road · Stopped and searched · Being arrested · At the police station · Bail · Your phone and your home · Held too long · Women, children and vulnerable people.*
- **Topic page layout:**
  1. **In short:** 3 bullets.
  2. **What the officer can do / What the officer cannot do:** two columns, green ticks and red crosses.
  3. **What to say and do:** calm, practical steps (stay calm, ask for the officer's name and number, ask why, don't resist, remember details).
  4. **If your rights are not respected:** a link to how complaints are handled and who to contact.
  5. **The law:** sources, e.g. Constitution s.35, ACJA 2015, Police Act 2020.
  6. The legal-review label.
- **Tone:** neither anti-police nor naive. "Officers have powers to keep everyone safe. You have rights that protect you. Both are in the law."
- **Must-include facts** (from Section 3): bail is free; no arrest in lieu of a relative; police don't recover debts or settle civil disputes; you must be told why you're arrested; court within 24/48 hours; right to remain silent and to a lawyer; free legal aid through the Legal Aid Council; a woman is searched by a woman; no torture.
- **"Officer stopped me" quick card:** a printable/shareable one-screen summary (also a WhatsApp share).

**2b. How investigations work (`/rights/investigations`)**
- A vertical step timeline: **Report** (statement, reference) → **Case file** (case diary, investigating officer assigned) → **Investigation** (divisional CID, then the State CID or the Force CID for serious cases) → **Advice** (the case file may go to the Director of Public Prosecutions or the state Attorney-General) → **Charge and court**.
- For each step: what happens, what you can expect, what you can do, and typical timelines (labelled "illustrative").
- Plus "Your rights as a victim or witness", and "Following up on your case" (who to ask at the station, and what to do if there's no progress). NPFTV only explains; follow-up happens with the police.

**2c. Complaints about officers (`/rights/complaints`)**: information only
- A clear note at the top: *"NPFTV can't take or investigate complaints. Here's how the police and other bodies handle them, and how to contact them."*
- **Who to contact:** the NPF Complaint Response Unit (first stop: bribery, extortion, rudeness, unlawful arrest, brutality), the Police Service Commission (constitutionally responsible for police discipline), the NHRC (human rights violations), and the courts (with the Legal Aid Council). Contact details to be confirmed by NPFTV.
- **What happens after you complain:** received, reviewed, assigned, investigated, outcome; plus protection from retaliation.
- **Prepare your complaint:** a checklist (date, time and place; the officer's name or number; vehicle number; what happened; witnesses; photos or receipts).
- **AI helper "Help me write it down":** the citizen describes what happened in their own words; the AI turns it into a clear, factual summary under those headings, flagging anything missing. The citizen copies or shares it (WhatsApp, email) and sends it to the channel themselves. **Nothing is sent to NPFTV, nothing is stored, and there is no tracking.**

**AI:** `complaint-helper` (free text → a structured, neutral summary + missing details + suggested channel). Scripted fallback: a template that fills the headings from the citizen's text.

**Acceptance:** every topic page has In short, Can/Cannot, What to do, The law, and the review label. The complaints page makes NPFTV's role clear, lists every channel, and the helper produces a copyable summary (live and scripted). No complaint data is stored anywhere.

### Phase 3: Missing and wanted persons (size: M)

**Public: missing persons (`/safety/missing`)**
- Notice cards: silhouette, name (fictional), age, sex, last seen (place and date), height and build, clothing, "missing for 3 days" counter.
- **Have you seen them?** NPFTV doesn't take tips. The notice shows who issued it (e.g. "Lagos State Police Command") and tells people to contact that command, their nearest police station, or 112 if it's urgent.
- Share on WhatsApp.
- **How to report someone missing:** you do **not** need to wait 24 hours; go to the nearest station with a recent photo and details; for children and suspected trafficking, the police and NAPTIP.
- Filters: state, age group. Found notices show a green "Found safe" banner and drop off after 48 hours.

**Public: wanted persons (`/safety/wanted`)**
- **Strict rules on the page:**
  - Shows only people the police have formally declared wanted, with the offence they are wanted for.
  - "Everyone is presumed innocent until proven guilty in court."
  - "Do not approach. Call 112 or your nearest police station."
  - Information goes to the police, not NPFTV.
- Cards: silhouette, name (fictional), alias, offence category, state, "declared wanted" date, case reference.
- No reward amounts unless the client provides official ones.

**Control Room**
- **Notices** (`/control/notices`): the newsroom enters notices received from police commands (with the issuing command recorded), then they are approved (Editor-in-Chief or Network Director) and published.
- Mark a missing person found, withdraw a notice, set an expiry.
- The prepared "Missing person notice, Lagos" from version 1 becomes a real notice record; approving it in Approvals now publishes the notice page as well as the alert bar.

**AI:** none. Notices are written and approved by people.

**Acceptance:** a notice created in the Control Room appears publicly only after approval, showing its issuing command. "Found" updates the public page live.

### Phase 4: Send a report to the newsroom (size: L)

**Purpose:** public reporting for news and awareness. Citizens tell the NPFTV newsroom what's happening around them, crime or not: flood, fire, road crash, collapsed building, fallen power line, unrest, a community event, a public safety concern, other. NPFTV uses verified reports to warn and inform the public (alerts, stories, mentions on air). **It is not a police report and NPFTV doesn't send help**; the page says so before the citizen starts, and points to 112 and the right agency first.

**Flow** (`/safety/report`), designed for a stressed person on a phone:
1. **Safety check first:** "Is anyone in danger right now?" **Yes** → a big **Call 112** button (a `tel:112` link) and who else to call (from the table in Section 3), then "When you're safe, you can tell our newsroom so we can warn others." **No** → continue.
2. **"What's happening?"** One big text box ("Water is entering houses on our street near the Ganaja junction, Lokoja") plus tappable category chips if they prefer.
3. **The AI organises it** (`report-intake`): category, a short summary, state, LGA or landmark, how urgent, who the citizen should contact for help (from the table in Section 3), and any follow-up question it needs ("Roughly how many homes are affected?"), asked one at a time, at most 2.
4. **Check and edit:** a summary card with the fields, editable. Optional: photos (shown, not uploaded in the demo), when it started, contact details, report anonymously.
5. **Sent:** a reference (`NPFTV-RPT-26-xxxxx`), what the newsroom does next (reviews it, may check with the state command, may publish an alert or story), who to contact for actual help, safety advice for this situation (e.g. for a flood: move to higher ground, avoid moving water, switch off power), "Track it", "Share with neighbours on WhatsApp".

**Abuse and privacy:** limit 3 reports per device per hour (demo); the AI flags likely pranks or abusive text for staff; an NDPA privacy note ("We only use this for news and public awareness. Contact details are optional and are never published."); no exact location stored unless the user gives it.

**Control Room: Citizen reports** (`/control/reports`), the newsroom's desk, for the News Editor, Editor-in-Chief, Public Information Officer, Network Director and Super Administrator:
- A queue sorted by AI urgency, with category icons and state.
- **Clusters:** reports with the same category in the same LGA within 6 hours group together ("4 reports: flooding, Lokoja"), which is how real incidents show up.
- **Actions** (newsroom actions only; NPFTV doesn't forward or escalate): Mark reviewed, Checked with the state command's PRO (verification for publishing), **Create public alert** (pre-fills the existing alert form, then follows the existing approval), Use in a story or on air (opens a story draft), Not used (false, duplicate or not newsworthy).
- Tracking statuses the citizen sees on `/track`: Received → Reviewed by the newsroom → Verified → Published (alert, story or on air) / Not used.
- Each action is written to the audit log and reflected on `/track`.
- A small dashboard card on the Network Director overview: "Citizen reports today: 12 (2 urgent)".

**New optional demo step (a second "Control Room changes the public site" moment):** a citizen in Lokoja reports flooding from a phone, then the report appears in the Control Room clustered with 3 seeded reports, the newsroom verifies it with the Kogi command's PRO and creates a public awareness alert, the Network Director approves it, and the alert bar on npftv.net changes live. The citizen's `/track` page shows "Published". This fits the Nigerian reality (Kogi flooding) and takes about 90 seconds.

**Seed data:** about 15 fictional reports across states (flooding in Kogi and Bayelsa, a fire in a Kano market, a road crash on the Lagos–Ibadan Expressway, a fallen power line in Enugu, suspicious activity in Abuja), all clearly fictional.

**AI:** `report-intake` and `report-triage` (newsworthiness and public-safety urgency, who the citizen should contact, possible duplicate cluster, abuse flag). Both have scripted fallbacks (rule-based keyword categoriser), as now.

**Acceptance:** the full flow works on a 360px phone with one thumb. A report appears in the Control Room live and clusters correctly. Create public alert → approval → the alert bar updates. Track shows each status change.

### Phase 5: Conversational scam assistant (size: M)

**Why:** scams in Nigeria aren't only SMS. People are under live pressure: a "lover" abroad asking for money for customs fees, a caller "from the bank" or "from EFCC", a job or visa offer with an "application fee", crypto or "investment" doubling, fake POS reversals, loan-app harassment, "wrong transfer, please refund", landlord or online-shop deposits, fake police threatening arrest unless you pay.

**Experience** (`/safety/scam-check`, and the teaser on the homepage and the Safety hub):
- **Opening:** "Tell us what's happening. You're not in trouble, and it's not your fault. Lots of people get targeted." Starter chips: *I got a message · Someone is calling me · Someone I met online is asking for money · A job, visa or loan offer · An investment that sounds too good · Someone says they're police or EFCC · Something else.* There's also a **"Paste a message"** option: the existing BVN demo path.
- **The conversation:** the assistant asks **one short question at a time** (at most 4 turns) to understand: who contacted you, what they want, how, and how fast they're pushing you. It is empathetic, plain and non-judgemental, especially on romance (never "you were foolish"; it says "Scammers are very good at this").
- **The risk card** (always the same structure, rendered as a card, not chat text):
  - Risk level: **High / Medium / Low**, with a coloured border.
  - Warning signs: specific to their story.
  - **Do this now:** numbered steps (stop contact, don't send money, don't share OTP/PIN/BVN, call your bank on the number on your card, keep screenshots).
  - **If you've already paid or shared details:** bank first, then report to the police (nearest station, or the NPF-NC3) or the EFCC. NPFTV can't take the report, but the card explains exactly what to bring.
  - **Talk to someone you trust:** for romance and family-pressure scams, encouragement to tell someone.
- **Safety:** threats of violence or self-harm route to 112 and to support. The assistant never asks for passwords, PINs or full account numbers, and warns if the user types one ("Please don't share your PIN, even with us").
- Privacy: "Nothing you type is stored."
- **Language:** replies in the user's language.

**AI:** `scam-chat` (multi-turn: the conversation history, capped at 8 messages and 4,000 characters; returns either the next question with optional quick replies, or the final risk card). The existing `scam-check` stays for the paste path. **The demo BVN SMS keeps its scripted answer.**
- **Scripted fallback:** a decision tree per starter chip (2 to 3 questions each) that produces a sensible risk card. The demo always works without the API.

**Acceptance:** each starter chip reaches a risk card in 4 turns or fewer, live and scripted. Romance replies pass a tone review (no blame). The PIN warning triggers. Demo step 3 is unchanged.

### Phase 6: The NPFTV Assistant: one chatbot, everywhere (size: L)

**What it is:** a single assistant, "Ask NPFTV", that replaces the current Ask NPFTV box and is reachable from every public page (website and Stream) through a floating button, bottom right ("Ask NPFTV" pill on desktop, round button on mobile). It opens as a side sheet on desktop and a full-screen sheet on mobile. The conversation persists across pages within the session.

**It knows (grounding, sent compactly with each request):** safety guides, rights topics, investigations and complaints processes, scam patterns, the incident categories and who handles them, the programme schedule (now, next, this week), programmes and recent episodes, latest published news headlines, active alerts, missing-person notices (not wanted-person details beyond what's public), state commands, and contact desks.

**Actionable answers:** each reply has a short answer plus up to 3 **action buttons**, chosen from an allowlist the server validates. Examples:
- Open the scam assistant (with the chip pre-selected)
- Send a report to the newsroom (pre-filled category and summary)
- Read "If you're arrested"
- Track a report sent to the newsroom
- Watch live / See tonight's guide / Open episode X
- Find your state command (pre-selected state)
- How to complain about an officer
- Call 112 (a `tel:` link) / Call FRSC 122

**Behaviour rules:**
- Emergency first: always lead with "Call 112 now" and a call button, then help.
- Answer only from platform content and general safety knowledge; say "I'm not sure" rather than invent.
- Never give legal advice for a specific case; it explains rights and points to the Legal Aid Council or a lawyer.
- Never claim to be the police, to have sent help, or that NPFTV will act on, forward or escalate anything. NPFTV informs; it points to who can act. Never collect PINs or passwords.
- Short replies (2 to 5 sentences), in the user's language.
- On Stream, it also understands "what's on now", "when is Cyber Sense", "catch me up".

**AI:** `assistant` (multi-turn, history capped; returns `{ reply, actions[], isEmergency, followUps[] }`; actions validated against the allowlist, and invalid ones dropped). The scripted fallback is intent matching across the same content, with the same action buttons.

**Accessibility:** focus trap in the sheet, Esc to close, `aria-live` replies, readable at 200% zoom.

**Acceptance:** a test set of about 40 questions (scams, rights, reporting, missing persons, programmes, the schedule, Pidgin and Hausa questions, emergencies, out-of-scope requests, attempts to make it break the rules) returns a correct, safe answer with at least one valid action. Emergency phrasing always shows 112 first.

### Phase 7: Control Room integration, roles and the demo script (size: M)

- **Sidebar:** a new "Citizen reporting" group with Reports and Notices (with count badges), shown to the News Editor, Editor-in-Chief, PIO, Network Director and Super Administrator.
- **Roles:** the newsroom (News Editor, Editor-in-Chief) owns citizen reports; the Public Information Officer owns notices and alerts. No new roles are needed.
- **Approvals:** the inbox also shows notices and report-based alerts waiting for approval.
- **Network Director overview:** a "Citizen reporting today" card (reports received, verified, published; notices live), and the daily brief can mention a significant cluster.
- **Audit log:** new action types, with filters for "Citizen services".
- **Presenter panel:** a "Seed a flood cluster in Lokoja" button and "Reset citizen services", plus the new optional demo steps in the script list.
- **Documentation:** update `docs/demo-plan.md` (the new screens and the optional steps 9 to 11), `docs/mock-data.md` (reports, notices), `docs/ai-features.md` (the new features), `docs/design-system.md` (the light Stream and the white footer), and `CLAUDE.md`.

### Phase 8: Quality, AI evaluation and launch (size: M)

- **Automated end-to-end tests:** the existing demo script, plus a script per new flow (report, complaint helper, notice, scam chat, assistant), run in both live (mock) and scripted modes.
- **AI evaluation with the real key:** `scripts/test-ai.mjs` grows into an evaluation set of about 80 prompts across all features, with pass rules. That includes safety cases (emergency, self-harm, an officer threatening someone, someone typing a PIN, prompt-injection attempts, abusive reports) and Nigerian-language prompts. Prompts are fixed until the set passes, then latency and cost per conversation are recorded.
- **Accessibility pass:** keyboard-only run-through, screen reader spot check, contrast audit of every new light surface.
- **Performance on a slow 3G profile** for the homepage, report form and assistant.
- **Content review list for the client:** every legal statement and agency description, the helpline numbers to confirm, and the translated strings to check.
- **Deploy to Vercel:** the environment variable, a smoke test on the live URL, then a full rehearsal.

## 7. Technical design

**New data** (`data/`, typed like today):
- `rights.ts`: topics with in-short, can, cannot, what to do and sources; investigation steps; complaint channels
- `agencies.ts`: the responder table
- `lgas.ts`: LGAs for the demo states
- `notices.ts`: fictional missing and wanted persons
- `reports.ts`: seed citizen reports

**Store additions** (`lib/store.tsx`, version bumped to 3):
- `reports`, `notices`, `chat` (assistant history per tab, in sessionStorage, not shared). No complaints or tips are stored: NPFTV does not take them.
- Actions: `submitReport`, `updateReport`, `clusterOf`, `createNotice`, `publishNotice`, `markFound`
- Each action writes to the audit log, and everything syncs across tabs as today.

**New shared components:**
- `ChatSheet` and `ChatMessage`, used by the assistant and the scam assistant
- `QuickReplies`, `RiskCard`, `ActionButtons`, `StepTimeline`
- `CanCannot` (the two-column panel), `ReferenceCard`, `StatusTimeline`, `PersonCard` (silhouette), `EmergencyStrip`, `LocationPicker` (state, LGA, landmark), `TaskCard`

**AI features** (`lib/server/features.ts`):
- New: `scam-chat`, `report-intake`, `report-triage`, `complaint-helper`, `assistant`.
- They follow the same pattern as today: fixed prompts, strict schemas, output checks, scripted fallbacks.
- Multi-turn features accept a bounded history: at most 8 turns and 4,000 characters, user and assistant roles only. The server rebuilds the prompt; the client never sends instructions.
- Rate limits per IP stay. The assistant gets its own lower limit (e.g. 20 messages per 10 minutes).

**Routing:**
- `/public-safety*` permanently redirects to `/safety*` (`next.config.ts` redirects).
- Old guide URLs keep working.

## 8. Risks and how we handle them

| Risk | Mitigation |
|---|---|
| Citizens assume NPFTV will act on what they send (like the police would) | Every form, chat and confirmation says plainly that NPFTV is the police's media service and can't send help, open a case or handle complaints; 112 and the right agency always come first; reports are framed as "to the newsroom, for public awareness" |
| Legal statements are wrong or overstated | Cite sources; only confident section numbers; "To be reviewed by NPF Legal" label; a client review list in Phase 8 |
| Invented helpline numbers mislead people | No numbers except 112 and FRSC 122 until NPFTV supplies verified ones |
| Wanted-person pages harm someone real | All fictional; silhouettes only; presumption-of-innocence notice; approval needed to publish |
| The chatbot gives unsafe or invented advice | Grounded content, strict schemas, an action allowlist, emergency-first rule, an evaluation set with safety cases, scripted fallback, the presenter's Scripted switch |
| Victim-blaming tone in scam chat | Tone rules in the prompt, a tone review in evaluation, empathetic scripted copy |
| Abuse or false reports | Rate limit, AI abuse flag, staff verification before anything becomes public |
| Personal data | Optional contact details, an anonymous option, an NDPA note, masking in the Control Room, nothing leaves the browser in the demo except AI calls (no contact details are sent to the AI) |
| Scope creep slows the demo | Phased delivery; the demo script must pass at the end of every phase |
| Lighter Stream loses its identity | Keep the dark theatre band, the yellow accent and the TV graphics; only the surrounding page changes |
| AI cost | gpt-5-mini, small outputs, per-IP and daily limits, an OpenAI spending cap |

## 9. Questions for NPFTV (non-blocking; we build on the assumption shown)

| Question | Working assumption |
|---|---|
| Verified numbers for the Complaint Response Unit, NPF-NC3, and state commands? | "To be confirmed" placeholders |
| Can the demo show the CRU and X-Squad by name? | Name the CRU; describe others generically |
| Who reviews the rights content? | NPF Legal; we prepare a review list |
| Should wanted-person notices appear at all in a public demo? | Yes, fictional, with the safeguards above; easy to switch off |
| Which state to use for the flood scenario? | Kogi (Lokoja), a known flood area |

## 10. Order and approval

Suggested order: **1 → 2 → 3 → 4 → 5 → 6 → 7 → 8.** Phase 1 is quick and visible. Phases 2 and 3 are mostly content, which feeds the chatbot. Phases 4 and 5 are the new citizen flows. The assistant (Phase 6) comes last, so it can use all the content and actions built before it.

I stop after each phase for a review.
