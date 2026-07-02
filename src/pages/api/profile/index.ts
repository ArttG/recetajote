// /src/pages/api/profile/index.ts — përditëson profilin e përdoruesit të kyçur.
import type { NextApiRequest, NextApiResponse } from "next";
import { updateUser } from "@/api/services/User";
import { requireAuth } from "@/lib/apiAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireAuth(req, res);
  if (!session) return;

  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ error: `Metoda ${req.method} nuk lejohet` });
  }

  const id = session.user.id;
  if (!id) return res.status(400).json({ error: "ID e përdoruesit mungon" });

  try {
    const { name, bio, image } = req.body ?? {};
    const result = await updateUser(id, { name, bio, image });
    return res.status(200).json({ updated: result.modifiedCount });
  } catch (error) {
    console.error("Gabim gjatë përditësimit të profilit:", error);
    return res.status(500).json({ error: "Gabim gjatë përditësimit" });
  }
}
