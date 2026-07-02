import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import type { GetServerSideProps } from "next";
import Icon from "@/components/shared/Icon";

interface FormValues {
  email: string;
  password: string;
}

interface Props {
  hasGoogle: boolean;
  hasFacebook: boolean;
}

// Kalojmë te klienti nëse OAuth provider-at janë të konfiguruar.
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {
      hasGoogle: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      hasFacebook: !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET),
    },
  };
};

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)", marginBottom: 7 };
const wrapStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, borderRadius: 11, padding: "13px 15px" };

export default function SignIn({ hasGoogle, hasFacebook }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setError("");
    const res = await signIn("credentials", { redirect: false, email: values.email, password: values.password });
    if (res?.error) {
      setError("Email ose fjalëkalim i pasaktë");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Head><title>Kyçu | RecetaJote</title></Head>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(24px,4vw,44px) clamp(16px,4vw,22px)" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: 24, overflow: "hidden", boxShadow: "var(--shadow-lg)", background: "var(--surface)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", minHeight: 600 }}>
          {/* Form side */}
          <div style={{ padding: "clamp(32px,5vw,56px) clamp(22px,4.5vw,60px)", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 520, margin: "0 auto", width: "100%" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 12, background: "var(--accent)", color: "#fff" }}>
                <Icon name="skillet" size={22} fill={1} />
              </span>
              <span className="font-serif" style={{ fontWeight: 600, fontSize: 23, color: "var(--ink)" }}>
                Receta<span style={{ color: "var(--accent)" }}>Jote</span>
              </span>
            </Link>
            <h1 className="font-serif" style={{ margin: "34px 0 0", fontSize: 38, fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>Mirë se u ktheve.</h1>
            <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--ink-2)" }}>Kyçu për të vazhduar te recetat e tua të preferuara.</p>

            {error && <div style={{ marginTop: 20, borderRadius: 10, background: "var(--danger-soft)", padding: "10px 14px", fontSize: 14, color: "var(--danger)" }}>{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 15 }}>
              <div>
                <label style={labelStyle}>Email</label>
                <div className="rj-input" style={wrapStyle}>
                  <Icon name="mail" size={19} color="var(--muted)" />
                  <input
                    type="email"
                    placeholder="ti@example.com"
                    style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14.5, color: "var(--ink)", fontFamily: "'Hanken Grotesk', sans-serif" }}
                    {...register("email", { required: "Email është i detyrueshëm" })}
                  />
                </div>
                {errors.email && <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--danger)" }}>{errors.email.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Fjalëkalimi</label>
                <div className="rj-input" style={wrapStyle}>
                  <Icon name="lock" size={19} color="var(--muted)" />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14.5, color: "var(--ink)", fontFamily: "'Hanken Grotesk', sans-serif" }}
                    {...register("password", { required: "Fjalëkalimi është i detyrueshëm" })}
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} aria-label="Shfaq fjalëkalimin" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "grid", placeItems: "center" }}>
                    <Icon name={showPw ? "visibility" : "visibility_off"} size={19} color="var(--muted)" />
                  </button>
                </div>
                {errors.password && <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--danger)" }}>{errors.password.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rj-lift"
                style={{ marginTop: 4, padding: 14, borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", background: "var(--accent)", boxShadow: "0 12px 26px -12px rgba(189,90,45,.7)", opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? "Duke u kyçur…" : "Kyçu"}
              </button>
            </form>

            {(hasGoogle || hasFacebook) && (
              <>
                <div style={{ margin: "22px 0", display: "flex", alignItems: "center", gap: 12, color: "var(--muted)", fontSize: 12 }}>
                  <span style={{ height: 1, flex: 1, background: "var(--border)" }} />ose<span style={{ height: 1, flex: 1, background: "var(--border)" }} />
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {hasGoogle && (
                    <button
                      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                      style={{ flex: 1, minWidth: 140, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, padding: 12, borderRadius: 11, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--ink)", background: "var(--bg)", border: "1px solid var(--border-2)" }}
                    >
                      <Icon name="g_translate" size={18} color="#db4437" />Google
                    </button>
                  )}
                  {hasFacebook && (
                    <button
                      onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
                      style={{ flex: 1, minWidth: 140, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, padding: 12, borderRadius: 11, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--ink)", background: "var(--bg)", border: "1px solid var(--border-2)" }}
                    >
                      <Icon name="public" size={18} color="#1877f2" />Facebook
                    </button>
                  )}
                </div>
              </>
            )}

            <p style={{ margin: "26px 0 0", textAlign: "center", fontSize: 14, color: "var(--muted)" }}>
              Nuk ke llogari? <Link href="/sign-up" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Regjistrohu falas</Link>
            </p>
          </div>

          {/* Image side */}
          <div className="rj-auth-art" style={{ position: "relative", overflow: "hidden", minHeight: 260 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=900&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(200deg,rgba(163,73,31,.32),rgba(20,12,6,.68))" }} />
            <div style={{ position: "absolute", left: 44, right: 44, bottom: 44 }}>
              <Icon name="format_quote" size={40} color="rgba(255,255,255,.9)" />
              <p className="font-serif" style={{ margin: "6px 0 0", fontSize: 26, fontWeight: 500, lineHeight: 1.3, color: "#fff", fontStyle: "italic" }}>
                Gatimi është dashuri që bëhet e dukshme.
              </p>
              <p style={{ margin: "14px 0 0", fontSize: 13.5, color: "rgba(255,255,255,.75)" }}>Bashkohu me mbi 12,000 gatues në RecetaJote.</p>
            </div>
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
