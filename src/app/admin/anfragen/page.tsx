export default function AnfragenPage() {
  return (
    <>
      <p style={{ textTransform: "uppercase", letterSpacing: ".16em", fontSize: 12, opacity: .7 }}>Kunden</p>
      <h1 style={{ fontSize: 42, margin: "8px 0 10px" }}>Anfragen</h1>
      <p style={{ lineHeight: 1.6, maxWidth: 760 }}>Hier werden die Anfragen aus dem VERSHNYK-Kontaktprozess zusammengeführt. Die Datenanbindung folgt im nächsten Schritt.</p>
      <div style={{ marginTop: 28, background: "#fff", border: "1px solid #d8d0bf", borderRadius: 18, overflow: "hidden" }}>
        <div style={{ padding: 18, borderBottom: "1px solid #e8e1d4", fontWeight: 700 }}>Aktuelle Anfragen</div>
        <div style={{ padding: 34, opacity: .65 }}>Noch keine verbundenen Kundendaten.</div>
      </div>
    </>
  );
}
