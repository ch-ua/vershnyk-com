"use client";
import SiteHeader from "@/app/components/SiteHeader";
import {useState} from "react";
import ServiceCategoryNav from "@/app/components/ServiceCategoryNav";
import {site} from "@/data/site";
const photos=["/images/bau/Innenausbau-Dachgeschoss-01.jpg","/images/bau/Renovierung-Spachtelarbeiten-01.jpg","/images/bau/Renovierung-Trockenbau-01.jpg","/images/bau/Renovierung-Trockenbau-02.jpg"];
const items=["Trockenbau","Spachtelarbeiten","Abgehängte Decken","Maler- & Tapezierarbeiten","Parkett & Laminat","Innenausbau & Anpassungen"];
export default function ServicePage(){
 const [hero]=useState(()=>photos[Math.floor(Math.random()*photos.length)]);
 return <main className="servicePage"><SiteHeader/>
 <section className="detailHero" style={{backgroundImage:`url("${hero}")`}}><div className="detailOverlay"><p className="hand">Handwerk & Montage</p><h1>RENOVIERUNG & INNENAUSBAU.</h1><p>Trockenbau, Spachtelarbeiten, Decken, Böden und dekorative Oberflächen aus einer Hand.</p><div className="detailHeroBottom"><div className="servicePrice"><b>48 €</b><span>pro Stunde<small>zzgl. Fahrtkosten</small></span></div><a className="detailWa" href={site.whatsapp}>Projekt über WhatsApp senden →</a></div></div></section>
 <section className="serviceIntro"><div><p className="hand">Was ich für Sie mache</p><h2>RÄUME NEU GEDACHT UND SAUBER AUSGEFÜHRT.</h2><p>Trockenbau, Spachtelarbeiten, Decken, Böden und dekorative Oberflächen aus einer Hand. Senden Sie mir Fotos, Adresse und eine kurze Beschreibung – Umfang und Termin stimmen wir direkt über WhatsApp ab.</p></div><div className="serviceFacts"><b>48 € / Std.</b><span>+ Fahrtkosten</span><b>WhatsApp</b><span>direkte Abstimmung</span><b>Termin wählen</b><span>freie Termine im Kalender ansehen</span></div></section>
 <section className="serviceList"><p className="hand">Leistungen</p><h2>LEISTUNGEN IM ÜBERBLICK</h2><div>{items.map((x,i)=><article key={x}><b>0{i+1}</b><span>{x}</span></article>)}</div></section>
 <section className="servicePhotoGallery"><div className="sectionTitle"><p className="hand">Ausgeführte Arbeiten</p><h2>EINBLICKE IN MEINE PROJEKTE</h2></div><div className="detailGalleryGrid">{photos.map((p,i)=><figure key={p} className={i===0?"wide":""} style={{backgroundImage:`url("${p}")`}} aria-label={"Projektfoto "+(i+1)}/>)}</div></section>
 <section className="serviceGallery"><div style={{backgroundImage:`url("${photos[photos.length-1]}")`}}></div><div className="galleryCopy"><p className="hand">Einfach anfragen</p><h2>FOTOS SENDEN.<br/>AUFWAND KLÄREN.<br/><span>TERMIN FINDEN.</span></h2><p>Schicken Sie Fotos, Adresse und eine kurze Beschreibung. So kann ich den Aufwand vorab besser einschätzen.</p><a className="heroWa" href={site.whatsapp}>Jetzt über WhatsApp anfragen →</a></div></section>
 <section className="serviceBottom"><div><b>⌖</b><h3>EINSATZGEBIET</h3><p>Rund um Memmingen / Allgäu, in der Regel bis 200 km. Weiter auf Anfrage.</p></div><div><b>▦</b><h3>TERMIN</h3><p>Verfügbarkeit ansehen, Termin nach Bestätigung.</p></div><div><b>◉</b><h3>WHATSAPP</h3><p>Fotos und Projektdetails direkt senden.</p></div></section>
 <ServiceCategoryNav/>
 <footer className="detailFooter"><div><strong>VERSHNYK</strong><small>HANDWERK & MONTAGE</small></div><p>© 2026 VERSHNYK · Handwerk & Montage</p><nav><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><a href="/">Startseite</a></nav></footer></main>
}