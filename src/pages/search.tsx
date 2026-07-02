import Head from "next/head";
import { useState, useMemo } from "react";
import useFetch from "@/hooks/useFetch";
import { Recipe } from "@/api/models/Recipe";
import RecipeCard from "@/components/shared/RecipeCard";
import Icon from "@/components/shared/Icon";

// Kërkim client-side me useState + filtrim (Ushtrimi Javor 4).
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { data: recipes, loading } = useFetch<Recipe[]>("/api/recipes");

  const results = useMemo(() => {
    if (!recipes) return [];
    const q = query.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [recipes, query]);

  return (
    <>
      <Head><title>Kërko | RecetaJote</title></Head>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "48px clamp(20px,4.5vw,56px) 54px" }}>
        <span className="font-mono" style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 500 }}>
          Kërko
        </span>
        <h1 className="font-serif" style={{ margin: "10px 0 0", fontSize: "clamp(32px,5vw,44px)", fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}>
          Kërko receta
        </h1>

        <div className="rj-input" style={{ marginTop: 24, maxWidth: 560, display: "flex", alignItems: "center", gap: 10, borderRadius: 13, padding: "13px 16px" }}>
          <Icon name="search" size={21} color="var(--muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kërko sipas emrit, përshkrimit ose kategorisë…"
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14.5, color: "var(--ink)", fontFamily: "'Hanken Grotesk', sans-serif" }}
          />
        </div>

        {loading ? (
          <p style={{ marginTop: 32, color: "var(--muted)" }}>Duke u ngarkuar…</p>
        ) : results.length === 0 ? (
          <p style={{ marginTop: 32, color: "var(--muted)" }}>Asnjë rezultat për &quot;{query}&quot;.</p>
        ) : (
          <>
            <div className="font-mono" style={{ marginTop: 20, fontSize: 13.5, color: "var(--muted)" }}>
              {results.length} {results.length === 1 ? "recetë" : "receta"}
            </div>
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 22 }}>
              {results.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
