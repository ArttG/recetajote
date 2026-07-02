// /src/pages/api/profile/role.ts — përdoruesi vendos vetë rolin e vet (user ↔ blogger).
// Nuk lejohet të bëhesh admin këtu; admini menaxhohet vetëm nga paneli i adminit.
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/apiAuth";
import { updateUserRole } from "@/api/services/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ error: `Metoda ${req.method} nuk lejohet` });
  }

  const session = await requireAuth(req, res);
  if (!session) return;

  const { role } = (req.body ?? {}) as { role?: string };
  if (role !== "user" && role !== "blogger") {
    return res.status(400).json({ error: "Rol i pavlefshëm" });
  }
  // Adminët nuk e ndryshojnë rolin përmes këtij endpoint-i.
  if (session.user.role === "admin") {
    return res.status(403).json({ error: "Admini nuk mund ta ndryshojë rolin këtu" });
  }
  const id = session.user.id;
  if (!id) return res.status(400).json({ error: "ID e përdoruesit mungon" });

  try {
    await updateUserRole(id, role);
    return res.status(200).json({ role });
  } catch (error) {
    console.error("Gabim gjatë ndryshimit të rolit:", error);
    return res.status(500).json({ error: "Gabim gjatë ndryshimit të rolit" });
  }
}
