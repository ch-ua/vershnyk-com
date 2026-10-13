"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {site} from "@/data/site";
import {logo} from "@/data/logo";
import YouTubeFeed from "@/app/components/YouTubeFeed";
import InstagramFeed from "@/app/components/InstagramFeed";
import imageManifest from "@/data/image-manifest.json";

type Lang="es"|"en";
const T={
 es:{
  sub:"MONTAJE & INTERIORES",nav:["SERVICIOS","PROYECTOS","CÓMO FUNCIONA"],account:"Mi cuenta",
  hand:"Su profesional para montaje e interiores",hero:["IDEAS.","MONTAJE.","RESULTADOS."],intro:"Montaje profesional, adaptación y puesta a punto de viviendas en Málaga y Costa del Sol.",
  price:"desde 35 €",priceSub:"por hora (neto)",priceMeta:"según el tipo y alcance del trabajo",ask:"Solicitar ahora",via:"por WhatsApp",
  serviceHead:"Nuestros servicios",all:"TODO DE UNA SOLA MANO",
  services:[
   ["MONTAJE DE MUEBLES",["Montaje de muebles y armarios","Sistemas IKEA y otros fabricantes","Ajustes y adaptaciones de carpintería"]],
   ["MONTAJE DE COCINAS",["Montaje completo de cocinas","Encimeras, ajustes y adaptaciones","IKEA, Nobilia, Schüller y otros"]],
   ["CARPINTERÍA & A MEDIDA",["Adaptaciones de madera","Soluciones empotradas y a medida","Acabados y ajustes precisos"]],
   ["PLADUR & INTERIORES",["Tabiques y revestimientos","Falsos techos","Acabados interiores"]],
   ["REFORMA INTERIOR",["Adaptación y renovación de espacios","Suelos y superficies decorativas","Trabajos complementarios del proyecto"]],
   ["PUESTA A PUNTO DE VIVIENDAS",["Preparación para vivir o alquilar","Montaje y ajustes coordinados","Una sola persona de contacto"]]
  ],
  region:"ZONA DE SERVICIO",regionText:"Málaga y Costa del Sol.",appointment:"CITA",appointmentText:"Disponibilidad y cita previa confirmación.",whatsapp:"WHATSAPP",whatsappText:"Envíe fotos y detalles del proyecto directamente.",
  ytHand:"Desde el taller y los proyectos",yt:"VERSHNYK EN YOUTUBE",ytText:"Trabajos, montajes y proyectos reales.",moreYT:"Más en YouTube →",
  igHand:"Más del día a día",ig:"VERSHNYK EN INSTAGRAM",igText:"Detalles y trabajos actuales.",moreIG:"Más en Instagram →",
  how:"Así funciona",process:"DE LA CONSULTA A LA EJECUCIÓN",steps:["01  Elegir el trabajo","02  Enviar fotos y dirección","03  Acordar la cita","04  Ejecución"],
  closeHand:"Fácil. Personal. Directo.",close:"¿QUÉ HAY QUE HACER?",write:"Escribir por WhatsApp →",legal:["Aviso legal","Privacidad","Condiciones","Desistimiento"],switch:"EN"
 },
 en:{
  sub:"INSTALLATION & INTERIORS",nav:["SERVICES","PROJECTS","HOW IT WORKS"],account:"My account",
  hand:"Your professional for installation & interiors",hero:["IDEAS.","INSTALLATION.","RESULTS."],intro:"Professional installation, adaptation and property setup across Málaga and the Costa del Sol.",
  price:"from €35",priceSub:"per hour (net)",priceMeta:"depending on the type and scope of work",ask:"Enquire now",via:"via WhatsApp",
  serviceHead:"Our services",all:"EVERYTHING FROM ONE SOURCE",
  services:[
   ["FURNITURE ASSEMBLY",["Furniture and wardrobe assembly","IKEA systems and other manufacturers","Carpentry adjustments and adaptations"]],
   ["KITCHEN INSTALLATION",["Complete kitchen installation","Worktops, fitting and adaptations","IKEA, Nobilia, Schüller and others"]],
   ["CARPENTRY & BESPOKE",["Wood adaptations","Built-in and bespoke solutions","Precise finishing and adjustments"]],
   ["DRYWALL & INTERIORS",["Partitions and linings","Suspended ceilings","Interior finishing"]],
   ["INTERIOR RENOVATION",["Space adaptation and renovation","Flooring and decorative surfaces","Supporting work within the project"]],
   ["PROPERTY SETUP",["Preparation for living or rental","Coordinated assembly and adjustments","One point of contact"]]
  ],
  region:"SERVICE AREA",regionText:"Málaga and the Costa del Sol.",appointment:"APPOINTMENT",appointmentText:"Check availability; appointment after confirmation.",whatsapp:"WHATSAPP",whatsappText:"Send photos and project details directly.",
  ytHand:"From workshop & projects",yt:"VERSHNYK ON YOUTUBE",ytText:"Real work, installations and projects.",moreYT:"More on YouTube →",
  igHand:"More from everyday work",ig:"VERSHNYK ON INSTAGRAM",igText:"Current work and details.",moreIG:"More on Instagram →",
  how:"How it works",process:"FROM ENQUIRY TO COMPLETION",steps:["01  Choose the work","02  Send photos & address","03  Arrange the date","04  Completion"],
  closeHand:"Simple. Personal. Direct.",close:"WHAT NEEDS TO BE DONE?",write:"Message on WhatsApp →",legal:["Legal notice","Privacy","Terms","Cancellation"],switch:"ES"
 }
};
const pics=[imageManifest.furniture[0],imageManifest.kitchen[0],imageManifest.furniture[1]||imageManifest.furniture[0],imageManifest.renovation[0],imageManifest.renovation[1]||imageManifest.renovation[0],imageManifest.kitchen[1]||imageManifest.kitchen[0]];
export default function MalagaLanding({lang}:{lang:Lang}){
 const t=T[lang],other=lang==="es"?"/en":"/es"; const [slide,setSlide]=useState(0); const touch=useRef<number|null>(null);
 useEffect(()=>{const x=setInterval(()=>setSlide(v=>(v+1)%t.services.length),3000);return()=>clearInterval(x)},[t.services.length]);
 const move=(n:number)=>setSlide(v=>(v+n+t.services.length)%t.services.length);
 return <main className="site">
  <header className="header siteHeader">
   <Link className="brand" href={lang==="es"?"/es":"/en"}><img src={logo} alt="VERSHNYK"/><span><strong>VERSHNYK</strong><small>{t.sub}</small></span></Link>
   <div className="actions"><Link className="loginButton" href={other} aria-label={t.switch} title={t.switch} style={{width:"auto",padding:"0 12px",fontWeight:800,textDecoration:"none"}}>{t.switch}</Link><a className="ig" href={site.instagram} aria-label="Instagram">◎</a><a className="yt" href={site.youtube} aria-label="YouTube">▶</a><a className="wicon" href={site.whatsapp} aria-label="WhatsApp">◉</a></div>
  </header>
  <section className="hero" onTouchStart={e=>touch.current=e.touches[0].clientX} onTouchEnd={e=>{if(touch.current!==null&&Math.abs(e.changedTouches[0].clientX-touch.current)>35)move(e.changedTouches[0].clientX<touch.current?1:-1);touch.current=null}}>
   <div className="heroCopy"><p className="hand">{t.hand}</p><h1>{t.hero[0]}<br/>{t.hero[1]}<br/><span>{t.hero[2]}</span></h1><p className="intro">{t.intro}</p><div className="priceBlock"><div className="price"><b>{t.price}</b><span>{t.priceSub}</span></div><div className="priceMeta"><span>{t.priceMeta}</span></div></div><a className="heroWa" href={site.whatsapp}><span>◉</span><span>{t.ask}<br/><small>{t.via}</small></span><span>→</span></a></div>
   <div className="heroImage" style={{backgroundImage:`url("${pics[slide]}")`}}><button className="slideArrow prev" onClick={()=>move(-1)}>‹</button><button className="slideArrow next" onClick={()=>move(1)}>›</button><span className="jobTag">{t.services[slide][0]}</span></div>
   <div className="thumbs">{t.services.map((s,i)=><button key={s[0] as string} className={i===slide?"selected":""} onMouseEnter={()=>setSlide(i)} onClick={()=>setSlide(i)} style={{backgroundImage:`url("${pics[i]}")`}}>{s[0] as string}</button>)}</div>
  </section>
  <section className="serviceBottom contactStrip"><div className="contactStripItem"><b>⌖</b><h3>{t.region}</h3><p>{t.regionText}</p></div><div className="contactStripItem"><b>▦</b><h3>{t.appointment}</h3><p>{t.appointmentText}</p></div><a href={site.whatsapp} className="contactStripItem"><b>◉</b><h3>{t.whatsapp}</h3><p>{t.whatsappText}</p></a></section>
  <section id="services" className="services"><div className="sectionTitle"><p className="hand">{t.serviceHead}</p><h2>{t.all}</h2></div><div className="serviceGrid">{t.services.map((s,i)=><article key={s[0] as string}><div className="servicePhoto" style={{backgroundImage:`url("${pics[i]}")`}}></div><h3>{s[0] as string}</h3><ul>{(s[1] as string[]).map(x=><li key={x}>{x}</li>)}</ul></article>)}</div></section>
  <section className="socialMediaSection youtubeSection"><div className="mediaHead"><div><p className="hand">{t.ytHand}</p><h2>{t.yt}</h2><p>{t.ytText}</p></div><a href={site.youtube}>{t.moreYT}</a></div><YouTubeFeed/></section>
  <section className="socialMediaSection instagramSection"><div className="mediaHead"><div><p className="hand">{t.igHand}</p><h2>{t.ig}</h2><p>{t.igText}</p></div><a href={site.instagram}>{t.moreIG}</a></div><InstagramFeed/></section>
  <section className="process"><p className="hand">{t.how}</p><h2>{t.process}</h2><div>{t.steps.map(x=><span key={x}>{x}</span>)}</div></section>
  <section className="closing"><p className="hand">{t.closeHand}</p><h2>{t.close}</h2><a className="heroWa" href={site.whatsapp}>◉ &nbsp; {t.write}</a></section>
  <footer><div className="brand"><img src={logo} alt="VERSHNYK"/><span><strong>VERSHNYK</strong><small>{t.sub}</small></span></div><p>{t.hero.join(" ")}</p><nav><Link href={other}>{t.switch}</Link><a href="/impressum">{t.legal[0]}</a><a href="/datenschutz">{t.legal[1]}</a><a href="/agb">{t.legal[2]}</a><a href="/widerruf">{t.legal[3]}</a></nav></footer>
 </main>
}