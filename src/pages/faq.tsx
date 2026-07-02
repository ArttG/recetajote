import Head from "next/head";
import { useState } from "react";
import Icon from "@/components/shared/Icon";

const faqs = [
  { q: "A është falas RecetaJote?", a: "Po, regjistrimi dhe përdorimi i platformës janë plotësisht falas. Nuk ka tarifa të fshehura." },
  { q: "Si mund të ruaj një recetë?", a: "Kyçu në llogari dhe kliko ikonën e zemrës në çdo recetë për ta shtuar te favoritet." },
  { q: "Kush mund të shtojë receta të reja?", a: "Vetëm administratorët mund të shtojnë, editojnë dhe fshijnë receta përmes panelit të adminit." },
  { q: "Si mund të kyçem në llogari?", a: "Mund të kyçesh me email/fjalëkalim ose me llogarinë tënde Google/Facebook." },
  { q: "A mund të lë komente dhe vlerësime?", a: "Po, çdo përdorues i kyçur mund të lërë komente dhe vlerësime për recetat." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <Head><title>Pyetjet e shpeshta | RecetaJote</title></Head>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px clamp(20px,4.5vw,56px) clamp(22px,4.5vw,60px)" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: 15, background: "var(--accent-soft)", color: "var(--accent)", margin: "0 auto" }}>
            <Icon name="help" size={27} fill={1} />
          </span>
          <h1 className="font-serif" style={{ margin: "18px 0 0", fontSize: "clamp(34px,5vw,44px)", fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>
            Pyetjet e shpeshta
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 16, color: "var(--ink-2)" }}>Gjithçka që duhet të dish për RecetaJote.</p>
        </div>

        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${isOpen ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 16,
                  padding: isOpen ? 22 : "20px 22px",
                  boxShadow: isOpen ? "var(--shadow-sm)" : "none",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", fontFamily: "'Hanken Grotesk', sans-serif" }}>{f.q}</span>
                  <Icon name={isOpen ? "expand_less" : "expand_more"} size={22} color={isOpen ? "var(--accent)" : "var(--muted)"} />
                </button>
                {isOpen && <p style={{ margin: "12px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-2)" }}>{f.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
