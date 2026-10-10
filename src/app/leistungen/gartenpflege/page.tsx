"use client";
import SiteHeader from "@/app/components/SiteHeader";
import ServiceCategoryNav from "@/app/components/ServiceCategoryNav";
import {useState} from "react";
import {site} from "@/data/site";
import imageManifest from "@/data/image-manifest.json";

const photos=imageManifest.garden;
const items=["Rasen mähen & pflegen","Hecken schneiden","Baum- und Strauchschnitt","Beete und Gartenflächen pflegen","Saisonale Gartenarbeiten","Aufräum- und Rückschnittarbeiten"];

export default function Gartenpflege(){
 const [hero]=useState(()=>photos[Math.floor(Math.random()*photos.length)]);
 return <main className="servicePage"><SiteHeader/>
 <section className="detailHero" style={{backgroundImage:`url("${hero}")`}}><div className="detailOverlay"><p className="hand">Haus & Garten</p><h1>GARTENPFLEGE.</h1><p>Zuverlässige Gartenpflege für private Grundstücke – sauber, direkt und unkompliziert.</p><div className="detailHeroBottom"><div className="servicePrice"><b>48 €</b><span>pro Stunde (netto)<small>zzgl. Fahrtkosten</small></span><em className="vatNote">57,12 € inkl. 19 % MwSt.</em></div><a className="detailWa" href={site.whatsapp}>Projekt über WhatsApp senden →</a></div></div></section>
 <section className="serviceIntro"><div><p className="hand">Was ich für Sie mache</p><h2>PFLEGE, DIE MAN SIEHT.</h2><p>Von regelmäßiger Pflege bis zum einmaligen Rückschnitt: Sie senden mir kurz, was gemacht werden soll, idealerweise mit Fotos. Danach klären wir Umfang und Termin direkt über WhatsApp.</p></div><div className="serviceFacts"><b>48 € netto / Std.</b><span>57,12 € inkl. 19 % MwSt. · zzgl. Fahrtkosten</span><b>WhatsApp</b><span>direkte Abstimmung</span><b>Termin wählen</b><span>freie Termine im Kalender ansehen</span></div></section>
 <section className="serviceList"><p className="hand">Leistungen</p><h2>GARTENPFLEGE IM ÜBERBLICK</h2><div>{items.map((x,i)=><article key={x}><b>0{i+1}</b><span>{x}</span></article>)}</div></section>
 <section className="servicePhotoGallery"><div className="sectionTitle"><p className="hand">Ausgeführte Arbeiten</p><h2>EINBLICKE IN MEINE PROJEKTE</h2></div><div className="detailGalleryGrid">{photos.map((photo,i)=><figure key={photo} className={i===0?"wide":""} style={{backgroundImage:`url("${photo}")`}} aria-label={"Gartenpflege Projekt "+(i+1)}/>)}</div></section>
 <section className="serviceGallery"><div style={{backgroundImage:`url("${photos[1]}")`}}></div><div className="galleryCopy"><p className="hand">Einfach anfragen</p><h2>FOTOS SENDEN.<br/>AUFWAND KLÄREN.<br/><span>TERMIN FINDEN.</span></h2><p>Schicken Sie Fotos, Adresse und eine kurze Beschreibung. So kann ich den Aufwand vorab besser einschätzen.</p><a className="heroWa" href={site.whatsapp}>Jetzt über WhatsApp anfragen →</a></div></section>
 <section className="serviceBottom"><div><b>⌖</b><h3>EINSATZGEBIET</h3><p>Rund um Memmingen / Allgäu, in der Regel bis 200 km. Weiter auf Anfrage.</p></div><div><b>▦</b><h3>TERMIN</h3><p>Verfügbarkeit ansehen, Termin nach Bestätigung.</p></div><div><b>◉</b><h3>WHATSAPP</h3><p>Fotos und Projektdetails direkt senden.</p></div></section>
 <ServiceCategoryNav/>
 <footer className="detailFooter"><div><strong>VERSHNYK</strong><small>HANDWERK & MONTAGE</small></div><p>© 2026 VERSHNYK · Handwerk & Montage</p><nav><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><a href="/">Startseite</a></nav></footer></main>
}