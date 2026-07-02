import Head from "next/head";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { useMemo } from "react";
import { authOptions } from "@/lib/auth";
import { getRecipes } from "@/api/services/Recipe";
import { getAllUsers } from "@/api/services/User";
import { Recipe } from "@/api/models/Recipe";
import { User } from "@/api/models/User";
import RecipeManager from "@/components/RecipeManager";
import UserManager from "@/components/UserManager";
import Icon from "@/components/shared/Icon";

interface Props {
  initialRecipes: Recipe[];
  initialUsers: User[];
  currentUserId: string;
}

// SSR + mbrojtje: vetëm admin (Ushtrimi Javor 9). Middleware e mbron gjithashtu.
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || session.user.role !== "admin") {
    return { redirect: { destination: "/sign-in", permanent: false } };
  }
  const [initialRecipes, initialUsers] = await Promise.all([getRecipes(), getAllUsers()]);
  return { props: { initialRecipes, initialUsers, currentUserId: session.user.id ?? "" } };
};

export default function AdminPage({ initialRecipes, initialUsers, currentUserId }: Props) {
  const stats = useMemo(() => {
    const total = initialRecipes.length;
    const categories = new Set(initialRecipes.map((r) => r.category)).size;
    const bloggers = initialUsers.filter((u) => u.role === "blogger").length;
    return [
      { icon: "restaurant_menu", value: String(total), label: "Receta totale" },
      { icon: "category", value: String(categories), label: "Kategori aktive" },
      { icon: "group", value: String(initialUsers.length), label: "Përdorues" },
      { icon: "edit_note", value: String(bloggers), label: "Blogger-a" },
    ];
  }, [initialRecipes, initialUsers]);

  return (
    <>
      <Head><title>Paneli i Adminit | RecetaJote</title></Head>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px clamp(20px,4.5vw,56px) clamp(20px,4.5vw,56px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap" }}>
          <h1 className="font-serif" style={{ margin: 0, fontSize: "clamp(30px,4.5vw,40px)", fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>
            Paneli i Adminit
          </h1>
          <span className="font-mono" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent-ink)", background: "var(--accent-soft)", border: "1px solid var(--border-2)", padding: "5px 11px", borderRadius: 999 }}>
            <Icon name="shield_person" size={14} fill={1} />Admin
          </span>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 15.5, color: "var(--ink-2)" }}>
          Menaxho recetat, përdoruesit dhe komunitetin nga një vend i vetëm.
        </p>

        {/* Statistika */}
        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(168px,1fr))", gap: 16 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "18px 20px" }}>
              <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 11, background: "var(--accent-soft)", color: "var(--accent)" }}>
                <Icon name={s.icon} size={20} fill={1} />
              </span>
              <div className="font-serif" style={{ marginTop: 14, fontSize: 32, fontWeight: 600, color: "var(--ink)", lineHeight: 1 }}>{s.value}</div>
              <div style={{ marginTop: 3, fontSize: 13, color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Menaxhimi i recetave (të gjitha) */}
        <div style={{ marginTop: 26 }}>
          <RecipeManager initialRecipes={initialRecipes} refreshUrl="/api/recipes" />
        </div>

        {/* Menaxhimi i përdoruesve */}
        <div style={{ marginTop: 34 }}>
          <h2 className="font-serif" style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>
            Përdoruesit
          </h2>
          <p style={{ margin: "0 0 18px", fontSize: 14.5, color: "var(--ink-2)" }}>
            Ndrysho rolet ose hiq përdoruesit e regjistruar.
          </p>
          <UserManager initialUsers={initialUsers} currentUserId={currentUserId} />
        </div>
      </div>
    </>
  );
}
