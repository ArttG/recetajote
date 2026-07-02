// /src/pages/api/recipes/[id].ts (Ushtrimi Javor 7)
//  GET    — një recetë (publike)
//  PUT    — përditëso (admin çdo recetë; blogger vetëm të veten)
//  DELETE — fshi (admin çdo recetë; blogger vetëm të veten)
import type { NextApiRequest, NextApiResponse } from "next";
import { getRecipeById, updateRecipe, deleteRecipe } from "@/api/services/Recipe";
import { requireContributor } from "@/lib/apiAuth";
import type { Recipe } from "@/api/models/Recipe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID e pavlefshme" });
  }

  if (req.method === "GET") {
    try {
      const recipe = await getRecipeById(id);
      if (!recipe) return res.status(404).json({ error: "Receta nuk u gjet" });
      return res.status(200).json(recipe);
    } catch (error) {
      console.error("Gabim gjatë marrjes së recetës:", error);
      return res.status(500).json({ error: "Gabim gjatë marrjes së recetës" });
    }
  }

  if (req.method === "PUT" || req.method === "DELETE") {
    // Vetëm blogger-at dhe adminët hyjnë; më pas kontrollohet pronësia.
    const session = await requireContributor(req, res);
    if (!session) return;

    const recipe = await getRecipeById(id);
    if (!recipe) return res.status(404).json({ error: "Receta nuk u gjet" });

    // Blogger-i mund të prekë vetëm recetat e veta; admini i prek të gjitha.
    const isOwner = recipe.createdBy === session.user.email;
    if (session.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ error: "Mund të menaxhosh vetëm recetat e tua" });
    }

    if (req.method === "PUT") {
      try {
        // Mos lejo ndryshimin e autorit përmes trupit të kërkesës.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdBy, ...data } = (req.body ?? {}) as Partial<Recipe>;
        const result = await updateRecipe(id, data);
        return res.status(200).json({ updated: result.modifiedCount });
      } catch (error) {
        console.error("Gabim gjatë përditësimit:", error);
        return res.status(500).json({ error: "Gabim gjatë përditësimit" });
      }
    }

    try {
      const result = await deleteRecipe(id);
      return res.status(200).json({ deleted: result.deletedCount });
    } catch (error) {
      console.error("Gabim gjatë fshirjes:", error);
      return res.status(500).json({ error: "Gabim gjatë fshirjes" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Metoda ${req.method} nuk lejohet` });
}
