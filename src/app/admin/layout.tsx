import Link from "next/link";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/anfragen", label: "Anfragen" },
  { href: "/admin/kalender", label: "Kalender" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f0e6", color: "#183d2d" }}>
      <header style={{ background: "#183d2d", color: "#fff", padding: "18px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <strong style={{ letterSpacing: ".12em" }}>VERSHNYK · ADMIN</strong>
          <nav style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            {nav.map((item) => <Link key={item.href} href={item.href} style={{ color: "#fff", textDecoration: "none" }}>{item.label}</Link>)}
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 24px 64px" }}>{children}</main>
    </div>
  );
}
