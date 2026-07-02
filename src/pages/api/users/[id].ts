// /src/pages/api/users/[id].ts — PUT (ndrysho rolin) + DELETE (fshi) — vetëm admin.
import type { NextApiRequest, NextApiResponse } from "next";
import { updateUserRole, deleteUser } from "@/api/services/User";
import { requireAdmin } from "@/lib/apiAuth";
import { type Role } from "@/api/models/User";

const ALLOWED_ROLES: Role[] = ["user", "blogger", "admin"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID e pavlefshme" });
  }

  const session = await requireAdmin(req, res);
  if (!session) return;

  // Admini nuk mund ta modifikojë/fshijë vetveten (mbrojtje nga vetë-bllokimi).
  if (session.user.id === id) {
    return res.status(400).json({ error: "Nuk mund ta modifikosh llogarinë tënde nga këtu" });
  }

  if (req.method === "PUT") {
    const { role } = (req.body ?? {}) as { role?: string };
    if (!role || !ALLOWED_ROLES.includes(role as Role)) {
      return res.status(400).json({ error: "Rol i pavlefshëm" });
    }
    try {
      const result = await updateUserRole(id, role as Role);
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: "Përdoruesi nuk u gjet ose s'ndryshoi" });
      }
      return res.status(200).json({ updated: result.modifiedCount });
    } catch (error) {
      console.error("Gabim gjatë ndryshimit të rolit:", error);
      return res.status(500).json({ error: "Gabim gjatë ndryshimit të rolit" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const result = await deleteUser(id);
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Përdoruesi nuk u gjet" });
      }
      return res.status(200).json({ deleted: result.deletedCount });
    } catch (error) {
      console.error("Gabim gjatë fshirjes së përdoruesit:", error);
      return res.status(500).json({ error: "Gabim gjatë fshirjes" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ error: `Metoda ${req.method} nuk lejohet` });
}
