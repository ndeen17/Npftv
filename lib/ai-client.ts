"use client";

// Browser side of the AI layer. Every AI surface calls askAI():
//   1. Scripted mode (presenter switch) or an exact demo-script input: use the scripted answer.
//   2. Otherwise: POST /api/ai (live model). On any error or after 15 seconds: use the scripted answer.
// The UI looks the same either way.

import { runAI } from "./ai";

export type AiSource = "live" | "scripted";
export interface AiResult<T> {
  data: T;
  source: AiSource;
}

const TIMEOUT_MS = 15_000;

export async function askAI<T>(
  feature: string,
  input: unknown,
  fallback: () => T,
  opts: { scripted?: boolean; instant?: boolean; forceScripted?: boolean } = {},
): Promise<AiResult<T>> {
  if (opts.scripted || opts.forceScripted) {
    return { data: await runAI(fallback, opts.instant), source: "scripted" };
  }
  // No key on this deployment: go straight to the scripted answer (no failed request in the console).
  const status = await aiStatus();
  if (status && !status.configured) {
    return { data: await runAI(fallback, opts.instant), source: "scripted" };
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature, input }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`AI ${res.status}`);
    const body = (await res.json()) as { data: T };
    return { data: body.data, source: "live" };
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.warn(`[ai] ${feature}: using scripted answer`, e);
    return { data: fallback(), source: "scripted" };
  } finally {
    clearTimeout(timer);
  }
}

export interface AiStatus {
  configured: boolean;
  model: string;
}

let statusPromise: Promise<AiStatus | null> | null = null;
export function aiStatus(): Promise<AiStatus | null> {
  statusPromise ??= fetch("/api/ai", { cache: "no-store" })
    .then((r) => (r.ok ? (r.json() as Promise<AiStatus>) : null))
    .catch(() => null);
  return statusPromise;
}

/** Hook-friendly options from the demo store. */
export function aiOpts(state: { aiScripted?: boolean; aiInstant: boolean }) {
  return { scripted: !!state.aiScripted, instant: state.aiInstant };
}
