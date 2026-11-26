import { Assistant } from "@/components/site/Assistant";
import { ProtoBanner, SiteFooter, SiteHeader } from "@/components/site/SiteChrome";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <ProtoBanner />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      {/* Ask NPFTV lives on the main website only (not on NPFTV Stream or in the Control Room). */}
      <Assistant />
    </div>
  );
}
