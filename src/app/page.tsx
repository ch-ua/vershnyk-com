import {site} from "@/data/site";

export default function Home(){
  return <main>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="VERSHNYK Startseite"><span>V</span><strong>VERSHNYK</strong></a>
      <nav><a href="#leistungen">Leistungen</a><a href="#arbeiten">Arbeiten</a><a href="#gebiet">Einsatzgebiet</a><a href="#kontakt">Kontakt</a></nav>
      <a className="button buttonSmall" href="#kontakt">Anfrage senden</a>
    </header>

    <section id="top" className="hero">
      <div className="heroCopy">
        <p className="eyebrow">HANDWERK · MONTAGE · ALLGÄU</p>
        <h1>Eine Hand.<br/><em>Viele Lösungen.</em></h1>
        <p className="lead">Praktische Hilfe für Haus und Garten — persönlich, sauber und ohne unnötige Umwege.</p>
        <div className="heroActions"><a className="button" href="#kontakt">Projekt anfragen <span>↗</span></a><div className="rate"><small>Stundensatz</small><b>{site.rate}</b></div></div>
      </div>
      <div className="heroVisual" aria-hidden="true"><div className="line lineOne"/><div className="line lineTwo"/><div className="stamp">V<span>HANDWERK<br/>MEMMINGEN</span></div><div className="number">01</div></div>
      <div className="heroTags">{site.hero.map(x=><span key={x}>{x}</span>)}</div>
    </section>

    <section id="leistungen" className="services">
      <div className="sectionIntro"><p className="eyebrow">LEISTUNGEN</p><h2>Was kann ich<br/><em>für Sie tun?</em></h2><p>Von der kleinen Reparatur bis zum kompletten Montageprojekt. Ein Ansprechpartner, klare Abstimmung und praktische Lösungen.</p></div>
      <div className="serviceGrid">{site.services.map((x,i)=><article key={x}><div><small>{String(i+1).padStart(2,"0")}</small><span>↗</span></div><h3>{x}</h3><p>Saubere, durchdachte Umsetzung für Haus und Garten.</p></article>)}</div>
    </section>

    <section id="arbeiten" className="work">
      <p className="eyebrow">AUS DER PRAXIS</p><div className="workRow"><h2>VERSHNYK<br/><em>in Aktion.</em></h2><p>Aktuelle Arbeiten, Projekte und Einblicke gibt es direkt auf meinen Kanälen.</p></div>
      <div className="socialLinks"><a href={site.instagram}>Instagram <span>↗</span></a><a href={site.youtube}>YouTube <span>↗</span></a></div>
    </section>

    <section id="gebiet" className="area"><p className="eyebrow">EINSATZGEBIET</p><h2>Memmingen<br/><em>& Allgäu.</em></h2><p>Kurze Wege, persönliche Abstimmung und flexible Termine im regionalen Einsatzgebiet.</p></section>

    <section id="kontakt" className="contact"><div><p className="eyebrow">IHR PROJEKT</p><h2>Etwas im Kopf?<br/><em>Schreiben Sie mir.</em></h2></div><div className="contactSide"><p>Adresse, kurze Beschreibung und ein paar Fotos reichen für den Anfang. Danach klären wir Termin und Aufwand persönlich.</p><a className="button light" href="mailto:kontakt@vershnyk.com">Anfrage starten <span>↗</span></a></div></section>
    <footer><div className="brand"><span>V</span><strong>VERSHNYK</strong></div><p>Handwerk & Montage · Memmingen / Allgäu</p><a href="#top">Nach oben ↑</a></footer>
  </main>
}