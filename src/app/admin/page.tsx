import Link from "next/link";

const cards = [
  { title: "Anfragen", value: "0", text: "Neue Kundenanfragen verwalten", href: "/admin/anfragen" },
  { title: "Kalender", value: "—", text: "Freie und belegte Termine pflegen", href: "/admin/kalender" },
  { title: "Bewertungen", value: "später", text: "Google-Bewertungen im nächsten Schritt", href: "#" },
];

export default function AdminDashboard() {
  return (
    <>
      <p style={{ textTransform: "uppercase", letterSpacing: ".16em", fontSize: 12, opacity: .7 }}>VERSHNYK Verwaltung</p>
      <h1 style={{ fontSize: 42, margin: "8px 0 10px" }}>Dashboard</h1>
      <p style={{ maxWidth: 700, lineHeight: 1.6 }}>Zentrale Verwaltung für Kundenanfragen, Termine und später Bewertungen, Social Media und Website-Inhalte.</p>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18, marginTop: 32 }}>
        {cards.map((card) => (
          <Link key={card.title} href={card.href} style={{ background: "#fff", border: "1px solid #d8d0bf", borderRadius: 18, padding: 24, color: "inherit", textDecoration: "none" }}>
            <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: ".1em", opacity: .65 }}>{card.title}</div>
            <div style={{ fontSize: 36, fontWeight: 700, margin: "12px 0" }}>{card.value}</div>
            <div style={{ lineHeight: 1.5 }}>{card.text}</div>
          </Link>
        ))}
      </section>
    </>
  );
}
