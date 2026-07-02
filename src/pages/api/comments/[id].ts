// /src/pages/api/comments/[id].ts — DELETE (autori i vet ose admin)
import type { NextApiRequest, NextApiResponse } from "next";
import { getCommentById, deleteComment } from "@/api/services/Comment";
import { requireAuth } from "@/lib/apiAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== "string") return res.status(400).json({ error: "ID e pavlefshme" });

  if (req.method === "DELETE") {
    const session = await requireAuth(req, res);
    if (!session) return;
    try {
      const comment = await getCommentById(id);
      if (!comment) return res.status(404).json({ error: "Komenti nuk u gjet" });

      const isOwner = comment.userId === (session.user.id ?? session.user.email);
      const isAdmin = session.user.role === "admin";
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: "Nuk ke leje ta fshish këtë koment" });
      }

      const result = await deleteComment(id);
      return res.status(200).json({ deleted: result.deletedCount });
    } catch (error) {
      console.error("Gabim gjatë fshirjes së komentit:", error);
      return res.status(500).json({ error: "Gabim gjatë fshirjes" });
    }
  }

  res.setHeader("Allow", ["DELETE"]);
  return res.status(405).json({ error: `Metoda ${req.method} nuk lejohet` });
}
