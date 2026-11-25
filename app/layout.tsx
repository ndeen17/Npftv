import type { Metadata, Viewport } from "next";
import { Archivo, Zilla_Slab } from "next/font/google";
import { IconSprite } from "@/components/Icon";
import { PresenterPanel } from "@/components/PresenterPanel";
import { ToastProvider } from "@/components/Toast";
import { DemoProvider } from "@/lib/store";
import "./globals.css";

const zilla = Zilla_Slab({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-zilla", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });

export const metadata: Metadata = {
  title: { default: "NPFTV (prototype)", template: "%s | NPFTV prototype" },
  description: "Prototype with demo data. Stories, figures and names are fictional and not official NPF information.",
  robots: { index: false, follow: false },
  icons: { icon: "/images/logo.webp" },
};

export const viewport: Viewport = { themeColor: "#1c0d37", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${zilla.variable} ${archivo.variable}`}>
      <body>
        <IconSprite />
        <DemoProvider>
          <ToastProvider>
            {children}
            <PresenterPanel />
          </ToastProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
