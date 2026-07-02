import Head from "next/head";
import Icon from "@/components/shared/Icon";

const sections = [
  { t: "1. Pranimi i kushteve", d: "Duke përdorur RecetaJote, ju pranoni këto kushte përdorimi." },
  { t: "2. Llogaria", d: "Ju jeni përgjegjës për ruajtjen e sigurisë së llogarisë dhe fjalëkalimit tuaj." },
  { t: "3. Përmbajtja", d: "Komentet dhe përmbajtja që publikoni duhet të jenë të përshtatshme dhe të respektojnë komunitetin." },
  { t: "4. Privatësia", d: "Të dhënat tuaja ruhen në mënyrë të sigurt dhe nuk ndahen me palë të treta." },
  { t: "5. Ndryshimet", d: "Ne mund t'i përditësojmë këto kushte herë pas here. Ndryshimet do të publikohen në këtë faqe." },
];

export default function Terms() {
  return (
    <>
      <Head><title>Kushtet e Përdorimit | RecetaJote</title></Head>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px clamp(20px,4.5vw,56px) clamp(22px,4.5vw,60px)" }}>
        <span style={{ display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: 15, background: "var(--accent-soft)", color: "var(--accent)" }}>
          <Icon name="gavel" size={26} fill={1} />
        </span>
        <h1 className="font-serif" style={{ margin: "18px 0 0", fontSize: "clamp(32px,5vw,44px)", fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>
          Kushtet e Përdorimit
        </h1>

        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
          {sections.map((s) => (
            <div key={s.t} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" }}>
              <h2 className="font-serif" style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{s.t}</h2>
              <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.65, color: "var(--ink-2)" }}>{s.d}</p>
            </div>
          ))}
        </div>

        <p style={{ margin: "24px 0 0", fontSize: 13, color: "var(--muted)" }}>
          Ky dokument është pjesë e një projekti akademik dhe nuk përbën këshillë ligjore.
        </p>
      </div>
    </>
  );
}
