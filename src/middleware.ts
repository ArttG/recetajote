// /src/middleware.ts — mbrojtja e rrugëve sipas rolit (Ushtrimi Javor 9)
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;
      // /admin kërkon rol admin
      if (path.startsWith("/admin")) {
        return token?.role === "admin";
      }
      // /studio kërkon rol blogger ose admin
      if (path.startsWith("/studio")) {
        return token?.role === "blogger" || token?.role === "admin";
      }
      // /dashboard, /profile, /favorites kërkojnë vetëm të jesh i loguar
      return !!token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
});

export const config = {
  matcher: ["/admin/:path*", "/studio/:path*", "/dashboard/:path*", "/profile/:path*", "/favorites/:path*"],
};
