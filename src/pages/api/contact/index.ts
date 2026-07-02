// /src/pages/api/contact/index.ts — ruan mesazhet e kontaktit në DB (Kërkesa 1).
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Metoda ${req.method} nuk lejohet` });
  }

  const { name, email, message } = req.body ?? {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Të gjitha fushat janë të detyrueshme" });
  }

  try {
    const db = await getDb();
    await db.collection("contactMessages").insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    });
    return res.status(201).json({ message: "Mesazhi u dërgua me sukses" });
  } catch (error) {
    console.error("Gabim gjatë ruajtjes së mesazhit:", error);
    return res.status(500).json({ error: "Gabim gjatë dërgimit të mesazhit" });
  }
}
