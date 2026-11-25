// The only server code in the demo: a proxy to OpenAI that holds the key.
// The browser sends { feature, input }. The server picks the prompt, schema and model.

import OpenAI from "openai";
import { EMERGENCY_RE, FEATURES } from "@/lib/server/features";

export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

const MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";
const DAILY_LIMIT = Number(process.env.AI_DAILY_REQUEST_LIMIT || 2000);
const PER_IP_LIMIT = 40; // requests per IP per 10 minutes
const WINDOW_MS = 10 * 60 * 1000;

// Best-effort limits. They live in memory per server instance; the real safety net is the
// monthly spending cap set on the OpenAI project.
const hits = new Map<string, number[]>();
let day = new Date().toISOString().slice(0, 10);
let dayCount = 0;

let client: OpenAI | null = null;
function openai() {
  if (!process.env.OPENAI_API_KEY) return null;
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 25_000, maxRetries: 1 });
  return client;
}

function limited(ip: string): string | null {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    dayCount = 0;
  }
  if (dayCount >= DAILY_LIMIT) return "The demo's daily AI limit has been reached.";
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= PER_IP_LIMIT) return "Too many requests. Please wait a few minutes.";
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  dayCount++;
  return null;
}

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Health check used by the presenter panel. Never reveals the key. */
export async function GET() {
  return json({ configured: !!process.env.OPENAI_API_KEY, model: MODEL });
}

export async function POST(req: Request) {
  const ai = openai();
  if (!ai) return json({ error: "AI is not configured on this deployment." }, 503);

  let body: { feature?: unknown; input?: unknown };
  try {
    const text = await req.text();
    if (text.length > 60_000) return json({ error: "Request too large." }, 413);
    body = JSON.parse(text);
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  const feature = typeof body.feature === "string" ? FEATURES[body.feature] : undefined;
  if (!feature) return json({ error: "Unknown feature." }, 400);

  let prepared: { text: string; ctx?: unknown };
  try {
    prepared = feature.input(body.input);
  } catch (e) {
    return json({ error: typeof e === "string" ? e : "Invalid input." }, 400);
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  const limit = limited(ip);
  if (limit) return json({ error: limit }, 429);

  const started = Date.now();
  try {
    const res = await ai.responses.create({
      model: MODEL,
      instructions: feature.instructions,
      input: prepared.text,
      reasoning: { effort: feature.effort },
      max_output_tokens: feature.maxTokens,
      store: false,
      text: { format: { type: "json_schema", name: String(body.feature).replace(/-/g, "_"), schema: feature.schema, strict: true } },
    });
    if (res.status !== "completed" || !res.output_text) {
      console.error(`[ai] ${body.feature}: response ${res.status}`, res.incomplete_details ?? "");
      return json({ error: "The AI response was incomplete." }, 502);
    }
    let data = JSON.parse(res.output_text);
    if (feature.check) data = feature.check(data, prepared.ctx);
    // Guardrail: never rely on the model alone to spot an emergency.
    if (["ask-npftv", "scam-check", "complaint-helper"].includes(String(body.feature)) && EMERGENCY_RE.test(JSON.stringify(body.input))) data.isEmergency = true;
    if (data.isEmergency && body.feature === "ask-npftv" && !/112/.test(data.answer)) {
      data.answer = `If you or someone else is in danger now, call 112 straight away. It's free on every network. ${data.answer}`;
    }
    return json({ data, model: MODEL, ms: Date.now() - started });
  } catch (e) {
    const err = e as { status?: number; message?: string };
    console.error(`[ai] ${body.feature} failed:`, err.status ?? "", err.message ?? e);
    const status = err.status === 429 ? 429 : 502;
    return json({ error: status === 429 ? "The AI service is busy. Please try again." : "The AI service failed." }, status);
  }
}
