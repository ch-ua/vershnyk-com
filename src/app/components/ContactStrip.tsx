import {site} from "@/data/site";

export default function ContactStrip(){
 return <section className="serviceBottom contactStrip">
  <a href="/einsatzgebiet" className="contactStripItem"><span className="mapPinIcon" aria-hidden="true"><i></i></span><h3>EINSATZGEBIET</h3><p>Bayern, Baden-Württemberg & Tirol. Ca. 200 km rund um Memmingen.</p></a>
  <a href="/kalender" className="contactStripItem"><b aria-hidden="true">▦</b><h3>TERMIN</h3><p>Verfügbarkeit ansehen, Termin nach Bestätigung.</p></a>
  <a href={site.whatsapp} className="contactStripItem"><b aria-hidden="true">◉</b><h3>WHATSAPP</h3><p>Fotos und Projektdetails direkt senden.</p></a>
 </section>;
}
