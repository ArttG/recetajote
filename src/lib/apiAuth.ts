// /src/lib/apiAuth.ts — ndihmës për mbrojtjen e API routes sipas rolit.
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import type { Role } from "@/api/models/User";

export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  return getServerSession(req, res, authOptions);
}

/** Kthen session-in nëse përdoruesi është i loguar, përndryshe përgjigjet 401 dhe kthen null. */
export async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session?.user) {
    res.status(401).json({ error: "Duhet të jesh i kyçur" });
    return null;
  }
  return session;
}

/**
 * Kthen session-in nëse roli i përdoruesit është njëri prej `roles`,
 * përndryshe përgjigjet me 401 (i pakyçur) / 403 (pa leje) dhe kthen null.
 */
export async function requireRole(
  req: NextApiRequest,
  res: NextApiResponse,
  roles: Role[]
) {
  const session = await getSession(req, res);
  if (!session?.user) {
    res.status(401).json({ error: "Duhet të jesh i kyçur" });
    return null;
  }
  if (!roles.includes(session.user.role as Role)) {
    res.status(403).json({ error: "Nuk ke leje për këtë veprim" });
    return null;
  }
  return session;
}

/** Kthen session-in nëse përdoruesi është admin, përndryshe 401/403 dhe kthen null. */
export function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  return requireRole(req, res, ["admin"]);
}

/**
 * Kthen session-in nëse përdoruesi mund të krijojë përmbajtje (blogger ose admin).
 * Përdoret nga rrugët që lejojnë krijimin e recetave.
 */
export function requireContributor(req: NextApiRequest, res: NextApiResponse) {
  return requireRole(req, res, ["blogger", "admin"]);
}
