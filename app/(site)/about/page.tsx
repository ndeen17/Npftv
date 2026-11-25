import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHead } from "@/components/site/bits";

export const metadata = { title: "About NPFTV" };

const LEADERS = [
  { t: "The Inspector-General of Police", d: "Head of the Nigeria Police Force" },
  { t: "The Force Public Relations Officer", d: "Oversees the Force's public communication" },
  { t: "The Network Director", d: "Leads NPFTV: editorial, broadcast and operations" },
  { t: "The Head of News", d: "Responsible for the newsroom and the correspondent network" },
  { t: "The Head of Programmes", d: "Commissions and produces NPFTV's programmes" },
  { t: "The Head of Digital", d: "Runs the website, NPFTV Stream and social channels" },
];

const DOCS = ["NPFTV editorial standards (PDF)", "Corrections and complaints policy (PDF)", "Privacy notice (PDF)", "Annual report 2025 (PDF)"];

export default function AboutPage() {
  return (
    <>
      <PageHead title="About NPFTV" intro="Nigeria Police Force Television: the national police broadcaster. Inform. Educate. Inspire." crumbs={[{ label: "About" }]} />
      <section className="sec dir" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <figure className="dir-fig">
            <div className="ph">
              <img src="/images/emblem.webp" alt="NPFTV emblem" />
            </div>
            <figcaption>
              Our mandate<small>Nigeria Police Force Television</small>
            </figcaption>
          </figure>
          <div className="dir-txt">
            <h2>Why NPFTV exists</h2>
            <p>NPFTV tells the story of policing in Nigeria, accurately and in plain language, so that every citizen can see the work of their police and know how to stay safe.</p>
            <p>
              <b>Vision:</b> a trusted, national public safety broadcaster on every screen.
              <br />
              <b>Mission:</b> to inform, educate and inspire through verified news, practical safety guidance and programmes that bring police and public closer.
            </p>
          </div>
        </div>
      </section>

      <section className="sec nu" style={{ paddingTop: 64 }}>
        <div className="wrap" style={{ display: "block" }}>
          <div className="sec-hd">
            <div>
              <h2>Structure and leadership</h2>
              <p>NPFTV is part of the Force Public Relations Department. Leaders are listed by title.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEADERS.map((l) => (
              <div key={l.t} className="card-w" style={{ padding: 20, display: "flex", gap: 14, alignItems: "center" }}>
                <img src="/images/logo.webp" alt="" style={{ width: 48, height: 48, borderRadius: "50%" }} />
                <div>
                  <b style={{ fontFamily: "var(--slab)", color: "var(--indigo)", fontSize: 18 }}>{l.t}</b>
                  <p style={{ color: "var(--muted)", fontSize: 14 }}>{l.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="standards">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 style={{ color: "var(--indigo)", marginBottom: 14 }}>Editorial standards</h2>
            <ul style={{ display: "grid", gap: 10, paddingLeft: 20, color: "#3b3452", fontSize: 16.5 }}>
              <li>We report only what has been verified with the relevant command.</li>
              <li>We never reveal the location or timing of an ongoing operation.</li>
              <li>We describe suspects who have not been charged; we don&apos;t name them.</li>
              <li>We never identify victims or children.</li>
              <li>AI tools help us draft, check and translate. People approve everything we publish.</li>
            </ul>
          </div>
          <div>
            <h2 style={{ color: "var(--indigo)", marginBottom: 14 }}>Documents</h2>
            {DOCS.map((d) => (
              <div key={d} className="guide">
                <span className="gi">
                  <Icon name="file" />
                </span>
                <span className="gt">{d}</span>
                <Icon name="download" />
              </div>
            ))}
            <Link className="btn btn-indigo" href="/contact" style={{ marginTop: 22 }}>
              Contact NPFTV
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
