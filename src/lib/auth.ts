// /src/lib/auth.ts — konfigurimi i NextAuth (Ushtrimi Javor 9)
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { getUserByEmail } from "@/api/services/User";

// Ndërtojmë provider-at në mënyrë dinamike: OAuth shtohet vetëm nëse ka çelësa.
const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Plotëso email dhe fjalëkalim");
      }
      const user = await getUserByEmail(credentials.email);
      if (!user || !user.password) throw new Error("Email nuk ekziston");

      const isValid = await compare(credentials.password, user.password);
      if (!isValid) throw new Error("Fjalëkalimi nuk është i saktë");

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image ?? null,
        role: user.role ?? "user",
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers,
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Bart `id` dhe `role` në token-in JWT.
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id;
        token.role = (user as { role?: string }).role ?? "user";
      }
      return token;
    },
    // Bart `id` dhe `role` nga token-i te session-i i klientit.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role ?? "user";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
