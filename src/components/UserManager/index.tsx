// /src/components/UserManager/index.tsx
// Menaxhimi i përdoruesve për adminin: ndryshimi i rolit + fshirja.
import { useState } from "react";
import { User, type Role } from "@/api/models/User";
import Modal from "@/components/shared/Modal";
import Icon from "@/components/shared/Icon";

interface Props {
  initialUsers: User[];
  currentUserId: string; // admini i kyçur — nuk mund të prekë vetveten
}

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "user", label: "Përdorues" },
  { value: "blogger", label: "Blogger" },
  { value: "admin", label: "Admin" },
];

const roleBadge: Record<Role, { bg: string; color: string; icon: string }> = {
  admin: { bg: "var(--accent-soft)", color: "var(--accent-ink)", icon: "shield_person" },
  blogger: { bg: "var(--accent-soft)", color: "var(--accent-ink)", icon: "edit_note" },
  user: { bg: "var(--surface-2)", color: "var(--ink-2)", icon: "person" },
};

const selectStyle: React.CSSProperties = { borderRadius: 9, padding: "8px 10px", fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif" };

export default function UserManager({ initialUsers, currentUserId }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  const changeRole = async (user: User, role: Role) => {
    setMessage("");
    const prev = users;
    // Përditësim optimist.
    setUsers((list) => list.map((u) => (u._id === user._id ? { ...u, role } : u)));
    const res = await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setMessage(json.error || "Gabim gjatë ndryshimit të rolit");
      setUsers(prev); // rikthe gjendjen
      return;
    }
    setMessage(`Roli i ${user.name || user.email} u ndryshua në "${role}" ✅`);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    const res = await fetch(`/api/users/${target._id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setMessage(json.error || "Gabim gjatë fshirjes");
      return;
    }
    setUsers((list) => list.filter((u) => u._id !== target._id));
    setMessage(`Përdoruesi ${target.name || target.email} u fshi ✅`);
  };

  return (
    <>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", gap: 12, flexWrap: "wrap" }}>
          <h3 className="font-serif" style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>Përdoruesit e regjistruar</h3>
          <span className="font-mono" style={{ fontSize: 12, color: "var(--muted)" }}>{users.length} gjithsej</span>
        </div>

        {message && (
          <div style={{ margin: "14px 22px 0", borderRadius: 10, background: "var(--accent-soft)", padding: "10px 13px", fontSize: 13.5, color: "var(--accent-ink)" }}>
            {message}
          </div>
        )}

        <div>
          {users.length === 0 && (
            <p style={{ padding: 22, fontSize: 14, color: "var(--muted)" }}>Ende nuk ka përdorues.</p>
          )}
          {users.map((u, i) => {
            const isSelf = u._id === currentUserId;
            const badge = roleBadge[(u.role as Role) ?? "user"] ?? roleBadge.user;
            const initials = (u.name || u.email || "U").charAt(0).toUpperCase();
            return (
              <div key={u._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 22px", borderBottom: i === users.length - 1 ? "none" : "1px solid var(--border)", flexWrap: "wrap" }}>
                <span style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 999, background: "var(--accent)", color: "#fff", flexShrink: 0, fontSize: 16, fontWeight: 700 }}>
                  {initials}
                </span>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>
                    {u.name || "—"}
                    {isSelf && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: "var(--muted)" }}>(ti)</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{u.email}</div>
                </div>

                <span className="font-mono" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase", color: badge.color, background: badge.bg, padding: "5px 10px", borderRadius: 999 }}>
                  <Icon name={badge.icon} size={13} fill={1} />{u.role ?? "user"}
                </span>

                <select
                  value={(u.role as Role) ?? "user"}
                  disabled={isSelf}
                  onChange={(e) => changeRole(u, e.target.value as Role)}
                  className="rj-input"
                  style={{ ...selectStyle, opacity: isSelf ? 0.5 : 1, cursor: isSelf ? "not-allowed" : "pointer" }}
                  aria-label={`Ndrysho rolin e ${u.name || u.email}`}
                >
                  {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>

                <button
                  onClick={() => setDeleteTarget(u)}
                  disabled={isSelf}
                  aria-label="Fshi përdoruesin"
                  style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 9, border: "1px solid var(--danger-border)", background: "var(--danger-soft)", color: "var(--danger)", cursor: isSelf ? "not-allowed" : "pointer", opacity: isSelf ? 0.4 : 1 }}
                >
                  <Icon name="delete" size={17} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={!!deleteTarget} title="Konfirmo fshirjen" onClose={() => setDeleteTarget(null)}>
        <span style={{ display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 13, background: "var(--danger-soft)", color: "var(--danger)" }}>
          <Icon name="warning" size={24} />
        </span>
        <p style={{ margin: "16px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-2)" }}>
          A je i sigurt që dëshiron të fshish përdoruesin <strong style={{ color: "var(--ink)" }}>{deleteTarget?.name || deleteTarget?.email}</strong>? Ky veprim nuk mund të kthehet.
        </p>
        <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={() => setDeleteTarget(null)}
            style={{ padding: "11px 18px", borderRadius: 11, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--ink)", background: "var(--bg)", border: "1px solid var(--border-2)" }}
          >
            Anulo
          </button>
          <button
            onClick={confirmDelete}
            style={{ padding: "11px 18px", borderRadius: 11, border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", background: "var(--danger)" }}
          >
            Fshi përdoruesin
          </button>
        </div>
      </Modal>
    </>
  );
}
