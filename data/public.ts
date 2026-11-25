import type { Alert, Guide, MediaItem, SocialPost } from "@/lib/types";

export const guides: Guide[] = [
  {
    id: "protecting-your-home",
    title: "Protecting your home",
    short: "Locks, lighting and neighbourhood watch",
    icon: "home",
    keywords: ["home", "house", "burglary", "break-in", "lock", "travel", "holiday", "neighbour", "theft"],
    steps: [
      "Check that doors and windows lock properly, and lock them every time you go out, even briefly.",
      "Keep outside areas lit at night. A light on a timer makes an empty house look occupied.",
      "Don't announce on social media that you are away. Post your holiday photos when you get back.",
      "Ask a trusted neighbour to keep an eye on your home and collect anything left at the gate.",
      "Join or start a neighbourhood watch group. Your divisional police station can put you in touch with others nearby.",
    ],
  },
  {
    id: "keeping-your-otp-safe",
    title: "Keeping your OTP safe",
    short: "Who can ask for it (nobody)",
    icon: "shield",
    keywords: ["otp", "pin", "bvn", "password", "bank", "scam", "fraud", "account", "code", "sms", "text", "loan", "app"],
    steps: [
      "Your one-time password (OTP) approves payments and logins. Whoever has it can take money from your account.",
      "No bank, telecoms company or police officer will ever ask for your OTP, PIN, password or BVN details.",
      "If someone asks, end the call or delete the message. Don't click links in unexpected messages.",
      "If you have already shared it, call your bank immediately on the number printed on your card and ask them to block the account.",
      "Report the number to your bank and to your nearest police station. Keep screenshots as evidence.",
    ],
  },
  {
    id: "night-time-road-travel",
    title: "Night-time road travel",
    short: "Plan, share your route, avoid stops",
    icon: "truck",
    keywords: ["road", "travel", "night", "drive", "driving", "journey", "highway", "checkpoint", "car", "bus", "festive", "trip"],
    steps: [
      "Travel by day where you can. If you must travel at night, plan your route before you set off.",
      "Share your route and expected arrival time with someone you trust.",
      "Fill your tank and check your tyres before the journey so you don't need to stop.",
      "Only stop at recognised checkpoints. Officers will be in uniform and identifiable.",
      "If your vehicle breaks down, move to a lit area if you can, stay with the vehicle and call for help.",
    ],
  },
  {
    id: "how-to-report-a-crime",
    title: "How to report a crime",
    short: "Your nearest station and what to bring",
    icon: "phone",
    keywords: ["report", "crime", "station", "complaint", "stolen", "robbery", "statement", "witness", "police"],
    steps: [
      "If anyone is in danger now, call 112 first. It is free on every network.",
      "For a crime that has already happened, go to your nearest divisional police station. Reporting is free.",
      "Bring any evidence you have: photos, screenshots, receipts, the names of witnesses.",
      "An officer will record your statement. Ask for a reference number before you leave.",
      "Use the reference number to follow up with the investigating officer.",
    ],
  },
];

export const guideById = (id: string) => guides.find((g) => g.id === id);

export const defaultAlert: Alert = {
  id: "alert-otp",
  title: "Public safety alert",
  body: "Police officers will never ask for your BVN, PIN or one-time password.",
  level: "info",
};

/** The prepared alert the presenter can push (also in the Network Director's approvals). */
export const preparedAlert: Alert = {
  id: "alert-missing-lagos",
  title: "Missing person notice, Lagos",
  body: "A 67-year-old man was last seen in Surulere, Lagos, on Sunday 22 November. If you have information, contact your nearest police station.",
  level: "urgent",
  state: "LA",
  verifiedBy: "Lagos State Police Command",
  expires: "in 7 days",
};

export const seedTicker = [
  { time: "19:05", text: "Festive season: commands step up night patrols on major highways", articleId: "highway-patrols" },
  { time: "17:40", text: "Road safety: night-time travel advice for the festive season", articleId: "night-travel-advice" },
  { time: "15:10", text: "Cyber Sense at 7:30 pm: how to spot fake loan apps", articleId: "cyber-sense-tonight" },
];

export const socialPosts: SocialPost[] = [
  {
    id: "yt-1",
    platform: "YouTube",
    ago: "2 hours ago",
    text: "Behind the scenes: how The Beat gets on air every weeknight.",
    media: "thumb",
    stats: ["3.2K views", "146 likes"],
  },
  {
    id: "x-1",
    platform: "X",
    ago: "4 hours ago",
    big: "Police officers will never ask for your OTP. If someone does, end the call.",
    text: "Share this with someone who needs it.",
    media: "big",
    stats: ["1.8K reposts", "412 replies"],
  },
  {
    id: "ig-1",
    platform: "Instagram",
    ago: "Yesterday",
    text: "Precision, patience and 35 kg of protective gear. Meet the bomb disposal unit.",
    media: "eod",
    stats: ["5.6K likes", "230 comments"],
  },
  {
    id: "fb-1",
    platform: "Facebook",
    ago: "Yesterday",
    text: "Tonight at 7: The Beat, live from Abuja. Watch on NPFTV Stream.",
    media: "emblem",
    stats: ["980 reactions", "64 shares"],
  },
];

export const mediaItems: MediaItem[] = [
  { id: "m1", title: "Bomb disposal unit, field certification", kind: "photo", img: "eod", date: "2026-11-21", rights: "Free to use with credit", size: "984 x 656" },
  { id: "m2", title: "Formed police unit on parade, Abuja", kind: "photo", img: "parade", date: "2026-11-19", rights: "Free to use with credit", size: "1080 x 718" },
  { id: "m3", title: "NPFTV emblem", kind: "photo", img: "emblem", date: "2026-01-10", rights: "Request permission", size: "1000 x 750" },
  { id: "m4", title: "NPFTV logo (web)", kind: "photo", img: "logo", date: "2026-01-10", rights: "Request permission", size: "200 x 200" },
  { id: "m5", title: "The Force in Focus: inside the bomb disposal unit (trailer)", kind: "video", img: "eod", date: "2026-11-14", rights: "Editorial use only", size: "1:32" },
  { id: "m6", title: "Peacekeeping contingent: pre-deployment training (b-roll)", kind: "video", img: "parade", date: "2026-11-19", rights: "Editorial use only", size: "3:05" },
  { id: "m7", title: "The Beat: festive season highway patrols (clip)", kind: "video", img: "parade", date: "2026-11-23", rights: "Editorial use only", size: "2:10" },
  { id: "m8", title: "Festive season travel advisory (PDF)", kind: "document", date: "2026-11-21", rights: "Free to use with credit", size: "PDF, 240 KB" },
  { id: "m9", title: "NPFTV press kit (PDF)", kind: "document", date: "2026-10-01", rights: "Free to use with credit", size: "PDF, 1.2 MB" },
  { id: "m10", title: "Five signs a text message is a scam (social card pack)", kind: "document", date: "2026-11-18", rights: "Free to use with credit", size: "ZIP, 3.4 MB" },
];

export const contactDesks = [
  { name: "Newsroom", note: "Story tips and corrections", email: "newsroom@demo.npftv.example" },
  { name: "Media relations", note: "Interview and filming requests", email: "media@demo.npftv.example" },
  { name: "Partnerships", note: "Sponsorship and public service campaigns", email: "partners@demo.npftv.example" },
  { name: "Programming", note: "Programme ideas and feedback", email: "programmes@demo.npftv.example" },
  { name: "Production", note: "Studio and outside broadcast enquiries", email: "production@demo.npftv.example" },
  { name: "Technical support", note: "Problems watching NPFTV Stream", email: "support@demo.npftv.example" },
  { name: "Photography", note: "Image requests and permissions", email: "photos@demo.npftv.example" },
];
