import Head from "next/head";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/api/services/User";
import { User } from "@/api/models/User";
import Icon from "@/components/shared/Icon";

interface Props {
  user: Pick<User, "name" | "email" | "bio" | "image" | "role">;
}

interface FormValues {
  name: string;
  bio: string;
  image: string;
}

// SSR — të dhënat e përdoruesit (Ushtrimi Javor 5/9).
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user?.id) {
    return { redirect: { destination: "/sign-in", permanent: false } };
  }
  const dbUser = await getUserById(session.user.id);
  const user = {
    name: dbUser?.name ?? session.user.name ?? "",
    email: dbUser?.email ?? session.user.email ?? "",
    bio: dbUser?.bio ?? "",
    image: dbUser?.image ?? "",
    role: dbUser?.role ?? "user",
  };
  return { props: { user } };
};

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)", marginBottom: 7 };
const fieldStyle: React.CSSProperties = { width: "100%", borderRadius: 11, padding: "13px 15px", fontSize: 14.5, fontFamily: "'Hanken Grotesk', sans-serif" };

const roleLabel = (role?: string) =>
  role === "admin" ? "Administrator" : role === "blogger" ? "Blogger" : "Anëtar";

export default function Profile({ user }: Props) {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: user.name ?? "", bio: user.bio ?? "", image: user.image ?? "" },
  });

  const onSubmit = async (values: FormValues) => {
    setMessage("");
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setMessage(res.ok ? "Profili u përditësua ✅" : "Gabim gjatë përditësimit");
  };

  const initial = (user.name ?? user.email ?? "U").charAt(0).toUpperCase();

  return (
    <>
      <Head><title>Profili im | RecetaJote</title></Head>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px clamp(20px,4.5vw,56px) clamp(20px,4.5vw,56px)" }}>
        <h1 className="font-serif" style={{ margin: 0, fontSize: "clamp(30px,4.5vw,40px)", fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>
          Profili im
        </h1>

        {/* Identity card */}
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24, boxShadow: "var(--shadow-sm)" }}>
          <span className="font-serif" style={{ display: "grid", placeItems: "center", width: 76, height: 76, borderRadius: 22, background: "var(--accent)", color: "#fff", fontSize: 30, fontWeight: 600 }}>
            {initial}
          </span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="font-serif" style={{ fontSize: 24, fontWeight: 600, color: "var(--ink)" }}>{user.name || "Përdorues"}</div>
            <div style={{ marginTop: 4, display: "flex", gap: 18, flexWrap: "wrap", fontSize: 13.5, color: "var(--muted)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="mail" size={16} />{user.email}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="badge" size={16} />{roleLabel(user.role)}</span>
            </div>
          </div>
        </div>

        {/* Update form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 22, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 26, boxShadow: "var(--shadow-sm)" }}>
          <h2 className="font-serif" style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>Përditëso të dhënat</h2>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {message && <div style={{ borderRadius: 10, background: "var(--accent-soft)", padding: "10px 14px", fontSize: 14, color: "var(--accent-ink)" }}>{message}</div>}
            <div>
              <label style={labelStyle}>Emri</label>
              <input className="rj-input" style={fieldStyle} {...register("name", { required: true })} />
            </div>
            <div>
              <label style={labelStyle}>Bio</label>
              <textarea rows={3} className="rj-input" style={{ ...fieldStyle, minHeight: 64, resize: "vertical" }} placeholder="Diçka rreth teje…" {...register("bio")} />
            </div>
            <div>
              <label style={labelStyle}>URL e fotos</label>
              <input className="rj-input" style={fieldStyle} placeholder="https://…" {...register("image")} />
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rj-lift"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 22px", borderRadius: 11, border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14.5, fontWeight: 600, color: "#fff", background: "var(--accent)", opacity: isSubmitting ? 0.6 : 1 }}
              >
                <Icon name="save" size={19} />{isSubmitting ? "Duke ruajtur…" : "Ruaj ndryshimet"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
