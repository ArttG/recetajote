import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getFavoritesByUser } from "@/api/services/Favorite";
import Icon from "@/components/shared/Icon";

interface Props {
  name: string;
  role: string;
  favoritesCount: number;
  commentsCount: number;
}

// SSR — të dhëna të freskëta specifike për përdoruesin (Ushtrimi Javor 5).
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user) {
    return { redirect: { destination: "/sign-in", permanent: false } };
  }
  const userId = session.user.id ?? session.user.email ?? "unknown";
  const favorites = await getFavoritesByUser(userId);
  return {
    props: {
      name: session.user.name ?? session.user.email ?? "Përdorues",
      role: session.user.role ?? "user",
      favoritesCount: favorites.length,
      commentsCount: 0,
    },
  };
};

const roleLabel = (role: string) =>
  role === "admin" ? "Administrator" : role === "blogger" ? "Blogger" : "Anëtar";

export default function Dashboard({ name, role, favoritesCount }: Props) {
  const firstName = name.split(" ")[0];

  return (
    <>
      <Head><title>Paneli im | RecetaJote</title></Head>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px clamp(20px,4.5vw,56px) clamp(20px,4.5vw,56px)" }}>
        <span className="font-mono" style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 500 }}>
          Mirë se erdhe
        </span>
        <h1 className="font-serif" style={{ margin: "10px 0 0", fontSize: "clamp(32px,5vw,42px)", fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>
          Përshëndetje, {firstName} 👋
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 16, color: "var(--ink-2)" }}>Ja çfarë po ndodh me llogarinë tënde sot.</p>

        {/* Stat cards */}
        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
          <div style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-2))", borderRadius: 18, padding: 24, color: "#fff", boxShadow: "var(--shadow-lg)" }}>
            <Icon name="favorite" size={26} fill={1} />
            <div className="font-serif" style={{ marginTop: 16, fontSize: 40, fontWeight: 600, lineHeight: 1 }}>{favoritesCount}</div>
            <div style={{ marginTop: 2, fontSize: 13.5, color: "rgba(255,255,255,.85)" }}>Receta të ruajtura</div>
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, padding: 24 }}>
            <span style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 12, background: "var(--accent-soft)", color: "var(--accent)" }}>
              <Icon name="verified_user" size={24} fill={1} />
            </span>
            <div className="font-serif" style={{ marginTop: 16, fontSize: 26, fontWeight: 600, lineHeight: 1.2, color: "var(--ink)" }}>{roleLabel(role)}</div>
            <div style={{ marginTop: 2, fontSize: 13.5, color: "var(--muted)" }}>Roli yt në platformë</div>
          </div>
          <Link href="/favorites" className="rj-card" style={{ display: "block", textDecoration: "none", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, padding: 24, boxShadow: "var(--shadow-sm)" }}>
            <span style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 12, background: "var(--accent-soft)", color: "var(--accent)" }}>
              <Icon name="bookmarks" size={24} fill={1} />
            </span>
            <div className="font-serif" style={{ marginTop: 16, fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>Favoritet e mia</div>
            <div style={{ marginTop: 2, fontSize: 13.5, color: "var(--muted)" }}>Menaxho recetat e ruajtura</div>
          </Link>
        </div>

        {/* Quick actions */}
        <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/recipes" className="rj-lift" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 22px", borderRadius: 12, textDecoration: "none", fontSize: 14.5, fontWeight: 600, color: "#fff", background: "var(--accent)" }}>
            <Icon name="restaurant" size={19} />Shfleto recetat
          </Link>
          <Link href="/profile" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 22px", borderRadius: 12, textDecoration: "none", fontSize: 14.5, fontWeight: 600, color: "var(--ink)", background: "var(--surface)", border: "1px solid var(--border-2)" }}>
            <Icon name="settings" size={19} />Përditëso profilin
          </Link>
          {role === "blogger" && (
            <Link href="/studio" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 22px", borderRadius: 12, textDecoration: "none", fontSize: 14.5, fontWeight: 600, color: "var(--accent)", background: "var(--surface)", border: "1px solid var(--accent)" }}>
              <Icon name="edit_note" size={19} />Studio ime
            </Link>
          )}
          {role === "admin" && (
            <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 22px", borderRadius: 12, textDecoration: "none", fontSize: 14.5, fontWeight: 600, color: "var(--accent)", background: "var(--surface)", border: "1px solid var(--accent)" }}>
              <Icon name="shield_person" size={19} />Paneli i adminit
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
