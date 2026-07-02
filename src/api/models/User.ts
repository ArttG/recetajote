// /src/api/models/User.ts (Ushtrimi Javor 9)
// Rolet:
//  - "user"    → vetëm-lexim: shfleton recetat, lë komente/vlerësime, ruan favoritet.
//  - "blogger" → CRUD vetëm mbi recetat e veta (të krijuara nga vetë ai).
//  - "admin"   → CRUD mbi të gjitha recetat + menaxhim i të gjithë përdoruesve.
export type Role = "user" | "blogger" | "admin";

// Rolet që një përdorues mund t'i zgjedhë vetë gjatë regjistrimit (admin përjashtohet).
export const SIGNUP_ROLES = ["user", "blogger"] as const;
export type SignupRole = (typeof SIGNUP_ROLES)[number];

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string; // hash — mund të mungojë për përdorues OAuth
  role: Role;
  image?: string;
  bio?: string;
  createdAt?: Date;
}
