import {site} from "@/data/site";

export default function Home(){
  return <main>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="VERSHNYK Startseite"><span>V</span><strong>VERSHNYK</strong></a>
      <nav><a href="#leistungen">Leistungen</a><a href="#preis">Preis</a><a href="#termine">Termine</a><a href="#referenzen">Referenzen</a></nav>
      <div className="headerSocial"><a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">IG</a><a href={site.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">YT</a></div>
    </header>

    <section id="top" className="hero">
      <div className="heroCopy">
        <p className="eyebrow">HANDWERK · MONTAGE · MEMMINGEN / ALLGÄU</p>
        <h1>Was muss<br/><em>gemacht werden?</em></h1>
        <p className="lead">Garten, Zaun, Möbel, Küche oder Renovierung — wählen Sie die passende Arbeit und senden Sie Ihre Anfrage unkompliziert per WhatsApp.</p>
        <div className="heroActions">
          <a className="button" href="#anfrage">WhatsApp Anfrage <span>↗</span></a>
          <a className="textLink" href="#termine">Freie Termine ansehen ↓</a>
        </div>
        <div id="preis" className="priceStrip"><div><small>ARBEITSZEIT</small><b>{site.rate}</b></div><div><small>EINSATZGEBIET</small><b>bis 200 km</b></div><div><small>KONTAKT</small><b>WhatsApp</b></div></div>
      </div>
      <div className="heroVisual" aria-hidden="true"><div className="line lineOne"/><div className="line lineTwo"/><div className="stamp">V<span>HANDWERK<br/>MEMMINGEN</span></div><div className="number">01</div></div>
    </section>

    <section id="leistungen" className="services">
      <div className="sectionIntro"><p className="eyebrow">LEISTUNGEN</p><h2>Finden Sie<br/><em>Ihre Arbeit.</em></h2><p>Direkt sehen, ob VERSHNYK die passende Leistung anbietet. Weitere Arbeiten können individuell angefragt werden.</p></div>
      <div className="serviceGrid">{site.serviceDetails.map((x,i)=><article key={x.title}><div><small>{String(i+1).padStart(2,"0")}</small><span>↗</span></div><h3>{x.title}</h3><p>{x.text}</p><a href="#anfrage">Diese Arbeit anfragen →</a></article>)}</div>
    </section>

    <section id="termine" className="availability">
      <div><p className="eyebrow">VERFÜGBARKEIT</p><h2>Wann passt<br/><em>es für Sie?</em></h2><p>Hier werden freie Zeitfenster angezeigt. Ein Termin wird erst nach persönlicher Bestätigung verbindlich.</p></div>
      <div className="calendarCard"><div className="calendarHead"><strong>Freie Termine</strong><span>Kalender</span></div><div className="calendarPlaceholder"><b>Google Kalender</b><p>Die Live-Verfügbarkeit wird hier eingebunden.</p></div><a className="button" href="#anfrage">Termin anfragen <span>↗</span></a></div>
    </section>

    <section id="referenzen" className="proof">
      <div><p className="eyebrow">VERTRAUEN</p><h2>Erst ansehen.<br/><em>Dann entscheiden.</em></h2></div>
      <div className="proofCards"><a href={site.instagram} target="_blank" rel="noreferrer"><small>PROJEKTE & EINBLICKE</small><strong>Instagram</strong><span>↗</span></a><a href={site.youtube} target="_blank" rel="noreferrer"><small>ARBEITEN IN AKTION</small><strong>YouTube</strong><span>↗</span></a><div><small>KUNDENSTIMMEN</small><strong>Google Bewertungen</strong><span>★</span></div></div>
    </section>

    <section id="anfrage" className="contact"><div><p className="eyebrow">ANFRAGE</p><h2>Foto. Adresse.<br/><em>Kurz beschreiben.</em></h2></div><div className="contactSide"><p>Senden Sie über WhatsApp Ihre Adresse, eine kurze Beschreibung und Fotos. Danach klären wir Aufwand, Fahrtkosten und einen passenden Termin.</p><div className="button disabled">WhatsApp öffnen <span>↗</span></div><small>Die WhatsApp-Direktverknüpfung wird nach Hinterlegung der Geschäftsnummer aktiviert.</small></div></section>

    <footer><div className="brand"><span>V</span><strong>VERSHNYK</strong></div><div className="footerLinks"><a href={site.instagram}>Instagram</a><a href={site.youtube}>YouTube</a><a href="#impressum">Impressum</a><a href="#datenschutz">Datenschutz</a></div><p>Handwerk & Montage · Memmingen / Allgäu</p></footer>
  </main>
}