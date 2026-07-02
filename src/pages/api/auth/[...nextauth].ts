// /src/pages/api/auth/[...nextauth].ts (Ushtrimi Javor 9)
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export default NextAuth(authOptions);
