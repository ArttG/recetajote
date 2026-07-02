import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { getRecipeById, getAllRecipeIds } from "@/api/services/Recipe";
import { Recipe } from "@/api/models/Recipe";
import { useFavorites } from "@/contexts/FavoritesContext";
import Comments from "@/components/Comments";
import Icon from "@/components/shared/Icon";

interface Props {
  recipe: Recipe;
}

// getStaticPaths — para-gjeneron rrugët për recetat ekzistuese (Ushtrimi Javor 5).
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const ids = await getAllRecipeIds();
    return {
      paths: ids.map((id) => ({ params: { id } })),
      fallback: "blocking", // receta të reja gjenerohen on-demand
    };
  } catch {
    // DB e padisponueshme gjatë build-it — të gjitha rrugët gjenerohen on-demand.
    return { paths: [], fallback: "blocking" };
  }
};

// getStaticProps + revalidate — ISR: faqja rifreskohet çdo 60 sekonda.
export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const id = context.params?.id as string;
  const recipe = await getRecipeById(id);
  if (!recipe) return { notFound: true };
  return { props: { recipe }, revalidate: 60 };
};

export default function RecipeDetails({ recipe }: Props) {
  const { data: session } = useSession();
  const { isFavorite, toggleFavorite } = useFavorites();
  const id = recipe._id as string;
  const favorited = isFavorite(id);

  return (
    <>
      <Head>
        <title>{`${recipe.title} | RecetaJote`}</title>
        <meta name="description" content={recipe.description} />
      </Head>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "30px clamp(20px,4.5vw,56px) clamp(30px,4.5vw,60px)" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)", flexWrap: "wrap" }}>
          <Link href="/" className="rj-footlink" style={{ textDecoration: "none", color: "var(--muted)" }}>Ballina</Link>
          <Icon name="chevron_right" size={15} />
          <Link href="/recipes" className="rj-footlink" style={{ textDecoration: "none", color: "var(--muted)" }}>Recetat</Link>
          <Icon name="chevron_right" size={15} />
          <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>{recipe.title}</span>
        </div>

        {/* Hero */}
        <div style={{ marginTop: 20, position: "relative", height: 400, borderRadius: 22, overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={recipe.imageUrl} alt={recipe.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(20,12,6,.72),rgba(20,12,6,.05) 55%)" }} />
          <div style={{ position: "absolute", left: "clamp(20px,4vw,34px)", right: "clamp(20px,4vw,34px)", bottom: 30 }}>
            <span className="font-mono" style={{ display: "inline-block", fontSize: 11, fontWeight: 500, letterSpacing: ".13em", textTransform: "uppercase", color: "#fff", background: "var(--accent)", padding: "6px 13px", borderRadius: 999 }}>
              {recipe.category}
            </span>
            <h1 className="font-serif" style={{ margin: "14px 0 0", fontSize: "clamp(34px,6vw,52px)", fontWeight: 500, letterSpacing: "-.02em", color: "#fff", lineHeight: 1.02 }}>
              {recipe.title}
            </h1>
            <div style={{ marginTop: 14, display: "flex", gap: 20, color: "rgba(255,255,255,.92)", fontSize: 14, fontWeight: 500, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="schedule" size={19} />{recipe.cookTime} minuta
              </span>
              {recipe.servings ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Icon name="group" size={19} />{recipe.servings} porcione
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {session && (
            <button
              onClick={() => toggleFavorite(id)}
              className="rj-lift"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "12px 20px",
                borderRadius: 12,
                border: favorited ? "1px solid var(--accent)" : "none",
                cursor: "pointer",
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: 14.5,
                fontWeight: 600,
                color: favorited ? "var(--accent)" : "#fff",
                background: favorited ? "var(--accent-soft)" : "var(--accent)",
              }}
            >
              <Icon name="favorite" size={19} fill={favorited ? 1 : 0} />
              {favorited ? "E ruajtur" : "Ruaj recetën"}
            </button>
          )}
          {recipe.createdBy && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 999, background: "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 700 }}>
                {recipe.createdBy.charAt(0).toUpperCase()}
              </span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{recipe.createdBy}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Autor i recetës</div>
              </div>
            </div>
          )}
        </div>

        <p style={{ margin: "26px 0 0", fontSize: 17, lineHeight: 1.7, color: "var(--ink-2)", maxWidth: 720 }}>
          {recipe.description}
        </p>

        {/* Ingredients + steps */}
        <div style={{ marginTop: 38, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 34, alignItems: "start" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 26, boxShadow: "var(--shadow-sm)" }}>
            <h2 className="font-serif" style={{ margin: 0, fontSize: 24, fontWeight: 600, color: "var(--ink)" }}>Përbërësit</h2>
            {recipe.servings ? (
              <p style={{ margin: "4px 0 18px", fontSize: 13, color: "var(--muted)" }}>Për {recipe.servings} porcione</p>
            ) : (
              <div style={{ height: 18 }} />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recipe.ingredients.map((ing, i) => (
                <label
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 4px",
                    borderBottom: i === recipe.ingredients.length - 1 ? "none" : "1px solid var(--border)",
                    fontSize: 14.5,
                    color: "var(--ink-2)",
                  }}
                >
                  <span style={{ width: 20, height: 20, borderRadius: 6, border: "2px solid var(--border-2)", flexShrink: 0 }} />
                  {ing}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif" style={{ margin: "0 0 20px", fontSize: 24, fontWeight: 600, color: "var(--ink)" }}>Përgatitja</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {recipe.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 16 }}>
                  <span
                    className="font-serif"
                    style={{
                      flexShrink: 0,
                      display: "grid",
                      placeItems: "center",
                      width: 36,
                      height: 36,
                      borderRadius: 11,
                      background: "var(--accent-soft)",
                      color: "var(--accent)",
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                  >
                    {i + 1}
                  </span>
                  <p style={{ margin: 0, paddingTop: 6, fontSize: 15.5, lineHeight: 1.65, color: "var(--ink-2)" }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Comments recipeId={id} />
      </div>
    </>
  );
}
