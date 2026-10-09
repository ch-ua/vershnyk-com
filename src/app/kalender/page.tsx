import {site} from "@/data/site";
import {logo} from "@/data/logo";

const days = Array.from({length:31},(_,i)=>i+1);
const startOffset = 3;

export default function Kalender(){
 return <main className="calendarPage">
  <header className="detailHeader">
   <a className="brand" href="/"><img src={logo} alt="VERSHNYK"/><span><strong>VERSHNYK</strong><small>HANDWERK & MONTAGE</small></span></a>
   <a className="homeLink" href="/">← Startseite</a>
   <div className="actions"><a className="loginButton" href="/admin">Увійти</a><a className="whatsapp" href={site.whatsapp}>◉ &nbsp; Anfrage über WhatsApp&nbsp; →</a></div>
  </header>
  <section className="calendarHero">
   <p className="hand">Terminplanung</p><h1>FREIE TERMINE.</h1>
   <p>Sehen Sie auf einen Blick, wann VERSHNYK verfügbar ist. Persönliche Termindaten bleiben privat.</p>
  </section>
  <section className="calendarWrap">
   <div className="calendarTop"><div><p className="eyebrow">VERFÜGBARKEIT</p><h2>Oktober 2026</h2></div><div className="calendarLegend"><span><i className="free"></i> FREI</span><span><i className="busy"></i> BELEGT</span></div></div>
   <div className="publicCalendar">
    {["Mo","Di","Mi","Do","Fr","Sa","So"].map(d=><b className="weekday" key={d}>{d}</b>)}
    {Array.from({length:startOffset},(_,i)=><span className="empty" key={"e"+i}/>)}
    {days.map(d=><div className="calendarDay" key={d}><strong>{d}</strong><span className="pending">—</span></div>)}
   </div>
   <div className="calendarNotice"><b>Google Kalender wird verbunden</b><p>Die Seite ist vorbereitet. Sobald die Synchronisierung aktiv ist, erscheinen hier automatisch nur FREI oder BELEGT – keine Namen, Adressen oder Termindetails.</p></div>
   <div className="calendarCta"><div><p className="hand">Termin anfragen</p><h2>PASSENDEN TAG GEFUNDEN?</h2><p>Senden Sie kurz Arbeit, Fotos und Adresse über WhatsApp. Der Termin gilt erst nach Bestätigung.</p></div><a className="heroWa calendarWa" href={site.whatsapp}><span>über WhatsApp<br/><small>anfragen</small></span> →</a></div>
  </section>
 </main>
}