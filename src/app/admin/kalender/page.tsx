const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export default function KalenderPage() {
  return (
    <>
      <p style={{ textTransform: "uppercase", letterSpacing: ".16em", fontSize: 12, opacity: .7 }}>Terminplanung</p>
      <h1 style={{ fontSize: 42, margin: "8px 0 10px" }}>Kalender</h1>
      <p style={{ lineHeight: 1.6, maxWidth: 760 }}>Interne Übersicht für FREI / BELEGT. Die Google-Calendar-Synchronisierung wird anschließend angeschlossen.</p>
      <div style={{ marginTop: 28, background: "#fff", border: "1px solid #d8d0bf", borderRadius: 18, padding: 22 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8 }}>
          {days.map((day) => <div key={day} style={{ fontWeight: 700, textAlign: "center", padding: 10 }}>{day}</div>)}
          {Array.from({ length: 35 }, (_, i) => <div key={i} style={{ minHeight: 68, border: "1px solid #e8e1d4", borderRadius: 10, padding: 8, opacity: i < 3 ? .25 : 1 }}>{i < 3 ? "" : i - 2}</div>)}
        </div>
      </div>
    </>
  );
}
