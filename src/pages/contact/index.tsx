import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Icon from "@/components/shared/Icon";

interface FormValues {
  name: string;
  email: string;
  message: string;
}

const contacts = [
  { icon: "mail", label: "Email", value: "info@recetajote.com" },
  { icon: "call", label: "Telefon", value: "+383 44 000 000" },
  { icon: "location_on", label: "Adresa", value: "Prishtinë, Kosovë" },
];

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)", marginBottom: 7 };
const fieldStyle: React.CSSProperties = { width: "100%", borderRadius: 11, padding: "13px 15px", fontSize: 14.5, fontFamily: "'Hanken Grotesk', sans-serif" };

// Formë kontakti me validim (react-hook-form) + ruajtje në DB (Kërkesa 8).
export default function Contact() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setSuccess("");
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Gabim gjatë dërgimit");
      return;
    }
    setSuccess("Faleminderit! Mesazhi u dërgua me sukses. ✅");
    reset();
  };

  return (
    <>
      <Head>
        <title>Kontakt | RecetaJote</title>
        <meta name="description" content="Na kontakto për pyetje ose sugjerime." />
      </Head>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "56px clamp(20px,4.5vw,56px) clamp(22px,4.5vw,60px)" }}>
        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 500 }}>
            Jemi këtu për ty
          </span>
          <h1 className="font-serif" style={{ margin: "12px 0 0", fontSize: "clamp(34px,5vw,44px)", fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>
            Na kontakto
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 16, color: "var(--ink-2)" }}>
            Ke një pyetje, sugjerim ose thjesht do të na thuash përshëndetje? Na shkruaj.
          </p>
        </div>

        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 30, alignItems: "start" }}>
          {/* Contact info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {contacts.map((c) => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 15, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20 }}>
                <span style={{ display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 13, background: "var(--accent-soft)", color: "var(--accent)", flexShrink: 0 }}>
                  <Icon name={c.icon} size={23} fill={1} />
                </span>
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{c.label}</div>
                  <div style={{ marginTop: 2, fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{c.value}</div>
                </div>
              </div>
            ))}
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", height: 150, position: "relative", background: "var(--bg-2)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=700&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
              <span style={{ position: "absolute", left: 16, bottom: 14, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "#fff", background: "rgba(20,12,6,.5)", backdropFilter: "blur(6px)", padding: "7px 13px", borderRadius: 999 }}>
                <Icon name="location_on" size={17} />Prishtinë, Kosovë
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 28, boxShadow: "var(--shadow-sm)" }}>
            <h2 className="font-serif" style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>Dërgo një mesazh</h2>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 15 }}>
              {success && <div style={{ borderRadius: 10, background: "var(--accent-soft)", padding: "10px 14px", fontSize: 14, color: "var(--accent-ink)" }}>{success}</div>}
              {error && <div style={{ borderRadius: 10, background: "var(--danger-soft)", padding: "10px 14px", fontSize: 14, color: "var(--danger)" }}>{error}</div>}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 13 }}>
                <div>
                  <label style={labelStyle}>Emri</label>
                  <input className="rj-input" style={fieldStyle} placeholder="Emri yt" {...register("name", { required: "Emri është i detyrueshëm" })} />
                  {errors.name && <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--danger)" }}>{errors.name.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    className="rj-input"
                    style={fieldStyle}
                    placeholder="ti@example.com"
                    {...register("email", {
                      required: "Email është i detyrueshëm",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email i pavlefshëm" },
                    })}
                  />
                  {errors.email && <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--danger)" }}>{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mesazhi</label>
                <textarea
                  rows={5}
                  className="rj-input"
                  style={{ ...fieldStyle, minHeight: 120, resize: "vertical" }}
                  placeholder="Si mund të të ndihmojmë?"
                  {...register("message", { required: "Mesazhi është i detyrueshëm", minLength: { value: 10, message: "Të paktën 10 karaktere" } })}
                />
                {errors.message && <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--danger)" }}>{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rj-lift"
                style={{ padding: 14, borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", background: "var(--accent)", boxShadow: "0 12px 26px -12px rgba(189,90,45,.7)", opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? "Duke dërguar…" : "Dërgo mesazhin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
