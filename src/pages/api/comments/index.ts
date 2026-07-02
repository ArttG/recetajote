// /src/pages/api/comments/index.ts — GET (sipas recipeId) + POST (shto, i loguar)
import type { NextApiRequest, NextApiResponse } from "next";
import { getCommentsByRecipe, createComment } from "@/api/services/Comment";
import { requireAuth } from "@/lib/apiAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const recipeId = typeof req.query.recipeId === "string" ? req.query.recipeId : null;
    if (!recipeId) return res.status(400).json({ error: "recipeId mungon" });
    try {
      const comments = await getCommentsByRecipe(recipeId);
      return res.status(200).json(comments);
    } catch (error) {
      console.error("Gabim gjatë marrjes së komenteve:", error);
      return res.status(500).json({ error: "Gabim gjatë marrjes së komenteve" });
    }
  }

  if (req.method === "POST") {
    const session = await requireAuth(req, res);
    if (!session) return;
    try {
      const { recipeId, text, rating } = req.body ?? {};
      if (!recipeId || !text) {
        return res.status(400).json({ error: "recipeId dhe teksti janë të detyrueshëm" });
      }
      const result = await createComment({
        recipeId,
        userId: session.user.id ?? session.user.email ?? "unknown",
        userName: session.user.name ?? session.user.email ?? "Përdorues",
        text,
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      });
      return res.status(201).json(result);
    } catch (error) {
      console.error("Gabim gjatë krijimit të komentit:", error);
      return res.status(500).json({ error: "Gabim gjatë krijimit të komentit" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Metoda ${req.method} nuk lejohet` });
}
