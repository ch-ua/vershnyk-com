"use client";
import SiteHeader from "@/app/components/SiteHeader";
import ServiceCategoryNav from "@/app/components/ServiceCategoryNav";
import ContactStrip from "@/app/components/ContactStrip";
import {useState} from "react";
import {site} from "@/data/site";
import imageManifest from "@/data/image-manifest.json";
const photos=imageManifest.kitchen;
const items=["Komplette Küchenmontage","IKEA, Schüller, Nobilia & weitere","Arbeitsplatten anpassen","Schränke & Fronten ausrichten","Demontage & Umbau","Montage von Einbaugeräten"];
export default function ServicePage(){
 const [hero]=useState(()=>photos[Math.floor(Math.random()*photos.length)]);
 return <main className="servicePage"><SiteHeader/>
 <section className="detailHero" style={{backgroundImage:`url("${hero}")`}}><div className="detailOverlay"><p className="hand">Handwerk & Montage</p><h1>KÜCHENMONTAGE.</h1><p>Komplette Küchenmontage, Anpassungen und saubere Detailarbeit – von einfach bis hochwertig.</p><div className="detailHeroBottom"><div className="priceBlock servicePriceBlock"><div className="servicePrice"><b>48 €</b><span>pro Stunde (netto)</span></div><div className="priceMeta"><span>57,12 € inkl. 19 % MwSt.</span><small>zzgl. Fahrtkosten</small></div></div><a className="detailWa" href={site.whatsapp}>Projekt über WhatsApp senden →</a></div></div></section>
 <section className="serviceIntro"><div><p className="hand">Was ich für Sie mache</p><h2>VON DER PLANUNG ZUR FERTIGEN KÜCHE.</h2><p>Komplette Küchenmontage, Anpassungen und saubere Detailarbeit – von einfach bis hochwertig. Senden Sie mir Fotos, Adresse und eine kurze Beschreibung – Umfang und Termin stimmen wir direkt über WhatsApp ab.</p></div><div className="serviceFacts"><b>48 € netto / Std.</b><span>57,12 € inkl. 19 % MwSt. · zzgl. Fahrtkosten</span><b>WhatsApp</b><span>direkte Abstimmung</span><b>Termin wählen</b><span>freie Termine im Kalender ansehen</span></div></section>
 <section className="serviceList"><p className="hand">Leistungen</p><h2>LEISTUNGEN IM ÜBERBLICK</h2><div>{items.map((x,i)=><article key={x}><b>0{i+1}</b><span>{x}</span></article>)}</div></section>
 <section className="servicePhotoGallery"><div className="sectionTitle"><p className="hand">Ausgeführte Arbeiten</p><h2>EINBLICKE IN MEINE PROJEKTE</h2></div><div className="detailGalleryGrid">{photos.map((p,i)=><figure key={p} className={i===0?"wide":""} style={{backgroundImage:`url("${p}")`}} aria-label={"Projektfoto "+(i+1)}/>)}</div></section>
 <section className="serviceGallery"><div style={{backgroundImage:`url("${photos[photos.length-1]}")`}}></div><div className="galleryCopy"><p className="hand">Einfach anfragen</p><h2>FOTOS SENDEN.<br/>AUFWAND KLÄREN.<br/><span>TERMIN FINDEN.</span></h2><p>Schicken Sie Fotos, Adresse und eine kurze Beschreibung. So kann ich den Aufwand vorab besser einschätzen.</p><a className="heroWa" href={site.whatsapp}>Jetzt über WhatsApp anfragen →</a></div></section>
 <ContactStrip/>
 <ServiceCategoryNav/>
 <footer className="detailFooter"><div><strong>VERSHNYK</strong><small>HANDWERK & MONTAGE</small></div><p>© 2026 VERSHNYK · Handwerk & Montage</p><nav><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><a href="/">Startseite</a></nav></footer></main>
}