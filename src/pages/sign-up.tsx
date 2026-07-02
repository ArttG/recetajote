import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import Icon from "@/components/shared/Icon";

interface FormValues {
  name: string;
  email: string;
  password: string;
  role: "user" | "blogger";
}

const roleOptions: { value: "user" | "blogger"; icon: string; title: string; desc: string }[] = [
  { value: "user", icon: "restaurant", title: "Përdorues", desc: "Shfleto receta, ruaj favorite dhe lër komente." },
  { value: "blogger", icon: "edit_note", title: "Blogger", desc: "Publiko dhe menaxho recetat e tua për komunitetin." },
];

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)", marginBottom: 7 };
const wrapStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, borderRadius: 11, padding: "13px 15px" };
const inputStyle: React.CSSProperties = { flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14.5, color: "var(--ink)", fontFamily: "'Hanken Grotesk', sans-serif" };

const benefits = ["Ruaj receta të pakufizuara", "Lër komente dhe vlerësime", "Personalizo profilin tënd"];

// Faqja e regjistrimit — react-hook-form me validim (Ushtrimi Javor 8/9).
export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { role: "user" } });
  const selectedRole = watch("role");

  const onSubmit = async (values: FormValues) => {
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Gabim gjatë regjistrimit");
      return;
    }
    const login = await signIn("credentials", { redirect: false, email: values.email, password: values.password });
    if (login?.error) {
      router.push("/sign-in");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Head><title>Regjistrohu | RecetaJote</title></Head>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(24px,4vw,44px) clamp(16px,4vw,22px)" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: 24, overflow: "hidden", boxShadow: "var(--shadow-lg)", background: "var(--surface)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", minHeight: 640 }}>
          {/* Image side */}
          <div className="rj-auth-art" style={{ position: "relative", overflow: "hidden", minHeight: 260 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=900&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(163,73,31,.32),rgba(20,12,6,.68))" }} />
            <div style={{ position: "absolute", left: 44, right: 44, top: 44 }}>
              <span className="font-mono" style={{ display: "inline-block", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#fff", background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.24)", padding: "7px 14px", borderRadius: 999 }}>
                100% Falas
              </span>
            </div>
            <div style={{ position: "absolute", left: 44, right: 44, bottom: 44 }}>
              <p className="font-serif" style={{ margin: 0, fontSize: 30, fontWeight: 500, lineHeight: 1.2, color: "#fff" }}>Fillo koleksionin tënd të recetave sot.</p>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 11 }}>
                {benefits.map((b) => (
                  <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,.9)" }}>
                    <Icon name="check_circle" size={20} color="#fff" />{b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form side */}
          <div style={{ padding: "clamp(32px,5vw,52px) clamp(22px,4.5vw,60px)", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 520, margin: "0 auto", width: "100%" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 12, background: "var(--accent)", color: "#fff" }}>
                <Icon name="skillet" size={22} fill={1} />
              </span>
              <span className="font-serif" style={{ fontWeight: 600, fontSize: 23, color: "var(--ink)" }}>
                Receta<span style={{ color: "var(--accent)" }}>Jote</span>
              </span>
            </Link>
            <h1 className="font-serif" style={{ margin: "30px 0 0", fontSize: 36, fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>Krijo llogarinë tënde</h1>
            <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--ink-2)" }}>Vetëm disa sekonda dhe je gati të gatuash.</p>

            {error && <div style={{ marginTop: 20, borderRadius: 10, background: "var(--danger-soft)", padding: "10px 14px", fontSize: 14, color: "var(--danger)" }}>{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Emri i plotë</label>
                <div className="rj-input" style={wrapStyle}>
                  <Icon name="person" size={19} color="var(--muted)" />
                  <input placeholder="Elira Rexha" style={inputStyle} {...register("name", { required: "Emri është i detyrueshëm" })} />
                </div>
                {errors.name && <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--danger)" }}>{errors.name.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <div className="rj-input" style={wrapStyle}>
                  <Icon name="mail" size={19} color="var(--muted)" />
                  <input
                    type="email"
                    placeholder="ti@example.com"
                    style={inputStyle}
                    {...register("email", {
                      required: "Email është i detyrueshëm",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email i pavlefshëm" },
                    })}
                  />
                </div>
                {errors.email && <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--danger)" }}>{errors.email.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Fjalëkalimi</label>
                <div className="rj-input" style={wrapStyle}>
                  <Icon name="lock" size={19} color="var(--muted)" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={inputStyle}
                    {...register("password", { required: "Fjalëkalimi është i detyrueshëm", minLength: { value: 6, message: "Të paktën 6 karaktere" } })}
                  />
                </div>
                {errors.password && <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--danger)" }}>{errors.password.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Si dëshiron ta përdorësh RecetaJote?</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
                  {roleOptions.map((opt) => {
                    const on = selectedRole === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className="rj-lift"
                        style={{
                          display: "flex",
                          gap: 11,
                          cursor: "pointer",
                          padding: "13px 14px",
                          borderRadius: 13,
                          border: on ? "1.5px solid var(--accent)" : "1px solid var(--border-2)",
                          background: on ? "var(--accent-soft)" : "var(--surface)",
                        }}
                      >
                        <input type="radio" value={opt.value} {...register("role")} style={{ display: "none" }} />
                        <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, flexShrink: 0, borderRadius: 10, background: on ? "var(--accent)" : "var(--surface-2)", color: on ? "#fff" : "var(--accent)" }}>
                          <Icon name={opt.icon} size={21} fill={on ? 1 : 0} />
                        </span>
                        <span>
                          <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{opt.title}</span>
                          <span style={{ display: "block", marginTop: 2, fontSize: 12, lineHeight: 1.45, color: "var(--muted)" }}>{opt.desc}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
                <span style={{ width: 18, height: 18, borderRadius: 5, background: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                  <Icon name="check" size={14} color="#fff" />
                </span>
                <span>Pranoj <Link href="/terms" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Kushtet e përdorimit</Link> dhe Politikën e privatësisë.</span>
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rj-lift"
                style={{ marginTop: 4, padding: 14, borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", background: "var(--accent)", boxShadow: "0 12px 26px -12px rgba(189,90,45,.7)", opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? "Duke u regjistruar…" : "Krijo llogari falas"}
              </button>
            </form>

            <p style={{ margin: "22px 0 0", textAlign: "center", fontSize: 14, color: "var(--muted)" }}>
              Ke tashmë llogari? <Link href="/sign-in" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Kyçu</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 620px) {
          :global(.rj-auth-art) {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
