import Head from "next/head";
import Link from "next/link";
import Icon from "@/components/shared/Icon";

export default function NotFound() {
  return (
    <>
      <Head><title>404 — Faqja nuk u gjet | RecetaJote</title></Head>

      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ padding: "80px clamp(20px,4.5vw,56px) 90px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(700px 300px at 50% 0%,var(--accent-soft),transparent 65%)" }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <Icon name="skillet" size={76} fill={1} color="var(--accent)" />
            <div className="font-serif" style={{ fontSize: "clamp(80px,14vw,110px)", fontWeight: 600, letterSpacing: "-.03em", color: "var(--ink)", lineHeight: 1, marginTop: 6 }}>404</div>
            <h1 className="font-serif" style={{ margin: "14px 0 0", fontSize: 30, fontWeight: 500, color: "var(--ink)" }}>Kjo recetë nuk u gjet.</h1>
            <p style={{ margin: "10px auto 0", maxWidth: 400, fontSize: 16, color: "var(--ink-2)" }}>
              Ndoshta faqja u zhvendos ose nuk ekziston. Le të kthehemi te diçka e shijshme.
            </p>
            <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/" className="rj-lift" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 12, textDecoration: "none", fontSize: 15, fontWeight: 600, color: "#fff", background: "var(--accent)", boxShadow: "0 12px 26px -12px rgba(189,90,45,.7)" }}>
                <Icon name="home" size={19} />Kthehu në ballinë
              </Link>
              <Link href="/recipes" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 12, textDecoration: "none", fontSize: 15, fontWeight: 600, color: "var(--ink)", background: "var(--surface)", border: "1px solid var(--border-2)" }}>
                Shfleto recetat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
