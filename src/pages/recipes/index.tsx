import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import RecipeCard from "@/components/shared/RecipeCard";
import Icon from "@/components/shared/Icon";
import { getRecipes } from "@/api/services/Recipe";
import { Recipe, RECIPE_CATEGORIES } from "@/api/models/Recipe";
import { categoryIcon } from "@/lib/categoryIcons";

interface Props {
  recipes: Recipe[];
  activeCategory: string | null;
}

// SSR — të dhëna gjithmonë të freskëta + filtrim sipas kategorisë (Ushtrimi Javor 5).
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const category = typeof context.query.category === "string" ? context.query.category : null;
  const recipes = await getRecipes(category ?? undefined);
  return { props: { recipes, activeCategory: category } };
};

export default function RecipesPage({ recipes, activeCategory }: Props) {
  return (
    <>
      <Head>
        <title>Recetat | RecetaJote</title>
        <meta name="description" content="Shfleto të gjitha recetat sipas kategorive." />
      </Head>

      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ padding: "48px clamp(20px,4.5vw,56px) 26px" }}>
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 500 }}>
            Biblioteka e recetave
          </span>
          <h1 className="font-serif" style={{ margin: "10px 0 0", fontSize: "clamp(34px,5vw,46px)", fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>
            Të gjitha recetat
          </h1>
          <p style={{ margin: "12px 0 0", fontSize: 16, color: "var(--ink-2)", maxWidth: 520 }}>
            Zgjidh një kategori, kërko me emër ose thjesht shfleto mes koleksionit tonë të recetave të zgjedhura.
          </p>

          <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/search"
              className="rj-navlink"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flex: 1,
                minWidth: 280,
                background: "var(--surface)",
                border: "1px solid var(--border-2)",
                borderRadius: 13,
                padding: "13px 16px",
                textDecoration: "none",
                color: "var(--muted)",
              }}
            >
              <Icon name="search" size={21} color="var(--muted)" />
              <span style={{ fontSize: 14.5, color: "var(--muted)" }}>Kërko sipas emrit ose përbërësit…</span>
            </Link>
          </div>

          <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 9 }}>
            <Link
              href="/recipes"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "9px 16px",
                borderRadius: 11,
                fontSize: 13.5,
                fontWeight: 600,
                textDecoration: "none",
                color: !activeCategory ? "#fff" : "var(--ink-2)",
                background: !activeCategory ? "var(--accent)" : "var(--surface)",
                border: !activeCategory ? "1px solid var(--accent)" : "1px solid var(--border)",
              }}
            >
              Të gjitha
            </Link>
            {RECIPE_CATEGORIES.map((cat) => {
              const on = activeCategory === cat;
              return (
                <Link
                  key={cat}
                  href={`/recipes?category=${encodeURIComponent(cat)}`}
                  className={on ? undefined : "rj-chip"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 16px",
                    borderRadius: 11,
                    fontSize: 13.5,
                    fontWeight: 600,
                    textDecoration: "none",
                    color: on ? "#fff" : "var(--ink-2)",
                    background: on ? "var(--accent)" : "var(--surface)",
                    border: on ? "1px solid var(--accent)" : "1px solid var(--border)",
                  }}
                >
                  <Icon name={categoryIcon(cat)} size={16} fill={1} color={on ? "#fff" : "var(--accent)"} />
                  {cat}
                </Link>
              );
            })}
          </div>

          <div className="font-mono" style={{ marginTop: 22, fontSize: 13.5, color: "var(--muted)" }}>
            {recipes.length} {recipes.length === 1 ? "recetë e gjetur" : "receta të gjetura"}
          </div>
        </div>

        {recipes.length === 0 ? (
          <p style={{ padding: "0 clamp(20px,4.5vw,56px) 54px", textAlign: "center", color: "var(--muted)" }}>
            Nuk ka receta për këtë kategori ende.
          </p>
        ) : (
          <div style={{ padding: "6px clamp(20px,4.5vw,56px) 54px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 22 }}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
