// /src/pages/api/auth/register.ts (Ushtrimi Javor 9)
import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import { getUserByEmail, createUser } from "@/api/services/User";
import { SIGNUP_ROLES, type SignupRole } from "@/api/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Metoda ${req.method} nuk lejohet` });
  }

  const { name, email, password, role } = req.body ?? {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Ju lutem plotësoni të gjitha fushat" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Fjalëkalimi duhet të ketë të paktën 6 karaktere" });
  }

  // Përdoruesi mund të zgjedhë vetëm "user" ose "blogger"; roli "admin" nuk jepet kurrë
  // përmes regjistrimit. Çdo vlerë e panjohur bie prapa te "user".
  const selectedRole: SignupRole = SIGNUP_ROLES.includes(role) ? role : "user";

  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email-i është i regjistruar tashmë" });
    }

    const hashedPassword = await hash(password, 10);
    const result = await createUser({
      name,
      email,
      password: hashedPassword,
      role: selectedRole,
    });

    return res.status(201).json({
      message: "Përdoruesi u regjistrua me sukses",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Gabim gjatë regjistrimit:", error);
    return res.status(500).json({ error: "Gabim gjatë regjistrimit" });
  }
}
