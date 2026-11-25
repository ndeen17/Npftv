// Live check of every AI feature through /api/ai.
// Usage: start the app (npm run dev, or npm run build && npm start), then:
//   node scripts/test-ai.mjs [base-url]
// Needs OPENAI_API_KEY in .env.local. Makes about 10 small requests to OpenAI.

const BASE = process.argv[2] || "http://localhost:3000";

const cases = [
  {
    feature: "scam-check",
    input: { message: "Congratulations! Your MTN number won N500,000 in our end of year promo. Send N5,000 processing fee to 0123456789 to claim today only." },
    ok: (d) => ["very_likely_scam", "possibly_scam"].includes(d.verdict) && d.signs.length > 0 && d.whatToDo,
  },
  { feature: "scam-check", input: { message: "Hi Mum, I'll be home at 6. Can you buy bread on the way?" }, ok: (d) => d.verdict !== "very_likely_scam" },
  { feature: "ask-npftv", input: { question: "Someone called saying he is from my bank and asked for the code they sent me. What do I do?" }, ok: (d) => d.answer && d.sources.includes("keeping-your-otp-safe") },
  { feature: "ask-npftv", input: { question: "Armed men are breaking into my neighbour's house right now" }, ok: (d) => d.isEmergency === true && /112/.test(d.answer) },
  {
    feature: "search",
    input: {
      query: "christmas road trip safety",
      index: [
        { id: "guide:night-time-road-travel", kind: "guide", title: "Night-time road travel", text: "Plan, share your route, avoid stops" },
        { id: "guide:keeping-your-otp-safe", kind: "guide", title: "Keeping your OTP safe", text: "Who can ask for it (nobody)" },
        { id: "story:eod", kind: "story", title: "Bomb disposal unit completes advanced field certification", text: "Six-week course" },
      ],
    },
    ok: (d) => d.results[0] === "guide:night-time-road-travel",
  },
  {
    feature: "translate",
    input: { lang: "pcm", title: "Five signs a text message is a scam", summary: "Urgency and a request for your OTP are warning signs.", body: ["If in doubt, don't reply.", "Call your bank on the number on your card."] },
    ok: (d) => d.title && d.body.length === 2,
  },
  {
    feature: "catch-me-up",
    input: {
      programme: "The Beat",
      cues: [
        { time: "19:01", text: "Commands will step up night patrols on major highways for the festive season." },
        { time: "19:05", text: "Road safety: plan your route and avoid unofficial stops at night." },
        { time: "19:09", text: "A warning about loan apps that demand access to your contacts." },
      ],
    },
    ok: (d) => d.bullets.length >= 1 && d.bullets.length <= 3,
  },
  {
    feature: "copy-desk",
    input: {
      title: "Lagos police arrest robbery suspects in Ikeja",
      body: [
        "Police in Lagos have arrested two men suspected of a series of shop robberies in Ikeja.",
        "The suspects, Tunde Akin, 29, and Emeka Obi, 31, were arrested on Tuesday and have not yet been charged.",
        "Officers are still watching a house on Allen Avenue where a third suspect is believed to be hiding.",
        "Residents with information are asked to contact their nearest police station station.",
      ],
    },
    ok: (d) => d.headlines.length === 3 && d.sensitivity.length >= 2 && d.summary,
  },
  {
    feature: "triage",
    input: { title: "Enugu: neighbourhood watch groups meet divisional officers", body: ["Watch groups from twelve communities in Enugu met their divisional officers on Saturday."] },
    ok: (d) => d.state === "EN" && ["routine", "priority"].includes(d.urgency),
  },
  { feature: "ask-data", input: { question: "Which department has used the most of its budget, in percentage terms?", briefingBooked: true }, ok: (d) => /broadcast operations/i.test(d.answer) },
  { feature: "ask-data", input: { question: "What is the IGP's salary?", briefingBooked: false }, ok: (d) => /can't find|cannot find|not in/i.test(d.answer) },
];

const health = await fetch(`${BASE}/api/ai`).then((r) => r.json());
console.log(`AI service: ${health.configured ? "configured" : "NOT configured (add OPENAI_API_KEY to .env.local and restart)"}, model ${health.model}\n`);
if (!health.configured) process.exit(1);

let pass = 0;
await Promise.all(
  cases.map(async (c, i) => {
    const t = Date.now();
    try {
      const res = await fetch(`${BASE}/api/ai`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ feature: c.feature, input: c.input }) });
      const body = await res.json();
      const good = res.ok && c.ok(body.data);
      if (good) pass++;
      console.log(`${good ? "PASS" : "FAIL"}  #${i + 1} ${c.feature}  ${((Date.now() - t) / 1000).toFixed(1)}s`);
      console.log(`      ${JSON.stringify(res.ok ? body.data : body).slice(0, 400)}\n`);
    } catch (e) {
      console.log(`FAIL  #${i + 1} ${c.feature}: ${e.message}\n`);
    }
  }),
);
console.log(`${pass}/${cases.length} passed`);

// Guardrails
const bad = await fetch(`${BASE}/api/ai`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ feature: "anything", input: {} }) });
console.log(`Unknown feature rejected: ${bad.status === 400 ? "yes" : "NO"}`);
const big = await fetch(`${BASE}/api/ai`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ feature: "scam-check", input: { message: "x".repeat(2000) } }) });
console.log(`Over-long input rejected: ${big.status === 400 ? "yes" : "NO"}`);
process.exit(pass === cases.length ? 0 : 1);
