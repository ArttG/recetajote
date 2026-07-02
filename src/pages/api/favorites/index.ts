// /src/pages/api/favorites/index.ts — GET (të miat) + POST (toggle)
import type { NextApiRequest, NextApiResponse } from "next";
import { getFavoritesByUser, toggleFavorite } from "@/api/services/Favorite";
import { requireAuth } from "@/lib/apiAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireAuth(req, res);
  if (!session) return;

  const userId = session.user.id ?? session.user.email ?? "unknown";

  if (req.method === "GET") {
    try {
      const favorites = await getFavoritesByUser(userId);
      return res.status(200).json(favorites);
    } catch (error) {
      console.error("Gabim gjatë marrjes së favoriteve:", error);
      return res.status(500).json({ error: "Gabim gjatë marrjes së favoriteve" });
    }
  }

  if (req.method === "POST") {
    try {
      const { recipeId } = req.body ?? {};
      if (!recipeId) return res.status(400).json({ error: "recipeId mungon" });
      const result = await toggleFavorite(userId, recipeId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Gabim gjatë toggle të favoritit:", error);
      return res.status(500).json({ error: "Gabim gjatë toggle të favoritit" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Metoda ${req.method} nuk lejohet` });
}
