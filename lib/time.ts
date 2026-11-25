// All times in the demo are West Africa Time (UTC+1, no daylight saving).

export const WAT_OFFSET_MS = 60 * 60 * 1000;

/** Default demo clock: Monday 23 November 2026, 19:12 WAT. */
export const DEFAULT_CLOCK_ISO = "2026-11-23T18:12:00.000Z";

export interface WatParts {
  date: string; // YYYY-MM-DD
  minutes: number; // minutes since 00:00 WAT
  hhmm: string;
  weekday: number; // 0 = Sunday
}

export function watParts(d: Date): WatParts {
  const w = new Date(d.getTime() + WAT_OFFSET_MS);
  const y = w.getUTCFullYear();
  const m = String(w.getUTCMonth() + 1).padStart(2, "0");
  const day = String(w.getUTCDate()).padStart(2, "0");
  const minutes = w.getUTCHours() * 60 + w.getUTCMinutes();
  return { date: `${y}-${m}-${day}`, minutes, hhmm: toHHMM(minutes), weekday: w.getUTCDay() };
}

export function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function toHHMM(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Build a UTC Date from a WAT date and HH:MM. */
export function fromWat(date: string, hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const [Y, M, D] = date.split("-").map(Number);
  return new Date(Date.UTC(Y, M - 1, D, h, m) - WAT_OFFSET_MS);
}

export function addDays(date: string, n: number): string {
  const [Y, M, D] = date.split("-").map(Number);
  const d = new Date(Date.UTC(Y, M - 1, D + n));
  return d.toISOString().slice(0, 10);
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ymd(date: string) {
  const [Y, M, D] = date.split("-").map(Number);
  const wd = new Date(Date.UTC(Y, M - 1, D)).getUTCDay();
  return { Y, M, D, wd };
}

export const fmt = {
  /** "Monday 23 November 2026" */
  long(date: string) {
    const { Y, M, D, wd } = ymd(date);
    return `${DAYS[wd]} ${D} ${MONTHS[M - 1]} ${Y}`;
  },
  /** "21 November 2026" */
  dayMonthYear(date: string) {
    const { Y, M, D } = ymd(date);
    return `${D} ${MONTHS[M - 1]} ${Y}`;
  },
  /** "16 Nov" */
  dayMonShort(date: string) {
    const { M, D } = ymd(date);
    return `${D} ${MONTHS_SHORT[M - 1]}`;
  },
  /** "Mon 23" */
  dayTab(date: string) {
    const { D, wd } = ymd(date);
    return `${DAYS_SHORT[wd]} ${D}`;
  },
  weekday(date: string) {
    return DAYS[ymd(date).wd];
  },
  weekdayShort(date: string) {
    return DAYS_SHORT[ymd(date).wd];
  },
  monShort(date: string) {
    return MONTHS_SHORT[ymd(date).M - 1];
  },
  dayNum(date: string) {
    return String(ymd(date).D).padStart(2, "0");
  },
  /** "7:30 pm" */
  twelve(hhmm: string) {
    const m = toMin(hhmm);
    const h = Math.floor(m / 60);
    const mm = m % 60;
    const suffix = h >= 12 ? "pm" : "am";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return mm ? `${h12}:${String(mm).padStart(2, "0")} ${suffix}` : `${h12}:00 ${suffix}`;
  },
};

export function isoDate(iso: string) {
  return watParts(new Date(iso)).date;
}

export function isoTime(iso: string) {
  return watParts(new Date(iso)).hhmm;
}
