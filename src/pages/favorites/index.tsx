import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getFavoritesByUser } from "@/api/services/Favorite";
import { getRecipeById } from "@/api/services/Recipe";
import { Recipe } from "@/api/models/Recipe";
import RecipeCard from "@/components/shared/RecipeCard";
import Icon from "@/components/shared/Icon";

interface Props {
  recipes: Recipe[];
}

// SSR + i mbrojtur (edhe nga middleware) — recetat e ruajtura të përdoruesit.
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user) {
    return { redirect: { destination: "/sign-in", permanent: false } };
  }
  const userId = session.user.id ?? session.user.email ?? "unknown";
  const favorites = await getFavoritesByUser(userId);
  const recipes = (
    await Promise.all(favorites.map((f) => getRecipeById(f.recipeId)))
  ).filter((r): r is Recipe => r !== null);

  return { props: { recipes } };
};

export default function FavoritesPage({ recipes }: Props) {
  return (
    <>
      <Head><title>Favoritet | RecetaJote</title></Head>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px clamp(20px,4.5vw,56px) clamp(20px,4.5vw,56px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 13, background: "var(--accent-soft)", color: "var(--accent)", flexShrink: 0 }}>
            <Icon name="favorite" size={24} fill={1} />
          </span>
          <div>
            <h1 className="font-serif" style={{ margin: 0, fontSize: "clamp(28px,4.5vw,38px)", fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>
              Recetat e mia të ruajtura
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 15, color: "var(--ink-2)" }}>
              Të gjitha recetat që ke shënuar si favorite, në një vend.
            </p>
          </div>
        </div>

        {recipes.length === 0 ? (
          <div style={{ marginTop: 48, textAlign: "center", color: "var(--muted)" }}>
            <p style={{ margin: 0 }}>Nuk ke ruajtur asnjë recetë ende.</p>
            <Link href="/recipes" style={{ marginTop: 8, display: "inline-block", color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              Shfleto recetat →
            </Link>
          </div>
        ) : (
          <div style={{ marginTop: 30, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 22 }}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
