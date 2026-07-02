// /src/components/RecipeManager/index.tsx
// Komponent i ripërdorshëm për menaxhimin e recetave (listë + formë shto/edito + fshirje).
// Përdoret nga paneli i adminit (të gjitha recetat) dhe nga studio e blogger-it (vetëm të tijat).
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Recipe, RECIPE_CATEGORIES } from "@/api/models/Recipe";
import Modal from "@/components/shared/Modal";
import Icon from "@/components/shared/Icon";

interface FormValues {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  cookTime: number;
  servings: number;
  ingredients: string; // të ndara me rresht
  steps: string; // të ndara me rresht
}

interface Props {
  initialRecipes: Recipe[];
  // Endpoint-i nga i cili rifreskohet lista pas ndryshimeve.
  // Admin: "/api/recipes"  ·  Blogger: "/api/recipes?mine=true"
  refreshUrl?: string;
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)", marginBottom: 6 };
const fieldStyle: React.CSSProperties = { width: "100%", borderRadius: 10, padding: "11px 13px", fontSize: 14, fontFamily: "'Hanken Grotesk', sans-serif" };

const emptyForm = { title: "", description: "", imageUrl: "", category: "", cookTime: 0, servings: 0, ingredients: "", steps: "" };

export default function RecipeManager({ initialRecipes, refreshUrl = "/api/recipes" }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Recipe | null>(null);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const refresh = async () => {
    const res = await fetch(refreshUrl);
    if (res.ok) setRecipes(await res.json());
  };

  const onSubmit = async (values: FormValues) => {
    setMessage("");
    const payload = {
      ...values,
      cookTime: Number(values.cookTime),
      servings: Number(values.servings),
      ingredients: values.ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
      steps: values.steps.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    const url = editingId ? `/api/recipes/${editingId}` : "/api/recipes";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setMessage(json.error || "Gabim");
      return;
    }
    setMessage(editingId ? "Receta u përditësua ✅" : "Receta u shtua ✅");
    reset(emptyForm);
    setEditingId(null);
    refresh();
  };

  const startEdit = (recipe: Recipe) => {
    setEditingId(recipe._id as string);
    setMessage("");
    reset({
      title: recipe.title,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      category: recipe.category,
      cookTime: recipe.cookTime,
      servings: recipe.servings ?? 0,
      ingredients: recipe.ingredients.join("\n"),
      steps: recipe.steps.join("\n"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/recipes/${deleteTarget._id}`, { method: "DELETE" });
    setDeleteTarget(null);
    refresh();
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 26, alignItems: "start" }}>
        {/* Lista e recetave */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
            <h2 className="font-serif" style={{ margin: 0, fontSize: 21, fontWeight: 600, color: "var(--ink)" }}>Recetat ekzistuese</h2>
            <span className="font-mono" style={{ fontSize: 12, color: "var(--muted)" }}>{recipes.length} gjithsej</span>
          </div>
          <div>
            {recipes.length === 0 && (
              <p style={{ padding: 22, fontSize: 14, color: "var(--muted)" }}>Ende nuk ka receta.</p>
            )}
            {recipes.map((r, i) => (
              <div key={r._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 22px", borderBottom: i === recipes.length - 1 ? "none" : "1px solid var(--border)" }}>
                <span style={{ display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: 11, background: "var(--accent-soft)", color: "var(--accent)", flexShrink: 0, overflow: "hidden" }}>
                  <Icon name="restaurant" size={24} fill={1} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.category} · {r.cookTime} min</div>
                </div>
                <button
                  onClick={() => startEdit(r)}
                  aria-label="Edito"
                  className="rj-iconbtn"
                  style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 9, border: "1px solid var(--border-2)", background: "var(--bg)", color: "var(--ink-2)", cursor: "pointer" }}
                >
                  <Icon name="edit" size={17} />
                </button>
                <button
                  onClick={() => setDeleteTarget(r)}
                  aria-label="Fshi"
                  style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 9, border: "1px solid var(--danger-border)", background: "var(--danger-soft)", color: "var(--danger)", cursor: "pointer" }}
                >
                  <Icon name="delete" size={17} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Forma shto / edito */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24, boxShadow: "var(--shadow-sm)" }}>
          <h2 className="font-serif" style={{ margin: 0, fontSize: 21, fontWeight: 600, color: "var(--ink)" }}>
            {editingId ? "Edito recetën" : "Shto recetë të re"}
          </h2>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            {message && <div style={{ borderRadius: 10, background: "var(--accent-soft)", padding: "10px 13px", fontSize: 13.5, color: "var(--accent-ink)" }}>{message}</div>}
            <div>
              <label style={labelStyle}>Titulli</label>
              <input className="rj-input" style={fieldStyle} placeholder="p.sh. Byrek me spinaq" {...register("title", { required: "Titulli është i detyrueshëm" })} />
              {errors.title && <p style={{ margin: "5px 0 0", fontSize: 12.5, color: "var(--danger)" }}>{errors.title.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Përshkrimi</label>
              <textarea rows={2} className="rj-input" style={{ ...fieldStyle, minHeight: 56, resize: "vertical" }} placeholder="Një përshkrim i shkurtër…" {...register("description", { required: true })} />
            </div>
            <div>
              <label style={labelStyle}>URL e imazhit</label>
              <input className="rj-input" style={fieldStyle} placeholder="https://…" {...register("imageUrl", { required: "Imazhi është i detyrueshëm" })} />
              {errors.imageUrl && <p style={{ margin: "5px 0 0", fontSize: 12.5, color: "var(--danger)" }}>{errors.imageUrl.message}</p>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10 }}>
              <div>
                <label style={labelStyle}>Kategoria</label>
                <select className="rj-input" style={fieldStyle} {...register("category", { required: true })}>
                  <option value="">Zgjidh…</option>
                  {RECIPE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Koha</label>
                <input type="number" className="rj-input" style={fieldStyle} placeholder="60" {...register("cookTime", { required: true, min: 1 })} />
              </div>
              <div>
                <label style={labelStyle}>Porcione</label>
                <input type="number" className="rj-input" style={fieldStyle} placeholder="6" {...register("servings")} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Përbërësit (një për rresht)</label>
              <textarea rows={3} className="rj-input" style={{ ...fieldStyle, minHeight: 64, resize: "vertical" }} placeholder={"500g petë\n400g spinaq"} {...register("ingredients", { required: true })} />
            </div>
            <div>
              <label style={labelStyle}>Hapat e përgatitjes (një për rresht)</label>
              <textarea rows={3} className="rj-input" style={{ ...fieldStyle, minHeight: 64, resize: "vertical" }} placeholder={"Skuq mishin…\nRrih kosin…"} {...register("steps", { required: true })} />
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rj-lift"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 13, borderRadius: 11, border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14.5, fontWeight: 600, color: "#fff", background: "var(--accent)", opacity: isSubmitting ? 0.6 : 1, flex: 1 }}
              >
                <Icon name={editingId ? "save" : "add"} size={19} />
                {isSubmitting ? "Duke ruajtur…" : editingId ? "Përditëso recetën" : "Shto recetën"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); reset(emptyForm); setMessage(""); }}
                  style={{ padding: "13px 18px", borderRadius: 11, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--ink)", background: "var(--bg)", border: "1px solid var(--border-2)" }}
                >
                  Anulo
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <Modal open={!!deleteTarget} title="Konfirmo fshirjen" onClose={() => setDeleteTarget(null)}>
        <span style={{ display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 13, background: "var(--danger-soft)", color: "var(--danger)" }}>
          <Icon name="warning" size={24} />
        </span>
        <p style={{ margin: "16px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-2)" }}>
          A je i sigurt që dëshiron të fshish <strong style={{ color: "var(--ink)" }}>{deleteTarget?.title}</strong>? Ky veprim nuk mund të kthehet.
        </p>
        <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={() => setDeleteTarget(null)}
            style={{ padding: "11px 18px", borderRadius: 11, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--ink)", background: "var(--bg)", border: "1px solid var(--border-2)" }}
          >
            Anulo
          </button>
          <button
            onClick={confirmDelete}
            style={{ padding: "11px 18px", borderRadius: 11, border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", background: "var(--danger)" }}
          >
            Fshi recetën
          </button>
        </div>
      </Modal>
    </>
  );
}
