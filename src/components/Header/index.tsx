import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Icon from "@/components/shared/Icon";

const navLinks = [
  { href: "/", label: "Ballina", key: "home" },
  { href: "/recipes", label: "Recetat", key: "recipes" },
  { href: "/about", label: "Rreth Nesh", key: "about" },
  { href: "/contact", label: "Kontakt", key: "contact" },
];

const activeKey = (path: string) => {
  if (path === "/") return "home";
  if (path.startsWith("/recipes")) return "recipes";
  if (path.startsWith("/about")) return "about";
  if (path.startsWith("/contact")) return "contact";
  return "";
};

const Header = () => {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const active = activeKey(router.pathname);
  // NextAuth session carries a custom `role` field (see [...nextauth] callbacks).
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userName = session?.user?.name ?? session?.user?.email ?? "Përdorues";
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <nav
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "15px 26px",
          display: "flex",
          alignItems: "center",
          gap: 26,
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}
        >
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "var(--accent)",
              color: "#fff",
              boxShadow: "0 4px 12px -4px rgba(189,90,45,.5)",
            }}
          >
            <Icon name="skillet" size={22} fill={1} weight={500} />
          </span>
          <span
            className="font-serif"
            style={{ fontWeight: 600, fontSize: 23, letterSpacing: "-.015em", color: "var(--ink)" }}
          >
            Receta<span style={{ color: "var(--accent)" }}>Jote</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul
          className="hdr-nav"
          style={{ display: "flex", alignItems: "center", gap: 5, margin: "0 0 0 8px", padding: 0, listStyle: "none" }}
        >
          {navLinks.map((l) => {
            const on = l.key === active;
            return (
              <li key={l.href} style={{ listStyle: "none" }}>
                <Link
                  href={l.href}
                  className="rj-navlink"
                  style={{
                    display: "block",
                    padding: "8px 13px",
                    borderRadius: 10,
                    textDecoration: "none",
                    fontSize: 14.5,
                    fontWeight: on ? 600 : 500,
                    color: on ? "var(--accent)" : "var(--ink-2)",
                    background: on ? "var(--accent-soft)" : "transparent",
                  }}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 9 }}>
          <Link
            href="/search"
            className="hdr-search rj-navlink"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 11,
              padding: "8px 12px",
              minWidth: 170,
              textDecoration: "none",
              color: "var(--muted)",
            }}
          >
            <Icon name="search" size={19} color="var(--muted)" />
            <span style={{ fontSize: 13.5, color: "var(--muted)" }}>Kërko receta…</span>
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Ndrysho temën"
            className="rj-iconbtn"
            style={{
              display: "grid",
              placeItems: "center",
              width: 40,
              height: 40,
              borderRadius: 11,
              border: "1px solid var(--border)",
              background: "var(--surface-2)",
              color: "var(--ink)",
              cursor: "pointer",
            }}
          >
            <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} size={20} fill={1} />
          </button>

          <button
            data-burger
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="hdr-burger"
            style={{
              display: "none",
              placeItems: "center",
              width: 40,
              height: 40,
              borderRadius: 11,
              border: "1px solid var(--border)",
              background: "var(--surface-2)",
              color: "var(--ink)",
              cursor: "pointer",
            }}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>

          {session ? (
            <div className="hdr-auth" style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Link
                href="/favorites"
                aria-label="Favoritet"
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  border: "1px solid var(--border)",
                  background: "var(--surface-2)",
                  textDecoration: "none",
                  color: "var(--accent)",
                }}
              >
                <Icon name="favorite" size={20} fill={1} />
              </Link>
              {role === "blogger" && (
                <Link
                  href="/studio"
                  style={{
                    padding: "9px 14px",
                    borderRadius: 11,
                    textDecoration: "none",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--accent)",
                    border: "1px solid var(--accent)",
                  }}
                >
                  Studio
                </Link>
              )}
              {role === "admin" && (
                <Link
                  href="/admin"
                  style={{
                    padding: "9px 14px",
                    borderRadius: 11,
                    textDecoration: "none",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--accent)",
                    border: "1px solid var(--accent)",
                  }}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  textDecoration: "none",
                  padding: "5px 6px 5px 5px",
                  borderRadius: 999,
                  border: "1px solid var(--border)",
                  background: "var(--surface-2)",
                }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </span>
                <span data-username style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", paddingRight: 6 }}>
                  {session.user?.name?.split(" ")[0] ?? "Ti"}
                </span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Dil"
                className="rj-iconbtn"
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  border: "1px solid var(--border)",
                  background: "var(--surface-2)",
                  color: "var(--ink-2)",
                  cursor: "pointer",
                }}
              >
                <Icon name="logout" size={19} />
              </button>
            </div>
          ) : (
            <div className="hdr-auth" style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Link
                href="/sign-in"
                style={{
                  padding: "9px 15px",
                  borderRadius: 11,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink)",
                }}
              >
                Kyçu
              </Link>
              <Link
                href="/sign-up"
                className="rj-btn-accent"
                style={{
                  padding: "10px 17px",
                  borderRadius: 11,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  background: "var(--accent)",
                  boxShadow: "0 5px 14px -6px rgba(189,90,45,.6)",
                }}
              >
                Regjistrohu
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="hdr-mobile"
          style={{ borderTop: "1px solid var(--border)", padding: "12px 26px", display: "none" }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "10px 0",
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--ink)",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ marginTop: 8, paddingTop: 10, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
            {session ? (
              <>
                <Link href="/favorites" onClick={() => setOpen(false)} style={{ padding: "6px 0", fontSize: 14, textDecoration: "none", color: "var(--ink)" }}>Favoritet</Link>
                <Link href="/dashboard" onClick={() => setOpen(false)} style={{ padding: "6px 0", fontSize: 14, textDecoration: "none", color: "var(--ink)" }}>Paneli im</Link>
                {role === "blogger" && (
                  <Link href="/studio" onClick={() => setOpen(false)} style={{ padding: "6px 0", fontSize: 14, textDecoration: "none", color: "var(--accent)" }}>Studio</Link>
                )}
                {role === "admin" && (
                  <Link href="/admin" onClick={() => setOpen(false)} style={{ padding: "6px 0", fontSize: 14, textDecoration: "none", color: "var(--accent)" }}>Admin</Link>
                )}
                <button onClick={() => signOut({ callbackUrl: "/" })} style={{ textAlign: "left", padding: "6px 0", fontSize: 14, color: "var(--danger)", background: "none", border: "none", cursor: "pointer" }}>Dil</button>
              </>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setOpen(false)} style={{ padding: "6px 0", fontSize: 14, textDecoration: "none", color: "var(--ink)" }}>Kyçu</Link>
                <Link href="/sign-up" onClick={() => setOpen(false)} style={{ padding: "6px 0", fontSize: 14, textDecoration: "none", color: "var(--accent)" }}>Regjistrohu</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 860px) {
          :global(.hdr-nav),
          :global(.hdr-search) {
            display: none !important;
          }
          :global(.hdr-burger) {
            display: grid !important;
          }
          :global(.hdr-auth) {
            display: none !important;
          }
          :global(.hdr-mobile) {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
