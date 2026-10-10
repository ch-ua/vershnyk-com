"use client";
import SiteHeader from "@/app/components/SiteHeader";
import {useEffect,useRef,useState} from "react";
import {site} from "@/data/site";
import GoogleReviews from "./components/GoogleReviews";
import InstagramFeed from "./components/InstagramFeed";
import YouTubeFeed from "./components/YouTubeFeed";

const logo="data:image/webp;base64,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";

const photos={
 garden:"https://aimbestmowing.com/_next/image?q=75&url=%2Fhedge-trimming-wide.png&w=3840",
 fence:"/images/zaun/Anthrazit-Metallzaun.jpg",
 kitchen:"https://prorenovationohio.com/assets/hero-home-DyClQh-Y.jpg",
 build:"https://media.hornbach.se/cms/nl/chke2-27/54d75079de4e7536438ff61fe1043d/carport5.jpg?size=992"
};

const fencePhotos=["/images/zaun/Anthrazit-Metallzaun.jpg","/images/zaun/Anthrazit-Metallzaun1.jpg","/images/zaun/Anthrazit-Metallzaun2.jpg"];

const slides=[
 {title:"GARTENPFLEGE",image:photos.garden},
 {title:"ZAUNMONTAGE",image:photos.fence},
 {title:"GARTENBAU & KONSTRUKTIONEN",image:photos.build},
 {title:"MÖBELMONTAGE",image:photos.kitchen},
 {title:"KÜCHENMONTAGE",image:photos.kitchen},
 {title:"RENOVIERUNG & INNENAUSBAU",image:photos.build}
];

export default function Home(){
 const [slide,setSlide]=useState(0);
 const [fencePhoto,setFencePhoto]=useState(fencePhotos[0]);
 const touchStart=useRef<number|null>(null);
 useEffect(()=>{const timer=window.setInterval(()=>setSlide(v=>(v+1)%slides.length),3000);return()=>window.clearInterval(timer)},[]);
 useEffect(()=>{if(slide===1)setFencePhoto(fencePhotos[Math.floor(Math.random()*fencePhotos.length)])},[slide]);
 const slideImage=(i:number)=>i===1?fencePhoto:slides[i].image;
 const move=(step:number)=>setSlide(v=>(v+step+slides.length)%slides.length);
 const endTouch=(x:number)=>{if(touchStart.current===null)return;const d=x-touchStart.current;if(Math.abs(d)>35)move(d<0?1:-1);touchStart.current=null};
 return <main className="site">
  <SiteHeader/>

  <section id="start" className="hero">
   <div className="heroCopy"><p className="hand">Ihr Handwerker<br/>für Haus und Garten</p><h1>IDEEN.<br/>MONTAGE.<br/><span>ERGEBNISSE.</span></h1><p className="intro">Zuverlässige Handwerksarbeiten<br/>zum fairen Stundenpreis – in Ihrer Region.</p><div className="price"><b>48 €</b><span>pro Stunde (netto)<small>zzgl. Fahrtkosten</small></span></div><a className="heroWa" href={site.whatsapp}>◉ &nbsp; <span>Jetzt anfragen<br/><small>über WhatsApp</small></span>&nbsp; →</a></div>
   <div className="heroImage" onTouchStart={e=>touchStart.current=e.touches[0].clientX} onTouchEnd={e=>endTouch(e.changedTouches[0].clientX)} style={{backgroundImage:`url("${slideImage(slide)}")`}}><button className="slideArrow prev" onClick={()=>move(-1)} aria-label="Vorheriges Bild">‹</button><button className="slideArrow next" onClick={()=>move(1)} aria-label="Nächstes Bild">›</button><div className="jobTag">{slides[slide].title}</div></div>
   <div className="thumbs">{slides.map((s,i)=><button key={s.title} className={i===slide?"selected":""} onClick={()=>setSlide(i)} style={{backgroundImage:`url("${slideImage(i)}")`}}>{s.title}</button>)}</div>
  </section>

  <section className="quick"><div><i>◷</i><p><b>48 € pro Stunde</b><small>zzgl. Fahrtkosten</small></p></div><div><i>⌖</i><p><b>Einsatzgebiet<br/>bis 200 km</b><small>(auf Anfrage auch weiter)</small></p></div><a className="quickLink" href="/kalender"><i>▦</i><p><b>Termine über<br/>Google Kalender</b><small>Kalender öffnen</small></p></a><div><i>◉</i><p><b>Kommunikation nur<br/>über WhatsApp</b><small>kein Telefon</small></p></div></section>

  <section id="leistungen" className="services"><div className="sectionTitle"><p className="hand">Unsere Leistungen</p><h2>ALLES AUS EINER HAND</h2></div><div className="serviceGrid">{site.serviceDetails.map((s,i)=>{const imgs=[photos.garden,photos.fence,photos.build,photos.kitchen,photos.kitchen,photos.build];return <article key={s.title} onClick={()=>{window.location.href="/leistungen/"+["gartenpflege","zaunmontage","gartenbau","moebelmontage","kuechenmontage","renovierung"][i]}} role="link" tabIndex={0}><div className="servicePhoto" style={{backgroundImage:`url("${imgs[i]}")`}}><span className="serviceIcon" aria-hidden="true">{["⌁","╫","⌂","▱","▦","◇"][i]}</span></div><h3>{s.title}</h3><ul>{s.items.map(x=><li key={x}>{x}</li>)}</ul></article>})}</div></section>

  <section className="triptych"><article className="areaCard"><div className="regionGraphic"><span>⌖</span><strong>200</strong><small>km Radius</small></div><div><p className="eyebrow">EINSATZGEBIET</p><h3>Unterwegs in Ihrer Region.</h3><p>Ich bin für Sie in einem Radius von <b>bis zu 200 km</b> unterwegs.</p><small>Auf Anfrage sind auch weiter entfernte Orte möglich.</small></div></article><article className="calendarCard"><div className="calendarIcon">▦</div><div><p className="eyebrow">VERFÜGBARKEIT</p><h3>Freie Termine auf einen Blick.</h3><p>Aktuelle Verfügbarkeit im Google Kalender ansehen.</p><div className="availability"><b>FREI</b><b className="busy">BELEGT</b><b>FREI</b></div><small>Keine Direktbuchung – Termin erst nach Bestätigung.</small><a className="textLink" href="/kalender">Kalender ansehen →</a></div></article><article id="kontakt" className="requestCard"><div className="waMark">◉</div><div><p className="eyebrow">ANFRAGE STELLEN</p><h3>Projekt kurz per WhatsApp senden.</h3><p>Beschreiben Sie die Arbeit und senden Sie bei Bedarf Fotos und Adresse mit.</p><a className="requestButton" href={site.whatsapp}>Über WhatsApp anfragen →</a><small>Kommunikation ausschließlich über WhatsApp.</small></div></article></section>

  <GoogleReviews />

  <section className="socialMediaSection youtubeSection">
    <div className="mediaHead"><div><p className="hand">Aus Werkstatt & Projekten</p><h2>VERSHNYK AUF YOUTUBE</h2><p>Einblicke in unsere Arbeiten, Montagen und Projekte.</p></div><a href={site.youtube} target="_blank" rel="noreferrer">Mehr auf YouTube →</a></div>
    <YouTubeFeed />
  </section>

  <section className="socialMediaSection instagramSection">
    <div className="mediaHead"><div><p className="hand">Mehr aus dem Alltag</p><h2>VERSHNYK AUF INSTAGRAM</h2><p>Kurze Einblicke in aktuelle Arbeiten und Details.</p></div><a href={site.instagram} target="_blank" rel="noreferrer">Mehr auf Instagram →</a></div>
    <InstagramFeed />
  </section>

  <section id="ablauf" className="process"><p className="hand">So funktioniert’s</p><h2>VON DER ANFRAGE ZUR AUSFÜHRUNG</h2><div><span><b>01</b>Arbeit wählen</span><span><b>02</b>Fotos & Adresse senden</span><span><b>03</b>Termin abstimmen</span><span><b>04</b>Ausführung</span></div></section>

  <section id="projekte" className="projects"><div className="sectionTitle"><p className="hand">Ausgeführte Arbeiten</p><h2>PROJEKTE</h2></div><div className="projectGrid"><figure style={{backgroundImage:`url("${photos.kitchen}")`}}><figcaption>KÜCHENMONTAGE</figcaption></figure><figure style={{backgroundImage:`url("${photos.fence}")`}}><figcaption>ZAUNMONTAGE</figcaption></figure><figure style={{backgroundImage:`url("${photos.build}")`}}><figcaption>GARTENKONSTRUKTIONEN</figcaption></figure></div></section>
  <section id="ueber" className="closing"><p className="hand">Einfach. Persönlich. Direkt.</p><h2>WAS MUSS GEMACHT WERDEN?</h2><a className="heroWa" href={site.whatsapp}>◉ &nbsp; Jetzt über WhatsApp schreiben&nbsp; →</a></section>
  <footer><div className="brand"><img src={logo} alt="VERSHNYK"/><span><strong>VERSHNYK</strong><small>HANDWERK & MONTAGE</small></span></div><p>Memmingen · Allgäu · bis 200 km</p><nav><a href={site.instagram}>Instagram</a><a href={site.youtube}>YouTube</a><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a></nav></footer>
 </main>
}