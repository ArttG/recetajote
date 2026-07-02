import Head from "next/head";
import Link from "next/link";
import Icon from "@/components/shared/Icon";

const container: React.CSSProperties = { maxWidth: 1160, margin: "0 auto" };

const offerings = [
  {
    icon: "menu_book",
    title: "Receta të zgjedhura",
    text: "Një koleksion i pasur recetash nga kuzhina shqiptare dhe mesdhetare, i organizuar sipas kategorive për t'u gjetur me lehtësi.",
  },
  {
    icon: "favorite",
    title: "Të preferuarat në një vend",
    text: "Ruaj recetat që të pëlqejnë dhe kthehu tek ato kur të duash — të gjitha të mbledhura te faqja jote personale.",
  },
  {
    icon: "forum",
    title: "Një komunitet gatuesish",
    text: "Lër komente, vlerëso me yje dhe ndaj përvojat e tua në kuzhinë me të tjerët që e duan ushqimin po aq sa ti.",
  },
];

export default function About() {
  return (
    <>
      <Head>
        <title>Rreth Nesh | RecetaJote</title>
        <meta name="description" content="Mëso më shumë rreth RecetaJote — platforma jote për të zbuluar, ruajtur dhe ndarë receta të shijshme." />
      </Head>

      {/* Story hero */}
      <section style={{ ...container, padding: "60px clamp(20px,4.5vw,56px) 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 48, alignItems: "center" }}>
          <div>
            <span className="font-mono" style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 500 }}>
              Historia jonë
            </span>
            <h1 className="font-serif" style={{ margin: "12px 0 0", fontSize: "clamp(36px,5.5vw,48px)", fontWeight: 500, letterSpacing: "-.02em", lineHeight: 1.05, color: "var(--ink)" }}>
              Ushqim i mirë, i ndarë me dashuri.
            </h1>
            <p style={{ margin: "20px 0 0", fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)" }}>
              RecetaJote është një platformë recetash e krijuar për të bashkuar dashamirësit e kuzhinës në një hapësirë të vetme —
              për të zbuluar receta të reja, për të ruajtur të preferuarat dhe për të ndarë mendime me komunitetin.
            </p>
            <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)" }}>
              Qëllimi ynë është i thjeshtë: ta bëjmë gatimin më të lehtë dhe më të gëzueshëm për këdo — nga ai që sapo ka
              filluar, te gatuesi me përvojë që kërkon frymëzim të ri për tryezën e tij.
            </p>
          </div>
          <div style={{ position: "relative", height: 400, borderRadius: 22, overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* What the site offers */}
      <section style={{ ...container, padding: "36px clamp(20px,4.5vw,56px) 12px" }}>
        <h2 className="font-serif" style={{ margin: 0, fontSize: 30, fontWeight: 500, color: "var(--ink)" }}>Çfarë ofron RecetaJote</h2>
        <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
          {offerings.map((o) => (
            <div key={o.title} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, padding: 24, boxShadow: "var(--shadow-sm)" }}>
              <span style={{ display: "grid", placeItems: "center", width: 50, height: 50, borderRadius: 14, background: "var(--accent-soft)", color: "var(--accent)" }}>
                <Icon name={o.icon} size={26} fill={1} />
              </span>
              <h3 className="font-serif" style={{ margin: "16px 0 0", fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>{o.title}</h3>
              <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>{o.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...container, padding: "44px clamp(20px,4.5vw,56px) clamp(22px,4.5vw,60px)" }}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 24, padding: "48px clamp(24px,4vw,52px)", background: "linear-gradient(120deg,var(--accent),var(--accent-2))", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ position: "relative", zIndex: 2, maxWidth: 560 }}>
            <h2 className="font-serif" style={{ margin: 0, fontSize: "clamp(28px,4vw,36px)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-.02em", color: "#fff" }}>
              Zbulo recetën tënde të radhës.
            </h2>
            <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.55, color: "rgba(255,255,255,.86)" }}>
              Shfleto koleksionin tonë dhe fillo të ruash të preferuarat e tua që sot.
            </p>
            <Link href="/recipes" className="rj-lift" style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 26, padding: "15px 26px", borderRadius: 13, textDecoration: "none", fontSize: 15, fontWeight: 700, color: "var(--accent)", background: "#fff" }}>
              Shfleto recetat
              <Icon name="arrow_forward" size={19} />
            </Link>
          </div>
          <span className="ms" aria-hidden="true" style={{ position: "absolute", right: -20, bottom: -40, fontSize: 240, color: "rgba(255,255,255,.1)", fontVariationSettings: "'FILL' 1" }}>
            restaurant
          </span>
        </div>
      </section>
    </>
  );
}
