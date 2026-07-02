// /src/pages/api/recipes/index.ts (Ushtrimi Javor 7)
//  GET  — të gjitha recetat (publike) ose vetëm të miat (?mine=true, kërkon kyçje)
//  POST — krijo recetë të re (blogger ose admin)
import type { NextApiRequest, NextApiResponse } from "next";
import { getRecipes, getRecipesByAuthor, createRecipe } from "@/api/services/Recipe";
import { getSession, requireContributor } from "@/lib/apiAuth";
import { Recipe } from "@/api/models/Recipe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // ?mine=true → vetëm recetat e përdoruesit të kyçur (paneli i blogger-it).
      if (req.query.mine === "true") {
        const session = await getSession(req, res);
        if (!session?.user) {
          return res.status(401).json({ error: "Duhet të jesh i kyçur" });
        }
        const recipes = await getRecipesByAuthor(session.user.email ?? "");
        return res.status(200).json(recipes);
      }
      const category = typeof req.query.category === "string" ? req.query.category : undefined;
      const recipes = await getRecipes(category);
      return res.status(200).json(recipes);
    } catch (error) {
      console.error("Gabim gjatë marrjes së recetave:", error);
      return res.status(500).json({ error: "Nuk mund të merren recetat" });
    }
  }

  if (req.method === "POST") {
    // Blogger-at dhe adminët mund të krijojnë receta.
    const session = await requireContributor(req, res);
    if (!session) return; // requireContributor ka dërguar tashmë përgjigjen

    try {
      const body = req.body as Partial<Recipe>;
      if (!body.title || !body.description || !body.imageUrl || !body.category) {
        return res.status(400).json({ error: "Fushat e detyrueshme mungojnë" });
      }
      const result = await createRecipe({
        title: body.title,
        description: body.description,
        ingredients: body.ingredients ?? [],
        steps: body.steps ?? [],
        imageUrl: body.imageUrl,
        category: body.category,
        cookTime: Number(body.cookTime) || 0,
        servings: Number(body.servings) || undefined,
        createdBy: session.user.email ?? undefined,
      });
      return res.status(201).json(result);
    } catch (error) {
      console.error("Gabim gjatë krijimit të recetës:", error);
      return res.status(500).json({ error: "Gabim gjatë krijimit të recetës" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Metoda ${req.method} nuk lejohet` });
}
