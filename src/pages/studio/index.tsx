import Head from "next/head";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { useMemo } from "react";
import { authOptions } from "@/lib/auth";
import { getRecipesByAuthor } from "@/api/services/Recipe";
import { Recipe } from "@/api/models/Recipe";
import RecipeManager from "@/components/RecipeManager";
import Icon from "@/components/shared/Icon";

interface Props {
  initialRecipes: Recipe[];
}

// SSR + mbrojtje: vetëm blogger ose admin. Middleware e mbron gjithashtu.
// Blogger-i sheh vetëm recetat e veta (sipas `createdBy` = email-i i tij).
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const role = session?.user?.role;
  if (!session?.user || (role !== "blogger" && role !== "admin")) {
    return { redirect: { destination: "/sign-in", permanent: false } };
  }
  const initialRecipes = await getRecipesByAuthor(session.user.email ?? "");
  return { props: { initialRecipes } };
};

export default function StudioPage({ initialRecipes }: Props) {
  const stats = useMemo(() => {
    const total = initialRecipes.length;
    const categories = new Set(initialRecipes.map((r) => r.category)).size;
    const avgTime = total ? Math.round(initialRecipes.reduce((s, r) => s + (r.cookTime || 0), 0) / total) : 0;
    return [
      { icon: "restaurant_menu", value: String(total), label: "Recetat e mia" },
      { icon: "category", value: String(categories), label: "Kategori aktive" },
      { icon: "schedule", value: `${avgTime}`, label: "Koha mesatare (min)" },
    ];
  }, [initialRecipes]);

  return (
    <>
      <Head><title>Studio ime | RecetaJote</title></Head>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px clamp(20px,4.5vw,56px) clamp(20px,4.5vw,56px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap" }}>
          <h1 className="font-serif" style={{ margin: 0, fontSize: "clamp(30px,4.5vw,40px)", fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>
            Studio ime
          </h1>
          <span className="font-mono" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent-ink)", background: "var(--accent-soft)", border: "1px solid var(--border-2)", padding: "5px 11px", borderRadius: 999 }}>
            <Icon name="edit_note" size={14} fill={1} />Blogger
          </span>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 15.5, color: "var(--ink-2)" }}>
          Krijo, përditëso dhe menaxho recetat e tua për komunitetin.
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

        <div style={{ marginTop: 26 }}>
          <RecipeManager initialRecipes={initialRecipes} refreshUrl="/api/recipes?mine=true" />
        </div>
      </div>
    </>
  );
}
