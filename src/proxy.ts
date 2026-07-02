// /src/proxy.ts — mbrojtja e rrugëve sipas rolit (Next.js 16: "middleware" → "proxy").
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Në prodhim (https) cookie-i i sesionit quhet `__Secure-next-auth.session-token`,
  // ndërsa lokalisht `next-auth.session-token`. E zbulojmë emrin e saktë nga vetë
  // cookie-t ekzistuese, që `getToken` të mos kthejë `null` në Vercel (bug-u që bënte
  // të gjitha rrugët e mbrojtura të ridrejtoheshin te /sign-in edhe kur ishe i kyçur).
  const secureCookie = req.cookies.has("__Secure-next-auth.session-token");
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie,
  });

  const role = token?.role;
  let allowed = !!token; // /dashboard, /profile, /favorites: mjafton të jesh i kyçur
  if (pathname.startsWith("/admin")) {
    allowed = role === "admin";
  } else if (pathname.startsWith("/studio")) {
    allowed = role === "admin" || role === "blogger";
  }

  if (!allowed) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/studio/:path*", "/dashboard/:path*", "/profile/:path*", "/favorites/:path*"],
};
