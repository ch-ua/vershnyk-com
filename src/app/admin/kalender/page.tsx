"use client";
import {useEffect,useMemo,useState} from "react";
const days=["Mo","Di","Mi","Do","Fr","Sa","So"];
const fmt=(d:Date)=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
export default function KalenderPage(){
 const [month,setMonth]=useState(()=>new Date(new Date().getFullYear(),new Date().getMonth(),1));
 const [busy,setBusy]=useState<string[]>([]);
 const [error,setError]=useState("");
 const [selected,setSelected]=useState("");
 useEffect(()=>{fetch("/api/calendar",{cache:"no-store"}).then(async r=>{if(!r.ok)throw Error("Google Calendar ist noch nicht verbunden.");return r.json()}).then(d=>{setBusy(d.busy||[]);setError("")}).catch(e=>setError(e.message))},[]);
 const now=new Date();const atCurrent=month.getFullYear()===now.getFullYear()&&month.getMonth()===now.getMonth();
 const first=(month.getDay()+6)%7;
 const count=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
 const cells=useMemo(()=>[...Array(first).fill(null),...Array.from({length:count},(_,i)=>i+1)],[first,count]);
 const current=new Date();current.setHours(0,0,0,0);
 const date=selected||fmt(new Date(month.getFullYear(),month.getMonth(),1));
 const googleDate=date.replace(/-/g,"");
 const createUrl="https://calendar.google.com/calendar/u/0/r/eventedit?text="+encodeURIComponent("VERSHNYK Termin")+"&dates="+googleDate+"T090000/"+googleDate+"T100000"+"&ctz=Europe%2FBerlin";
 return <section className="adminPanel adminCalendar"><div className="adminPanelHead"><div><p className="hand">Terminplanung</p><h1>Kalender</h1><small>Belegte Termine aus Google Calendar</small></div><a href={createUrl} target="_blank" rel="noopener noreferrer" className="calendarNewEvent">+ Termin in Google Calendar</a></div>
 {error&&<p role="status" className="calendarNotice">{error} Bitte GOOGLE_CALENDAR_ICAL_URL in Vercel prüfen.</p>}
 <div className="calendarMonthNav"><button disabled={atCurrent} onClick={()=>{if(atCurrent)return;setMonth(new Date(month.getFullYear(),month.getMonth()-1,1));setSelected("")}} aria-label="Vorheriger Monat">←</button><strong>{month.toLocaleDateString("de-DE",{month:"long",year:"numeric"})}</strong><button onClick={()=>{setMonth(new Date(month.getFullYear(),month.getMonth()+1,1));setSelected("")}} aria-label="Nächster Monat">→</button></div>
 <div className="calendarGrid">{days.map(d=><b key={d}>{d}</b>)}{cells.map((d,i)=>{if(!d)return <span key={"blank"+i}/>;const key=fmt(new Date(month.getFullYear(),month.getMonth(),d));const occupied=busy.includes(key);const weekend=i%7>=5;return <button key={key} type="button" onClick={()=>setSelected(key)} aria-pressed={selected===key} className={(occupied?"occupied ":"")+(weekend?"weekend ":"")+(selected===key?"selected":"")}>{d}</button>})}</div>
 <div className="calendarLegend"><span>● Frei</span><span>● Belegt</span><span>● Wochenende</span></div>
 <p className="calendarHint">Datum auswählen und „Termin in Google Calendar“ klicken. Neue Termine werden nach Aktualisierung des Google-Kalender-Feeds als belegt angezeigt.</p>
 </section>
}