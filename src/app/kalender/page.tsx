"use client";
import SiteHeader from "@/app/components/SiteHeader";
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
  <SiteHeader/>
  <section className="calendarHero"><p className="hand">Terminplanung</p><h1>FREIE TERMINE.</h1><p>Sehen Sie auf einen Blick, wann VERSHNYK verfügbar ist. Persönliche Termindaten bleiben privat.</p></section>
  <section className="calendarWrap">
   <div className="calendarTop"><div><p className="eyebrow">VERFÜGBARKEIT</p><h2>{current.name}</h2></div><div className="calendarTools"><div className="calendarLegend"><span><i className="free"></i> FREI</span><span><i className="busy"></i> BELEGT</span></div><div className="monthLinks">{(view.year>initial.year||view.month>initial.month)&&<button onClick={()=>move(-1)} aria-label="Vorheriger Monat">← {monthNames[(view.month+11)%12]}</button>}<button onClick={()=>move(1)} aria-label="Nächster Monat">{monthNames[(view.month+1)%12]} →</button></div></div></div>
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