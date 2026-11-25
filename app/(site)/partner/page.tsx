import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { PageHead } from "@/components/site/bits";

export const metadata = { title: "Partner with NPFTV" };

const OFFERS: { icon: IconName; t: string; d: string }[] = [
  { icon: "radio", t: "Public service campaigns", d: "Road safety, cyber safety and community campaigns on TV, Stream and social." },
  { icon: "film", t: "Sponsored segments", d: "Clearly labelled segments within Safe Nigeria, Cyber Sense and Community Watch." },
  { icon: "users", t: "Community partnerships", d: "Work with our correspondents and state commands on local safety projects." },
  { icon: "mic", t: "Co-productions", d: "Documentaries and specials, produced to NPFTV's editorial standards." },
];

export default function PartnerPage() {
  return (
    <>
      <PageHead title="Partner with NPFTV" intro="Reach millions of Nigerians with public safety messages they trust. Every partnership follows our editorial standards and is clearly labelled." crumbs={[{ label: "Partner with NPFTV" }]} />
      <section className="sec" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {OFFERS.map((o) => (
              <div key={o.t} className="card-w" style={{ padding: 24, display: "grid", gridTemplateColumns: "52px 1fr", gap: 16 }}>
                <span style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--indigo)", color: "var(--yellow)", display: "grid", placeItems: "center" }}>
                  <Icon name={o.icon} />
                </span>
                <div>
                  <h3 style={{ color: "var(--indigo)" }}>{o.t}</h3>
                  <p style={{ color: "var(--muted)", marginTop: 6 }}>{o.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn btn-indigo" href="/contact">
              Contact the Partnerships desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
