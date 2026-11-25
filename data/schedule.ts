import type { ScheduleSlot } from "@/lib/types";
import { addDays, toMin } from "@/lib/time";

export const WEEK_START = "2026-11-23"; // Monday
export const GUIDE_DAYS = 9; // Mon 23 Nov to Tue 1 Dec
export const CHANNEL_OPEN = "06:00";
export const CHANNEL_CLOSE = "23:00";

type Row = [start: string, end: string, title: string, subtitle: string, extra?: Partial<ScheduleSlot>];

function weekdayDay(date: string, wd: number): Row[] {
  // wd: 1 Mon .. 5 Fri
  const evening: Row[] = [
    ["18:00", "19:00", "The Force in Focus", wd === 1 ? "Policing history, part 2" : "Repeat: inside the bomb disposal unit", { programmeId: "force-in-focus" }],
    ["19:00", "19:30", "The Beat", "Live", { programmeId: "the-beat", live: true }],
  ];
  if (wd === 1 || wd === 3) {
    evening.push(["19:30", "20:00", "Cyber Sense", wd === 1 ? "Spotting fake loan apps" : "Your OTP is yours alone", { programmeId: "cyber-sense" }]);
  } else {
    evening.push(["19:30", "20:00", "Safe Nigeria: quick guides", "Short safety films", { programmeId: "safe-nigeria" }]);
  }
  if (wd === 1) {
    evening.push(["20:00", "20:30", "Community Watch", "Repeat of Sunday's edition", { programmeId: "community-watch" }]);
  } else {
    evening.push(["20:00", "20:30", "Command reports", "News from the state commands"]);
  }
  if (wd === 1 || wd === 5) {
    evening.push(["20:30", "21:00", "In Conversation", wd === 1 ? "Policing the festive season" : "Life on the night shift", { programmeId: "in-conversation" }]);
  } else {
    evening.push(["20:30", "21:00", "Community Watch", "Repeat", { programmeId: "community-watch" }]);
  }
  evening.push(["21:00", "22:00", "The Beat: late edition", "News and the day in review", { programmeId: "the-beat" }]);
  evening.push(["22:00", "23:00", "Overnight replay", "Today's best"]);

  return [
    ["06:00", "08:00", "NPFTV Morning", "News, weather and road reports", { live: true }],
    ["08:00", "08:30", "Safe Nigeria", "Repeat", { programmeId: "safe-nigeria" }],
    ["08:30", "09:00", "The Beat", "Repeat of last night's edition", { programmeId: "the-beat" }],
    ["09:00", "12:00", "Daytime on NPFTV", "Features and public service announcements"],
    ["12:00", "12:30", "Midday bulletin", "News at noon", { live: true }],
    ["12:30", "15:00", "Afternoon replay", "Documentaries and features"],
    ["15:00", "15:30", "Cyber Sense", "Repeat", { programmeId: "cyber-sense" }],
    ["15:30", "16:00", "Community Watch", "Repeat", { programmeId: "community-watch" }],
    ["16:00", "18:00", "Afternoon features", "From the state commands"],
    ...evening,
  ];
}

function saturday(date: string): Row[] {
  return [
    ["06:00", "09:00", "Weekend Morning", "News and features"],
    ["09:00", "12:00", "The week on NPFTV", "Highlights from the week"],
    ["12:00", "12:30", "Midday bulletin", "News at noon", { live: true }],
    ["12:30", "17:00", "Saturday replay", "Documentaries and features"],
    [
      "17:00",
      "17:30",
      "Safe Nigeria",
      date === "2026-11-28" ? "Travelling safely this festive season" : "New episode",
      { programmeId: "safe-nigeria", location: "Studio A, Abuja" },
    ],
    ["17:30", "19:00", "The Force in Focus", "Repeat", { programmeId: "force-in-focus" }],
    ["19:00", "19:30", "The Beat: weekend edition", "National news", { programmeId: "the-beat" }],
    ["19:30", "21:00", "Saturday film", "Documentary"],
    ["21:00", "23:00", "Overnight replay", "The week's best"],
  ];
}

function sunday(): Row[] {
  return [
    ["06:00", "09:00", "Weekend Morning", "News and features"],
    ["09:00", "12:00", "The week on NPFTV", "Highlights from the week"],
    ["12:00", "16:00", "Sunday replay", "Documentaries and features"],
    ["16:00", "16:30", "Community Watch", "New episode", { programmeId: "community-watch" }],
    ["16:30", "19:00", "Afternoon features", "From the state commands"],
    ["19:00", "19:30", "The Beat: weekend edition", "National news", { programmeId: "the-beat" }],
    ["19:30", "20:30", "The Insight Podcast on TV", "This week's episode", { programmeId: "insight-podcast" }],
    ["20:30", "23:00", "Overnight replay", "The week's best"],
  ];
}

function dayRows(date: string, wd: number): Row[] {
  if (wd === 6) return saturday(date);
  if (wd === 0) return sunday();
  const rows = weekdayDay(date, wd);
  if (date === "2026-12-01") {
    // Tue 1 Dec premiere replaces the 20:00 to 21:00 block.
    return rows
      .filter((r) => toMin(r[0]) < toMin("20:00") || toMin(r[0]) >= toMin("21:00"))
      .concat([
        [
          "20:00",
          "21:00",
          "Premiere: The Force in Focus",
          "Inside the Air Wing (48 minutes)",
          { programmeId: "force-in-focus", event: true },
        ],
      ])
      .sort((a, b) => toMin(a[0]) - toMin(b[0]));
  }
  return rows;
}

export function buildSchedule(): ScheduleSlot[] {
  const out: ScheduleSlot[] = [];
  for (let i = 0; i < GUIDE_DAYS; i++) {
    const date = addDays(WEEK_START, i);
    const wd = (1 + i) % 7; // WEEK_START is a Monday
    for (const [start, end, title, subtitle, extra] of dayRows(date, wd)) {
      out.push({ id: `${date}-${start}`, date, start, end, title, subtitle, ...extra });
    }
  }
  return out;
}

/** The live event the Broadcast Manager schedules in step 6 of the demo. */
export const pressBriefingTemplate = {
  date: "2026-11-26",
  start: "11:00",
  end: "12:00",
  title: "Press briefing from Force Headquarters",
  subtitle: "Live from Abuja, on TV and Stream",
  location: "Force Headquarters, Abuja",
};

/** Insert a slot, trimming or splitting anything it overlaps. */
export function insertSlot(slots: ScheduleSlot[], slot: ScheduleSlot): ScheduleSlot[] {
  const s = toMin(slot.start);
  const e = toMin(slot.end);
  const out: ScheduleSlot[] = [];
  for (const x of slots) {
    if (x.date !== slot.date) {
      out.push(x);
      continue;
    }
    const xs = toMin(x.start);
    const xe = toMin(x.end);
    if (xe <= s || xs >= e) {
      out.push(x);
      continue;
    }
    if (xs < s) out.push({ ...x, id: `${x.id}-a`, end: slot.start });
    if (xe > e) out.push({ ...x, id: `${x.id}-b`, start: slot.end });
  }
  out.push(slot);
  return out.sort((a, b) => (a.date === b.date ? toMin(a.start) - toMin(b.start) : a.date < b.date ? -1 : 1));
}
