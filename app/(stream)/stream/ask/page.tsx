"use client";

import { AskNpftv } from "@/components/AskNpftv";

export default function AskPage() {
  return (
    <section className="s-pad" style={{ maxWidth: 820 }}>
      <h1 style={{ fontSize: 34, marginBottom: 16 }}>Ask NPFTV</h1>
      <AskNpftv />
    </section>
  );
}
