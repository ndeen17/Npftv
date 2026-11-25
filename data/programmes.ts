import type { Episode, Programme } from "@/lib/types";

export const programmes: Programme[] = [
  {
    id: "the-beat",
    title: "The Beat",
    strand: "National news",
    scheduleText: "Weeknights, 7:00 pm",
    short: "National news at seven",
    description:
      "NPFTV's flagship news programme, live every weeknight from Abuja. The day's verified police news from all 36 states and the FCT, with public safety advice you can use tonight. A late edition follows at 9:00 pm.",
    poster: "a1",
  },
  {
    id: "safe-nigeria",
    title: "Safe Nigeria",
    strand: "Citizen education",
    scheduleText: "Saturdays, 5:00 pm",
    short: "Practical safety for every household",
    description:
      "A weekly half hour of practical safety advice: on the road, at home, online and at the market. Each edition answers questions sent in by viewers.",
    poster: "a2",
  },
  {
    id: "community-watch",
    title: "Community Watch",
    strand: "Community policing",
    scheduleText: "Sundays, 4:00 pm",
    short: "Police and residents, working together",
    description:
      "Stories of community policing from neighbourhoods across Nigeria: watch groups, safety forums and the officers who work alongside them. Repeated on Mondays at 8:00 pm.",
    poster: "a3",
  },
  {
    id: "force-in-focus",
    title: "The Force in Focus",
    strand: "Documentary",
    scheduleText: "Monthly premiere",
    short: "Inside the units that keep Nigeria safe",
    description:
      "Long-form documentaries from inside the Nigeria Police Force: specialist units, training and history. A new film premieres each month, with repeats on weekdays at 6:00 pm.",
    poster: "a4",
  },
  {
    id: "cyber-sense",
    title: "Cyber Sense",
    strand: "Digital safety",
    scheduleText: "Mondays and Wednesdays, 7:30 pm",
    short: "Staying safe online",
    description:
      "Scams, fake loan apps, account takeovers and how to protect yourself. Short, clear episodes with the Cybercrime desk's latest warnings.",
    poster: "a5",
  },
  {
    id: "in-conversation",
    title: "In Conversation",
    strand: "Interviews",
    scheduleText: "Mondays and Fridays, 8:30 pm",
    short: "Long-form interviews on policing",
    description:
      "Half-hour conversations with officers, community leaders and experts about how Nigeria is policed and how it could be policed better.",
    poster: "a6",
  },
  {
    id: "insight-podcast",
    title: "The Insight Podcast",
    strand: "Podcast",
    scheduleText: "Weekly, on demand",
    short: "Policing, explained",
    description:
      "A weekly podcast that takes one question about policing in Nigeria and answers it properly. New episodes every Friday on NPFTV Stream.",
    poster: "a3",
  },
];

export const programmeById = (id: string) => programmes.find((p) => p.id === id);

/** Pre-written caption cues for tonight's The Beat (WebVTT-style, minute resolution). */
export const captionCues: { time: string; text: string }[] = [
  { time: "19:00", text: "Good evening, and welcome to The Beat, live from Abuja." },
  { time: "19:01", text: "Our top story: commands will step up night patrols on major highways for the festive season." },
  { time: "19:02", text: "Extra patrols are planned on the busiest interstate routes from next week." },
  { time: "19:03", text: "Motorists are asked to carry their documents and to co-operate at checkpoints." },
  { time: "19:04", text: "Commands say patrol teams will be visible and identifiable at all times." },
  { time: "19:05", text: "Now, road safety: advice for anyone travelling at night this festive season." },
  { time: "19:06", text: "Plan your route, share it with someone you trust, and avoid unofficial stops." },
  { time: "19:07", text: "If your vehicle breaks down, stay in a lit place and call for help." },
  { time: "19:08", text: "Rest before long journeys. Tiredness causes many night-time crashes." },
  { time: "19:09", text: "A warning tonight about loan apps that demand access to your phone contacts." },
  { time: "19:10", text: "Some of these apps threaten to message your family and friends if you fall behind." },
  { time: "19:11", text: "And the bomb disposal unit has completed its advanced field certification." },
  { time: "19:12", text: "…patrols will increase on major highways from next week, especially at night." },
  { time: "19:13", text: "We'll have more on that story in our late edition at nine." },
  { time: "19:15", text: "Turning now to news from the state commands." },
  { time: "19:20", text: "In Enugu, neighbourhood watch groups have met with divisional officers." },
  { time: "19:25", text: "Still to come: the weather for travellers, and tonight's Cyber Sense preview." },
  { time: "19:29", text: "That's The Beat for this evening. Cyber Sense is next." },
];

export const tonightChapters = [
  { time: "19:01", title: "Festive season highway patrols" },
  { time: "19:05", title: "Road safety: night-time travel advice" },
  { time: "19:09", title: "Warning: fake loan apps" },
  { time: "19:11", title: "Bomb disposal unit certified" },
];

export const episodes: Episode[] = [
  {
    id: "ff-bomb-disposal",
    programmeId: "force-in-focus",
    title: "Inside the bomb disposal unit",
    date: "2026-11-16",
    duration: "48:10",
    summary:
      "Six weeks with the officers who train to make explosive devices safe: the equipment, the drills and the patience the job demands.",
    thumb: "eod",
    progress: 0.65,
    chapters: [
      { time: "00:00", title: "Introduction" },
      { time: "04:20", title: "The 35 kg suit" },
      { time: "15:45", title: "Detection drills" },
      { time: "29:10", title: "Community evacuation exercise" },
      { time: "41:30", title: "Certification day" },
    ],
    catchUp: [
      { time: "04:20", text: "Officers explain the protective suit, which weighs about 35 kg, and how they train to work in it." },
      { time: "15:45", text: "Detection drills show how teams search an area slowly and methodically." },
      { time: "29:10", text: "A practice evacuation shows residents how to move safely away from a suspected device." },
    ],
  },
  {
    id: "beat-2026-11-22",
    programmeId: "the-beat",
    title: "Sunday 22 November",
    date: "2026-11-22",
    duration: "29:40",
    summary: "The weekend's police news, festive season preparations and a round-up from the state commands.",
    chapters: [
      { time: "00:00", title: "Headlines" },
      { time: "02:10", title: "Festive season preparations" },
      { time: "11:30", title: "State commands round-up" },
      { time: "22:05", title: "Public safety reminder" },
    ],
    catchUp: [
      { time: "02:10", text: "Commands are preparing extra patrols ahead of the festive season." },
      { time: "11:30", text: "Updates from Lagos, Kaduna and Rivers commands." },
      { time: "22:05", text: "A reminder that no officer will ever ask for your OTP." },
    ],
  },
  {
    id: "sn-fire-markets",
    programmeId: "safe-nigeria",
    title: "Fire safety in markets",
    date: "2026-11-21",
    duration: "26:05",
    summary: "How traders and market associations can prevent fires, and what to do if one starts.",
    chapters: [
      { time: "00:00", title: "Why market fires spread" },
      { time: "08:40", title: "Wiring and generators" },
      { time: "17:15", title: "If a fire starts" },
    ],
    catchUp: [
      { time: "00:00", text: "Crowded stalls and shared wiring help fires spread quickly in markets." },
      { time: "08:40", text: "Generators should be kept outside stalls and switched off at closing." },
      { time: "17:15", text: "Raise the alarm, get people out, then call the fire service." },
    ],
  },
  {
    id: "cw-enugu",
    programmeId: "community-watch",
    title: "Neighbourhood watch groups in Enugu",
    date: "2026-11-22",
    duration: "27:30",
    summary: "Residents' groups in Enugu explain how they work with their divisional police officers.",
    chapters: [
      { time: "00:00", title: "Meet the groups" },
      { time: "09:20", title: "Working with the division" },
      { time: "19:50", title: "What changed" },
    ],
    catchUp: [
      { time: "00:00", text: "Three Enugu neighbourhoods describe how their watch groups started." },
      { time: "09:20", text: "Monthly meetings with divisional officers set shared priorities." },
      { time: "19:50", text: "Residents say reporting has become quicker and simpler." },
    ],
  },
  {
    id: "insight-police-people",
    programmeId: "insight-podcast",
    title: "Police and the people",
    date: "2026-11-20",
    duration: "41:12",
    summary: "What does trust between police and public look like, and how is it built? A conversation with community leaders.",
    chapters: [
      { time: "00:00", title: "The question" },
      { time: "12:30", title: "Listening first" },
      { time: "28:00", title: "What residents want" },
    ],
    catchUp: [
      { time: "00:00", text: "This week's question: how is trust between police and public built?" },
      { time: "12:30", text: "Guests describe forums where officers listen before they speak." },
      { time: "28:00", text: "Residents ask for quicker responses and clearer updates." },
    ],
  },
  {
    id: "cs-loan-apps",
    programmeId: "cyber-sense",
    title: "Spotting fake loan apps",
    date: "2026-11-18",
    duration: "24:30",
    summary: "How fake loan apps work, the permissions they ask for, and how to report them.",
    chapters: [
      { time: "00:00", title: "How they hook you" },
      { time: "07:15", title: "Permissions to refuse" },
      { time: "16:40", title: "If you're being threatened" },
    ],
    catchUp: [
      { time: "00:00", text: "Fake loan apps promise instant cash with no checks." },
      { time: "07:15", text: "Refuse access to your contacts, photos and messages." },
      { time: "16:40", text: "Keep evidence of threats and report them at your nearest station." },
    ],
  },
  {
    id: "ic-festive",
    programmeId: "in-conversation",
    title: "Policing the festive season",
    date: "2026-11-20",
    duration: "28:45",
    summary: "A senior traffic officer explains how the festive season is planned, from patrol rosters to motor park visits.",
    chapters: [
      { time: "00:00", title: "Planning starts in October" },
      { time: "10:10", title: "Motor parks" },
      { time: "20:30", title: "What drivers can do" },
    ],
    catchUp: [
      { time: "00:00", text: "Festive season planning starts weeks ahead." },
      { time: "10:10", text: "Teams visit motor parks to check vehicles and brief drivers." },
      { time: "20:30", text: "Drivers are asked to rest, avoid overloading and travel by day where possible." },
    ],
  },
  {
    id: "ff-policing-history-2",
    programmeId: "force-in-focus",
    title: "Policing history, part 2",
    date: "2026-11-02",
    duration: "52:00",
    summary: "The second part of our history of policing in Nigeria, from independence to the 1990s.",
    thumb: "parade",
    chapters: [
      { time: "00:00", title: "Independence" },
      { time: "18:00", title: "A national force" },
      { time: "36:20", title: "New units" },
    ],
    catchUp: [
      { time: "00:00", text: "Policing at independence and the changes that followed." },
      { time: "18:00", text: "How a single national force was organised." },
      { time: "36:20", text: "The specialist units created in later decades." },
    ],
  },
  {
    id: "sn-home-security",
    programmeId: "safe-nigeria",
    title: "Securing your home for the holidays",
    date: "2026-11-14",
    duration: "25:50",
    summary: "Simple steps to keep your home safe while you travel: locks, lighting and neighbours.",
    chapters: [
      { time: "00:00", title: "Before you leave" },
      { time: "09:30", title: "Lights and locks" },
      { time: "18:10", title: "Ask a neighbour" },
    ],
    catchUp: [
      { time: "00:00", text: "Don't announce your travel plans on social media." },
      { time: "09:30", text: "Check locks and use timer lights if you can." },
      { time: "18:10", text: "Ask a trusted neighbour to keep an eye on the house." },
    ],
  },
  {
    id: "cw-lagos-forums",
    programmeId: "community-watch",
    title: "Safety forums in Lagos markets",
    date: "2026-11-15",
    duration: "26:20",
    summary: "Traders and officers meet weekly in three Lagos markets.",
    thumb: "parade",
    chapters: [
      { time: "00:00", title: "Market mornings" },
      { time: "12:00", title: "Traders speak" },
    ],
    catchUp: [
      { time: "00:00", text: "Weekly forums bring traders and officers together." },
      { time: "12:00", text: "Traders say theft reports are handled faster." },
    ],
  },
  {
    id: "insight-reporting",
    programmeId: "insight-podcast",
    title: "What happens after you report a crime?",
    date: "2026-11-13",
    duration: "38:05",
    summary: "From the counter at the station to the investigating officer: the steps after a report, explained.",
    chapters: [
      { time: "00:00", title: "At the counter" },
      { time: "14:20", title: "Your statement" },
      { time: "27:40", title: "Follow-up" },
    ],
    catchUp: [
      { time: "00:00", text: "Reports are recorded at the station counter." },
      { time: "14:20", text: "Your statement is taken and you are given a reference." },
      { time: "27:40", text: "Use the reference to follow up on your case." },
    ],
  },
  {
    id: "cs-otp",
    programmeId: "cyber-sense",
    title: "Your OTP is yours alone",
    date: "2026-11-11",
    duration: "22:15",
    summary: "Why no bank, telecoms company or police officer will ever ask for your one-time password.",
    chapters: [
      { time: "00:00", title: "What an OTP does" },
      { time: "08:05", title: "The scripts scammers use" },
    ],
    catchUp: [
      { time: "00:00", text: "An OTP approves a payment or a login. Whoever has it controls your account." },
      { time: "08:05", text: "Scammers pose as banks and officers. Hang up and call your bank." },
    ],
  },
];

export const episodeById = (id: string) => episodes.find((e) => e.id === id);

/** The five items in the design's "Latest on demand" rail, in order. */
export const latestOnDemandIds = ["ff-bomb-disposal", "beat-2026-11-22", "sn-fire-markets", "cw-enugu", "insight-police-people"];
