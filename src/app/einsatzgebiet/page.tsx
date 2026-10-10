import SiteHeader from "@/app/components/SiteHeader";
import ServiceCategoryNav from "@/app/components/ServiceCategoryNav";
import ContactStrip from "@/app/components/ContactStrip";

export default function Einsatzgebiet(){
 return <main className="servicePage areaPage">
  <SiteHeader/>
  <section className="legalHero areaHero"><div><p className="hand">Unterwegs für Ihr Projekt</p><h1>EINSATZGEBIET.</h1><p className="areaLead">Von Memmingen aus arbeite ich in Bayern, Baden-Württemberg und Tirol – in der Regel im Umkreis von etwa 200 km.</p></div></section>
  <section className="areaContent">
   <div className="areaText"><p className="eyebrow">MEMMINGEN · ALLGÄU</p><h2>BAYERN.<br/>BADEN-WÜRTTEMBERG.<br/>TIROL.</h2><p>Mein reguläres Einsatzgebiet liegt ungefähr <strong>200 km rund um Memmingen</strong>. Je nach Projekt, Umfang und Termin sind auch weiter entfernte Einsätze möglich.</p><p>Liegt Ihr Ort außerhalb dieses Bereichs? Senden Sie mir die Adresse und eine kurze Projektbeschreibung einfach per WhatsApp. Ich prüfe die Anfahrt individuell.</p></div>
   <div className="areaMapCard"><div className="areaMapVisual" role="img" aria-label="Schematische Karte des Einsatzgebiets rund um Memmingen"><div className="mapRoad r1"></div><div className="mapRoad r2"></div><div className="mapRoad r3"></div><div className="radiusCircle"><span className="mapPinIcon large"><i></i></span><strong>MEMMINGEN</strong><small>ca. 200 km</small></div><span className="mapLabel bayern">BAYERN</span><span className="mapLabel bw">BADEN-<br/>WÜRTTEMBERG</span><span className="mapLabel tirol">TIROL</span></div><p>Schematische Darstellung des Einsatzradius. Die tatsächliche Entfernung und Anfahrt werden für jede Anfrage individuell geprüft.</p></div>
  </section>
  <ContactStrip/>
  <ServiceCategoryNav/>
  <footer className="detailFooter"><div><strong>VERSHNYK</strong><small>HANDWERK &amp; MONTAGE</small></div><p>IDEEN. MONTAGE. ERGEBNISSE.</p><nav><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><a href="/">Startseite</a></nav></footer>
 </main>;
}
