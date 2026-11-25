import type { Metadata } from "next";
import { ProtoBanner } from "@/components/site/SiteChrome";
import { StreamFoot, StreamTop } from "@/components/stream/StreamChrome";

export const metadata: Metadata = { title: { default: "NPFTV Stream", template: "%s | NPFTV Stream (prototype)" } };

// NPFTV Stream has its own layout and identity (stream.npftv.net in the real product).
export default function StreamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="strm">
      <ProtoBanner text="Programmes, figures and captions are fictional." />
      <StreamTop />
      <main id="main">{children}</main>
      <StreamFoot />
    </div>
  );
}
