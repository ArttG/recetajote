import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import useFetch from "@/hooks/useFetch";
import { Comment } from "@/api/models/Comment";
import Icon from "@/components/shared/Icon";

interface FormValues {
  text: string;
  rating: number;
}

const avatarColors = ["#8a5a3c", "#4f6b52", "#7a5490", "#3f6b8a", "#a3491f"];
const colorFor = (seed: string) => avatarColors[(seed?.charCodeAt(0) ?? 0) % avatarColors.length];
const initialsOf = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const Comments = ({ recipeId }: { recipeId: string }) => {
  const { data: session } = useSession();
  const { data: comments, refetch } = useFetch<Comment[]>(`/api/comments?recipeId=${recipeId}`);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { rating: 5 } });

  const onSubmit = async (values: FormValues) => {
    setError("");
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId, text: values.text, rating: Number(values.rating) }),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || "Gabim gjatë ruajtjes së komentit");
      return;
    }
    reset({ text: "", rating: 5 });
    refetch();
  };

  const handleDelete = async (cid: string) => {
    await fetch(`/api/comments/${cid}`, { method: "DELETE" });
    refetch();
  };

  const myId = session?.user?.id ?? session?.user?.email;

  return (
    <section style={{ marginTop: 48, paddingTop: 36, borderTop: "1px solid var(--border)" }}>
      <h2 className="font-serif" style={{ margin: 0, fontSize: 30, fontWeight: 500, color: "var(--ink)" }}>
        Komente &amp; Vlerësime
      </h2>

      {session ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ marginTop: 20, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, padding: 22 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 999, background: "var(--accent)", color: "#fff", fontSize: 15, fontWeight: 700 }}>
              {initialsOf(session.user?.name ?? session.user?.email ?? "P")}
            </span>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--muted)" }}>
              Vlerësimi juaj:
              <select
                {...register("rating")}
                className="rj-input"
                style={{ borderRadius: 9, padding: "6px 10px", fontSize: 14, fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} ⭐</option>
                ))}
              </select>
            </label>
          </div>
          <textarea
            {...register("text", { required: "Shkruaj një koment", minLength: { value: 3, message: "Të paktën 3 karaktere" } })}
            placeholder="Ndaje mendimin tënd për këtë recetë…"
            rows={3}
            className="rj-input"
            style={{ marginTop: 14, width: "100%", borderRadius: 12, padding: "13px 16px", fontSize: 14.5, fontFamily: "'Hanken Grotesk', sans-serif", resize: "vertical" }}
          />
          {errors.text && <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--danger)" }}>{errors.text.message}</p>}
          {error && <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--danger)" }}>{error}</p>}
          <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rj-lift"
              style={{ padding: "11px 20px", borderRadius: 11, border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", background: "var(--accent)", opacity: isSubmitting ? 0.6 : 1 }}
            >
              {isSubmitting ? "Duke ruajtur…" : "Publiko komentin"}
            </button>
          </div>
        </form>
      ) : (
        <p style={{ marginTop: 16, fontSize: 14.5, color: "var(--muted)" }}>
          <Link href="/sign-in" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Kyçu</Link> për të lënë një koment.
        </p>
      )}

      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 16 }}>
        {comments && comments.length === 0 && (
          <p style={{ fontSize: 14, color: "var(--muted)" }}>Ende nuk ka komente. Bëhu i pari!</p>
        )}
        {comments?.map((c) => (
          <div key={c._id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 999, background: colorFor(c.userName), color: "#fff", fontSize: 14, fontWeight: 700 }}>
                  {initialsOf(c.userName)}
                </span>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>{c.userName}</div>
                </div>
              </div>
              <span style={{ display: "inline-flex", color: "var(--gold)" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" size={16} fill={i < c.rating ? 1 : 0} color={i < c.rating ? "var(--gold)" : "var(--border-2)"} />
                ))}
              </span>
            </div>
            <p style={{ margin: "12px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-2)" }}>{c.text}</p>
            {(c.userId === myId || session?.user?.role === "admin") && (
              <button
                onClick={() => handleDelete(c._id as string)}
                className="rj-footlink"
                style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "var(--danger)", background: "none", border: "none", cursor: "pointer" }}
              >
                <Icon name="delete" size={14} /> Fshi
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Comments;
