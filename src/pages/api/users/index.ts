// /src/pages/api/users/index.ts — GET (të gjithë përdoruesit, vetëm admin)
import type { NextApiRequest, NextApiResponse } from "next";
import { getAllUsers } from "@/api/services/User";
import { requireAdmin } from "@/lib/apiAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const session = await requireAdmin(req, res);
    if (!session) return;
    try {
      const users = await getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Gabim gjatë marrjes së përdoruesve:", error);
      return res.status(500).json({ error: "Nuk mund të merren përdoruesit" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).json({ error: `Metoda ${req.method} nuk lejohet` });
}
