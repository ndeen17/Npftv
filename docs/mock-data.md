# Mock data

Everything is fictional demo data. Keep the figures below **exactly** as written: the designs, the AI fallbacks and the demo script all depend on them agreeing. Generate the rest (about 40 articles, 60 staff, 120 assets, a week of schedule) in the same style.

## Demo clock

- Default: **pinned to Monday 23 November 2026, 19:12 WAT** (The Beat is live, 18 minutes left).
- The presenter panel can unpin it (follow real WAT) or set another time. All "now", "live", "up next", progress bars and the EPG now-line read from this clock.
- Channel hours: 06:00 to 23:00 WAT. Outside them, show the off-air holding screen with "NPFTV returns at 06:00".

## Entities

`Programme`, `Episode`, `ScheduleSlot`, `LiveEvent`, `Article` (with `status`: draft, submitted, returned, approved, scheduled, published, withdrawn), `Category`, `StateCommand`, `Submission`, `Alert`, `Guide`, `MediaAsset`, `SocialPost`, `StaffMember` (with `role`, optional police `rank`), `Role`, `Asset` (camera kit, drone, OB van, vehicle, studio), `Booking`, `ProductionEvent`, `BudgetLine`, `ProcurementRequest`, `Sponsorship`, `ApprovalItem`, `AuditEntry`, `CaptionCue`, `AiFallback`.

Relationships avoid duplicates: one `Episode` is shown on both the website and Stream; one `ProductionEvent` links to its `ScheduleSlot`, `Booking`s, crew and `BudgetLine`.

## Programmes (7)

| Programme | Strand | Canonical schedule |
|---|---|---|
| The Beat | National news | Weeknights 19:00 to 19:30, **live**. Late edition 21:00 to 22:00 |
| Safe Nigeria | Citizen education | Saturdays 17:00 |
| Community Watch | Community policing | Sundays 16:00; repeat Mondays 20:00 |
| The Force in Focus | Documentary | Monthly premiere; repeats weekdays 18:00 |
| Cyber Sense | Digital safety | Mondays and Wednesdays 19:30 |
| In Conversation | Interviews | Mondays and Fridays 20:30 |
| The Insight Podcast | Podcast | Weekly, on demand |

**Monday evening guide:** 18:00 The Force in Focus (repeat: policing history, part 2) · 19:00 The Beat (live) · 19:30 Cyber Sense (spotting fake loan apps) · 20:00 Community Watch (repeat of Sunday) · 20:30 In Conversation (policing the festive season) · 21:00 The Beat: late edition · 22:00 overnight replay.

## Upcoming broadcasts

| Date | Time (WAT) | Item | Notes |
|---|---|---|---|
| Thu 26 Nov | 11:00 to 12:00 | Press briefing from Force Headquarters, Abuja | Live event, TV and Stream. This is the item the Broadcast Manager schedules in demo step 6 |
| Sat 28 Nov | 17:00 | Safe Nigeria: travelling safely this festive season | Recorded Friday in Studio A |
| Tue 1 Dec | 20:00 | Premiere: The Force in Focus, inside the Air Wing | Documentary, 48 minutes |

## Website content

Homepage stories:
- Operations, 21 Nov 2026: "Bomb disposal unit completes advanced field certification" (photo: eod)
- International, 19 Nov 2026: "Formed police unit prepares for peacekeeping posting" (photo: parade)
- Public safety, 18 Nov 2026: "Five signs a text message is a scam" (typographic thumbnail)

Latest ticker **before** the demo: 19:05 "Festive season: commands step up night patrols on major highways"; 17:40 "Road safety: night-time travel advice for the festive season"; 15:10 "Cyber Sense at 7:30 pm: how to spot fake loan apps". After the Kano story is approved (step 5), it goes to the top of the ticker and into the news list.

Public safety guides: Protecting your home; Keeping your OTP safe; Night-time road travel; How to report a crime.
Prepared alert for the presenter panel: "Missing person notice, Lagos" (verified by Lagos command, expires in 7 days).

## Stream content

- Watching now: **12,480**. Last night's peak for The Beat: **31,200**.
- On-screen graphic: "THE BEAT | Festive season: commands step up highway patrols | Reporting from Abuja".
- Caption cue at 19:12: "…patrols will increase on major highways from next week, especially at night."
- Chapters / Catch me up (The Beat, tonight): 19:01 Festive season highway patrols · 19:05 Road safety: night-time travel advice · 19:09 Warning: fake loan apps · 19:11 Bomb disposal unit certified.
- Latest on demand: The Force in Focus, "Inside the bomb disposal unit" (48:10, 16 Nov) · The Beat, Sunday 22 Nov (29:40) · Safe Nigeria, "Fire safety in markets" (26:05, 21 Nov) · Community Watch, "Neighbourhood watch groups in Enugu" (27:30, 22 Nov) · The Insight Podcast, "Police and the people" (41:12, 20 Nov).

## Staff (fictional)

| Name | Role |
|---|---|
| Amina Bello | Editor-in-Chief |
| Musa Ibrahim | Kano correspondent (Reporter) |
| Funke Adeyemi | News Editor |
| Chinedu Okafor | Broadcast Manager |
| Tunde Bakare | Programme Manager |
| Halima Yusuf | Media Manager |
| Ngozi Eze | Public Information Officer |
| (no name) | Network Director: shown by title only |

Real NPF leaders appear by title only: the Inspector-General, the Commissioner of Police (Kano), the Network Director.

## ERP figures

**KPIs:** Watching live now 12,480 (18% more than last Monday) · Stream uptime, November 99.6% (2 short outages, both under 4 minutes) · Q4 budget used ₦184.2m of ₦270m (68%) · Waiting for approval: 9 (3 are purchases over ₦5m).

**Q4 budget by department**

| Department | Used | Budget | % |
|---|---|---|---|
| Broadcast operations | ₦61m | ₦80m | 76% |
| News | ₦52m | ₦70m | 74% |
| Programmes | ₦38m | ₦60m | 63% |
| Digital | ₦21m | ₦35m | 60% (₦14m left) |
| Administration | ₦12.2m | ₦25m | 49% |
| **Total** | **₦184.2m** | **₦270m** | **68%** |

Five weeks left in the quarter; no department is over 80%.

**Production this week**
- Thu 26: Press briefing, live from Force Headquarters, 11:00 to 12:00. Crew 4, OB Van 1, camera kits 3 and 7. Estimated cost ₦1.85m (broadcast operations).
- Sat 28: Safe Nigeria festive travel special. Recorded Friday in Studio A. Crew 6.
- Tue 1 Dec: Premiere, The Force in Focus: Air Wing. Final edit due Friday. Drone 2 unavailable, so archive aerial footage is used.

**Assets:** OB Van 1 booked Thursday · OB Van 2 available · Camera kits 14 of 18 available · Drones 2 of 3 (Drone 2 in repair until 30 November) · Vehicles 6 of 9 out today. OB Van 1 in November: used on 11 days (7 live events, 4 recorded shoots).

**Approvals waiting for the Network Director (9)**
1. Two broadcast cameras, ₦7.4m (procurement, requested by Engineering)
2. Missing person notice, Lagos (public safety alert)
3. Sponsored road safety segment, ₦12m income, 8 weeks on Safe Nigeria
4. Leave: field producer, 1 to 5 December
5. OB Van 2 tyres and servicing, ₦6.2m (procurement)
6. Studio B lighting upgrade, ₦9.8m (procurement)
7. Overtime: Thursday press briefing crew
8. Travel: Air Wing shoot in Kaduna, ₦0.9m
9. Partnership agreement with a road safety charity (sponsorship)

**Daily brief (18:00):** The Beat had its biggest audience this month last night, peaking at 31,200, led by the festive travel story · Thursday's press briefing is fully staffed: 4 crew, OB Van 1 and camera kits 3 and 7, estimated ₦1.85m, inside the broadcast operations budget · Drone 2 is in repair until 30 November, so the Air Wing premiere will use archive aerial footage · Programmes has used 63% of its quarter budget with five weeks left, so it's on track.

**Correspondent network, stories in November: 412 from 37 desks**

| Tier (map shade) | Desks and counts |
|---|---|
| 20+ (darkest) | Lagos 34, FCT 31, Kaduna 27, Rivers 26 |
| 10 to 19 | Kano 19 (highlighted: today's top submission), Oyo 13, Katsina 13, Borno 12, Sokoto 12, Plateau 12, Ogun 12, Delta 12, Bauchi 11, Benue 11, Edo 11, Enugu 11, Anambra 11 |
| 6 to 9 | Niger 9, Jigawa 8, Gombe 8, Kwara 8, Nasarawa 8, Ondo 8, Akwa Ibom 8, Zamfara 7, Kebbi 7, Adamawa 7, Osun 7, Kogi 7, Cross River 7, Abia 7, Imo 6, Bayelsa 6 |
| 5 or fewer (lightest) | Ebonyi 5, Taraba 4, Ekiti 4, Yobe 3 |

The tile-map layout (column, row) is in `design/src/erp.html`.

## Design consistency

The v3 design file matches this document (schedule times, ticker, chapters and on-demand titles were aligned). If they ever disagree, this document wins.
