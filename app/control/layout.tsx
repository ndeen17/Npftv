import type { Metadata } from "next";
import { Suspense } from "react";
import { ControlShell } from "@/components/control/Shell";
import { ProtoBanner } from "@/components/site/SiteChrome";

export const metadata: Metadata = { title: { default: "Control Room", template: "%s | NPFTV Control Room (prototype)" } };

export default function ControlLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ctl">
      <ProtoBanner text="Staff, stories, suspects, figures and budgets are fictional." />
      <Suspense>
        <ControlShell>{children}</ControlShell>
      </Suspense>
    </div>
  );
}
