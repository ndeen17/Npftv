# AI features (OpenAI)

**Rule: AI drafts, people approve.** AI output is never published without passing through the editorial workflow, and every AI surface is labelled with a ✦ spark icon.

## Architecture

```
browser  --POST /api/ai { feature, input }-->  Next.js route (server)  --OpenAI SDK-->  OpenAI
                                              - holds OPENAI_API_KEY
                                              - fixed system prompt per feature
                                              - input length caps, rate limit
                                              - JSON schema per feature
```

- **One route:** `app/api/ai/route.ts`. The client sends a **feature id** and its input. The server picks the system prompt and output schema for that feature. **Never accept a system prompt or model name from the client.**
- Use the official `openai` npm package. Use **structured outputs (JSON schema)** for every feature that renders UI, so the components get typed data.
- Model from `OPENAI_MODEL` (choose a current fast, low-cost model from OpenAI's docs). Keep `max_output_tokens` small per feature.
- **Cost and abuse protection** (the demo will be seen widely): set a **monthly spending cap on the OpenAI project** (the real safety net), cap input length per feature, keep a simple per-IP rate limit in memory, and expose `AI_DAILY_REQUEST_LIMIT`.
- **Scripted fallback:** every feature has canned answers in `data/ai-fallbacks.json` for the exact demo inputs (the BVN SMS, the Kano story, the Director's question chips). The client uses them when the presenter turns on "Scripted AI", when the route returns an error, or after a 6-second timeout. The UI looks the same either way.
- Show a short "Checking…" state with a skeleton, never a blank panel.

## Public features

| Feature id | Where | Input | Output |
|---|---|---|---|
| `scam-check` | Public Safety, quick action | Pasted message (max 1,000 chars) | `{ verdict: "very_likely_scam" \| "possibly_scam" \| "no_obvious_signs", signs: string[], whatToDo: string }` |
| `ask-npftv` | Stream and Public Safety assistant | Question + the public safety guides from mock data as context | `{ answer, sources: guideIds[], isEmergency: boolean }` |
| `search` | Site search | Plain-language query + a compact index of titles/summaries | `{ results: itemIds[] }`, rendered from mock data |
| `catch-me-up` | Stream live page, episode page | Caption cues so far (from mock data) | `{ bullets: [{ time, text }] }`, 3 items |
| `chapters` | Stream live page | Caption cues | `{ chapters: [{ time, title }] }` (pre-computed in mock data is fine) |
| `translate` | Article page language switch, CMS | Text + target language (Hausa, Pidgin, Yoruba, Igbo) | `{ text }`, always labelled "AI draft, needs review" |
| `tts` | "Listen to this article" | Article text | Audio via OpenAI text-to-speech; cache per article |

Live captions on the looping clip are **pre-written WebVTT cues** in mock data (they can be generated once offline with OpenAI transcription if a real clip is used).

## Staff features (Control Room)

| Feature id | Where | Output |
|---|---|---|
| `copy-desk` | Story editor side panel | `{ summary, headlines: [{ text, note }], sensitivity: [{ kind, paragraph, quote, suggestion }], style: [{ find, replace }], seo: { title, description }, altText: string[], translation: { lang: "ha", headline } }` |
| `triage` | Submissions inbox | `{ category, state, urgency: "routine" \| "priority", possibleDuplicateOf?: id }` |
| `daily-brief` | Network Director overview | `{ bullets: [{ lead, text }] }`, 4 items, numbers only from the data snapshot |
| `ask-data` | Daily brief "Ask about the network" | `{ answer, figuresUsed: string[] }` from a JSON snapshot of ERP data |
| `crew-clash` | Production calendar | `{ clashes: [{ eventId, person/asset, suggestion }] }` |

## System prompt rules (all features)

- You work for NPFTV's demo platform. Use only the information provided in the input; do not invent facts, figures, names or quotes.
- Never present output as an official police statement.
- `ask-npftv` and `scam-check`: you are not an emergency service. If the user describes danger now, tell them to call **112** first. Do not give operational or tactical police information.
- `copy-desk` sensitivity checks must flag at least: the location or timing of an ongoing operation; names or identifying details of suspects not yet charged; names of victims or minors; unverified claims attributed to the police; personal data. House style: describe suspects ("a 34-year-old man"), don't name them.
- Translations: keep names, numbers and dates exact; output is a draft for human review. Official and sensitive messages always need a reviewed translation.
- `daily-brief` / `ask-data`: answer only from the snapshot; if the data doesn't contain the answer, say so.

## The demo inputs (must have fallbacks)

**Scam SMS:** "URGENT: Your BVN has been blocked. Verify now at bvn-update-ng.co or your account will be closed in 24hrs. Send the OTP you receive to confirm."
Expected: very likely a scam; signs: 24-hour deadline pressure, link not from your bank or the Central Bank, asks for your OTP (no bank or police officer will ever ask for it); what to do: don't reply or click, delete it, tell your bank.

**Kano story** (submitted by Musa Ibrahim, Kano correspondent, 16:40):
1. The Kano State Police Command has launched neighbourhood safety forums across all 44 local government areas, bringing residents, traditional leaders and divisional officers together every month.
2. Speaking at the launch in Nassarawa, the Commissioner of Police said the forums would help officers respond faster to concerns raised by communities.
3. Separately, officers have been been deployed to the Sabon Gari market axis, where a team is currently tracking a suspected kidnapping gang.
4. A suspect, Sani G., 34, was arrested on Friday and is assisting with enquiries.
5. Residents can find their nearest forum at their divisional police station.

Expected copy desk: summary; 2 sensitivity issues (para 3 reveals an active operation's location → remove the clause; para 4 names an uncharged suspect → "a 34-year-old man"); 1 style fix ("have been been" → "have been"); headlines: "Kano opens safety forums in all 44 local government areas" (recommended), "Residents and police to meet monthly under new Kano forums", and the reporter's original "Kano command launches neighbourhood safety forums in 44 LGAs"; Hausa headline draft: "Rundunar 'yan sandan Jihar Kano ta ƙaddamar da tarukan tsaron unguwanni a ƙananan hukumomi 44" (**must be checked by a Hausa speaker**). "Approve and publish" stays disabled until both sensitivity issues are resolved.

**Director question chips:** "How often was OB Van 1 used in November?", "Which states sent the fewest stories?", "What's left in the Digital budget?" (answers must match `docs/mock-data.md`).
