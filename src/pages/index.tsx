import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import { getRecipes } from "@/api/services/Recipe";
import { Recipe, RECIPE_CATEGORIES } from "@/api/models/Recipe";
import { categoryIcon } from "@/lib/categoryIcons";
import RecipeCard from "@/components/shared/RecipeCard";
import Icon from "@/components/shared/Icon";

interface Props {
  featured: Recipe[];
}

// ISR — Home rifreskohet çdo 30 sekonda me recetat më të reja (Ushtrimi Javor 5).
export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const all = await getRecipes();
    return { props: { featured: all.slice(0, 6) }, revalidate: 30 };
  } catch {
    // DB e padisponueshme gjatë build-it — faqja rifreskohet me ISR kur DB të jetë gati.
    return { props: { featured: [] }, revalidate: 30 };
  }
};

const values = [
  { icon: "search", title: "Kërko me lehtësi", text: "Gjej recetën e duhur sipas kategorisë, kohës së gatimit ose përbërësve që ke në shtëpi." },
  { icon: "favorite", title: "Ruaj favoritet", text: "Mbaji të gjitha recetat e preferuara në një vend të vetëm, gati për t'i gatuar sërish." },
  { icon: "forum", title: "Ndaj mendimin", text: "Lër komente, vlerëso me yje dhe frymëzo komunitetin me përvojat e tua në kuzhinë." },
];

const container: React.CSSProperties = { maxWidth: 1160, margin: "0 auto" };

export default function Home({ featured }: Props) {
  return (
    <>
      <Head>
        <title>RecetaJote — Zbulo receta të shijshme</title>
        <meta name="description" content="Zbulo, ruaj dhe ndaj receta të mrekullueshme në RecetaJote." />
      </Head>

      {/* Hero */}
      <section style={{ background: "radial-gradient(1200px 500px at 12% -10%,var(--accent-soft),transparent 60%)" }}>
        <div
          className="rj-hero"
          style={{
            ...container,
            padding: "64px clamp(20px,4.5vw,56px) clamp(22px,4.5vw,60px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: 52,
            alignItems: "center",
          }}
        >
          <div>
            <span
              className="font-mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11.5,
                fontWeight: 500,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "var(--accent-ink)",
                background: "var(--accent-soft)",
                border: "1px solid var(--border-2)",
                padding: "7px 14px",
                borderRadius: 999,
              }}
            >
              <Icon name="local_fire_department" size={16} fill={1} />
              Kuzhina shqiptare &amp; më gjerë
            </span>
            <h1 className="font-serif" style={{ margin: "22px 0 0", fontWeight: 500, fontSize: "clamp(40px,6vw,62px)", lineHeight: 1.03, letterSpacing: "-.02em", color: "var(--ink)" }}>
              Gatuaj diçka <span style={{ fontStyle: "italic", color: "var(--accent)" }}>të mrekullueshme</span> sot.
            </h1>
            <p style={{ margin: "22px 0 0", maxWidth: 460, fontSize: 16.5, lineHeight: 1.62, color: "var(--ink-2)" }}>
              Zbulo qindra receta të zgjedhura me kujdes, ruaj të preferuarat e tua dhe ndaj mendimet me një komunitet që e do ushqimin.
            </p>
            <div style={{ marginTop: 30, display: "flex", gap: 13, flexWrap: "wrap" }}>
              <Link
                href="/recipes"
                className="rj-lift"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "15px 25px",
                  borderRadius: 13,
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#fff",
                  background: "var(--accent)",
                  boxShadow: "0 12px 26px -12px rgba(189,90,45,.7)",
                }}
              >
                Shfleto recetat
                <Icon name="arrow_forward" size={19} />
              </Link>
              <Link
                href="/sign-up"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "15px 25px",
                  borderRadius: 13,
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--ink)",
                  background: "var(--surface)",
                  border: "1px solid var(--border-2)",
                }}
              >
                Bashkohu falas
              </Link>
            </div>
            <div style={{ marginTop: 38, display: "flex", gap: 34 }}>
              <div>
                <div className="font-serif" style={{ fontSize: 30, fontWeight: 600, color: "var(--ink)" }}>500+</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Receta të zgjedhura</div>
              </div>
              <div style={{ width: 1, background: "var(--border)" }} />
              <div>
                <div className="font-serif" style={{ fontSize: 30, fontWeight: 600, color: "var(--ink)" }}>12k</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Gatues aktivë</div>
              </div>
              <div style={{ width: 1, background: "var(--border)" }} />
              <div>
                <div className="font-serif" style={{ fontSize: 30, fontWeight: 600, color: "var(--ink)" }}>
                  4.8<span style={{ fontSize: 16, color: "var(--gold)" }}> ★</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Vlerësim mesatar</div>
              </div>
            </div>
          </div>

          <div className="rj-hero-art" style={{ position: "relative", height: 460 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ position: "absolute", left: -22, bottom: 34, width: 236, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, padding: 15, boxShadow: "var(--shadow-lg)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1519676867240-f03562e64548?w=200&q=80" alt="" style={{ width: 52, height: 52, borderRadius: 12, objectFit: "cover" }} />
                <div>
                  <div className="font-mono" style={{ fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent)" }}>Receta e ditës</div>
                  <div className="font-serif" style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", lineHeight: 1.1, marginTop: 2 }}>Bakllava</div>
                </div>
              </div>
              <div style={{ marginTop: 11, display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
                <Icon name="schedule" size={15} />75 min<span style={{ margin: "0 2px" }}>·</span>
                <Icon name="star" size={15} fill={1} color="var(--gold)" />4.9
              </div>
            </div>
            <div style={{ position: "absolute", right: -16, top: 26, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 15, padding: "11px 15px", boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent)" }}>
                <Icon name="favorite" size={19} fill={1} />
              </span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>2,431</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>ruajtje këtë javë</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ ...container, padding: "8px clamp(20px,4.5vw,56px) 40px" }}>
        <h2 className="font-serif" style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 600, letterSpacing: ".02em", color: "var(--muted)", textTransform: "uppercase" }}>
          Shfleto sipas kategorisë
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {RECIPE_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/recipes?category=${encodeURIComponent(cat)}`}
              className="rj-chip"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 17px",
                borderRadius: 13,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink-2)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <Icon name={categoryIcon(cat)} size={18} fill={1} color="var(--accent)" />
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section style={{ background: "var(--bg-2)" }}>
        <div style={{ ...container, padding: "20px clamp(20px,4.5vw,56px)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, paddingTop: 34, flexWrap: "wrap" }}>
            <div>
              <span className="font-mono" style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 500 }}>Të përzgjedhura</span>
              <h2 className="font-serif" style={{ margin: "9px 0 0", fontSize: 38, fontWeight: 500, letterSpacing: "-.015em", color: "var(--ink)" }}>Recetat e fundit</h2>
            </div>
            <Link href="/recipes" className="rj-navlink" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14.5, fontWeight: 600, textDecoration: "none", color: "var(--accent)" }}>
              Shiko të gjitha
              <Icon name="arrow_forward" size={18} />
            </Link>
          </div>
          {featured.length === 0 ? (
            <p style={{ margin: "40px 0", textAlign: "center", color: "var(--muted)", paddingBottom: 44 }}>
              Ende nuk ka receta. Admini mund të shtojë receta nga paneli.
            </p>
          ) : (
            <div style={{ marginTop: 28, paddingBottom: 44, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 22 }}>
              {featured.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Value props */}
      <section style={{ ...container, padding: "60px clamp(20px,4.5vw,56px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 22 }}>
          {values.map((v) => (
            <div key={v.title} style={{ padding: 28, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span style={{ display: "grid", placeItems: "center", width: 50, height: 50, borderRadius: 14, background: "var(--accent-soft)", color: "var(--accent)" }}>
                <Icon name={v.icon} size={26} fill={1} />
              </span>
              <h3 className="font-serif" style={{ margin: "18px 0 0", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>{v.title}</h3>
              <p style={{ margin: "9px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "var(--muted)" }}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section style={{ ...container, padding: "0 clamp(20px,4.5vw,56px) clamp(22px,4.5vw,60px)" }}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 24, padding: "56px clamp(24px,4vw,52px)", background: "linear-gradient(120deg,var(--accent),var(--accent-2))", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ position: "relative", zIndex: 2, maxWidth: 560 }}>
            <h2 className="font-serif" style={{ margin: 0, fontSize: "clamp(30px,4vw,40px)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-.02em", color: "#fff" }}>
              Gati për të filluar udhëtimin tënd në kuzhinë?
            </h2>
            <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.55, color: "rgba(255,255,255,.86)" }}>
              Regjistrohu falas dhe fillo të ruash recetat e tua të preferuara që sot.
            </p>
            <Link href="/sign-up" className="rj-lift" style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 28, padding: "15px 26px", borderRadius: 13, textDecoration: "none", fontSize: 15, fontWeight: 700, color: "var(--accent)", background: "#fff" }}>
              Krijo llogari falas
              <Icon name="arrow_forward" size={19} />
            </Link>
          </div>
          <span className="ms" aria-hidden="true" style={{ position: "absolute", right: -20, bottom: -40, fontSize: 280, color: "rgba(255,255,255,.1)", fontVariationSettings: "'FILL' 1" }}>
            restaurant
          </span>
        </div>
      </section>
    </>
  );
}
