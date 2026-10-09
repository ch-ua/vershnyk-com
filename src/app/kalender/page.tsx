"use client";
import {site} from "@/data/site";
import {logo} from "@/data/logo";
import {useEffect,useMemo,useState} from "react";

const monthNames=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const pad=(n:number)=>String(n).padStart(2,"0");

export default function Kalender(){
 const today=new Date();
 const initial={year:today.getFullYear(),month:today.getMonth()};
 const [view,setView]=useState(initial);
 const [busy,setBusy]=useState<Set<string>|null>(null);
 const [error,setError]=useState(false);
 const current=useMemo(()=>({name:`${monthNames[view.month]} ${view.year}`,days:new Date(view.year,view.month+1,0).getDate(),offset:(new Date(view.year,view.month,1).getDay()+6)%7}),[view]);
 const days=Array.from({length:current.days},(_,i)=>i+1);
 useEffect(()=>{fetch("/api/calendar",{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error();return r.json()}).then(d=>setBusy(new Set(d.busy||[]))).catch(()=>setError(true));},[]);
 const move=(delta:number)=>setView(v=>{const d=new Date(v.year,v.month+delta,1);return {year:d.getFullYear(),month:d.getMonth()};});
 const dateKey=(d:number)=>`${view.year}-${pad(view.month+1)}-${pad(d)}`;
 return <main className="calendarPage">
  <header className="header">
   <a className="brand" href="/"><img src={logo} alt="VERSHNYK"/><span><strong>VERSHNYK</strong><small>HANDWERK & MONTAGE</small></span></a>
   <nav><a href="/">Startseite</a><a href="/#leistungen">Leistungen</a><a href="/#projekte">Projekte</a><a href="/#ablauf">So funktioniert’s</a><a href="/#ueber">Über mich</a><a href="/#kontakt">Kontakt</a></nav>
   <div className="actions"><a className="loginButton" href="/admin">Увійти</a><a className="ig" href={site.instagram} aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a><a className="yt" href={site.youtube} aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M3.5 7.2A3.5 3.5 0 0 1 6 4.7c4-.5 8-.5 12 0a3.5 3.5 0 0 1 2.5 2.5c.5 3.2.5 6.4 0 9.6a3.5 3.5 0 0 1-2.5 2.5c-4 .5-8 .5-12 0a3.5 3.5 0 0 1-2.5-2.5 31 31 0 0 1 0-9.6Z"/><path className="play" d="m10 9 5 3-5 3Z"/></svg></a><a className="wicon" href={site.whatsapp} aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M20 11.7a8 8 0 0 1-11.8 7l-4.2 1.1 1.1-4A8 8 0 1 1 20 11.7Z"/><path d="M8.2 7.8c.4-.4.8-.2 1 .2l.8 1.8c.1.3 0 .6-.2.8l-.6.7c.8 1.6 2 2.8 3.7 3.5l.7-.8c.2-.2.5-.3.8-.2l1.8.8c.4.2.5.6.3 1-.5.9-1.4 1.5-2.4 1.4-3.7-.4-7.2-3.8-7.5-7.5-.1-.7.2-1.3.6-1.7Z"/></svg></a><a className="whatsapp" href={site.whatsapp}>◉ &nbsp; Anfrage über WhatsApp&nbsp; →</a></div>
  </header>
  <section className="calendarHero"><p className="hand">Terminplanung</p><h1>FREIE TERMINE.</h1><p>Sehen Sie auf einen Blick, wann VERSHNYK verfügbar ist. Persönliche Termindaten bleiben privat.</p></section>
  <section className="calendarWrap">
   <div className="calendarTop"><div><p className="eyebrow">VERFÜGBARKEIT</p><h2>{current.name}</h2></div><div className="calendarTools"><div className="calendarLegend"><span><i className="free"></i> FREI</span><span><i className="busy"></i> BELEGT</span></div><div className="monthLinks"><button onClick={()=>move(-1)} aria-label="Vorheriger Monat">← {monthNames[(view.month+11)%12]}</button><button onClick={()=>move(1)} aria-label="Nächster Monat">{monthNames[(view.month+1)%12]} →</button></div></div></div>
   <div className="publicCalendar">
    {["Mo","Di","Mi","Do","Fr","Sa","So"].map(d=><b className="weekday" key={d}>{d}</b>)}
    {Array.from({length:current.offset},(_,i)=><span className="empty" key={"e"+i}/>)}
    {days.map(d=>{const isBusy=busy?.has(dateKey(d));return <div className="calendarDay" key={d}><strong>{d}</strong>{busy?<span className={isBusy?"busy":"free"}>{isBusy?"BELEGT":"FREI"}</span>:<span className="pending">—</span>}</div>})}
   </div>
   <div className="calendarNotice"><b>{error?"Kalender vorübergehend nicht verfügbar":"Automatisch mit Google Kalender synchronisiert"}</b><p>Es werden ausschließlich FREI oder BELEGT angezeigt – keine Namen, Adressen oder Termindetails.</p></div>
   <div className="calendarCta"><div><p className="hand">Termin anfragen</p><h2>PASSENDEN TAG GEFUNDEN?</h2><p>Senden Sie kurz Arbeit, Fotos und Adresse über WhatsApp. Der Termin gilt erst nach Bestätigung.</p></div><a className="heroWa calendarWa" href={site.whatsapp}><span>über WhatsApp<br/><small>anfragen</small></span> →</a></div>
  </section>
 </main>
}