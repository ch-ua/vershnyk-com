"use client";
import {useEffect,useMemo,useState} from "react";
const months=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const pad=(n:number)=>String(n).padStart(2,"0");
const berlinToday=()=>new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
export default function RequestDatePicker(){
 const today=berlinToday();
 const [view,setView]=useState(()=>{const [y,m]=today.split("-").map(Number);return {y,m:m-1}});
 const [busy,setBusy]=useState<Set<string>>(new Set());
 const [status,setStatus]=useState<"loading"|"ready"|"error">("loading");
 const [selected,setSelected]=useState("");
 useEffect(()=>{
  let active=true;
  const load=async()=>{
   try{
    const response=await fetch("/api/calendar",{cache:"no-store"});
    if(!response.ok)throw new Error("Calendar unavailable");
    const data=await response.json();
    if(!Array.isArray(data.busy))throw new Error("Invalid calendar response");
    if(active){setBusy(new Set(data.busy));setStatus("ready");}
   }catch{if(active){setStatus("error");setSelected("");}}
  };
  load();
  const timer=window.setInterval(load,60000);
  return ()=>{active=false;window.clearInterval(timer)};
 },[]);
 const info=useMemo(()=>({days:new Date(view.y,view.m+1,0).getDate(),offset:(new Date(view.y,view.m,1).getDay()+6)%7}),[view]);
 const key=(d:number)=>`${view.y}-${pad(view.m+1)}-${pad(d)}`;
 const move=(x:number)=>setView(v=>{const d=new Date(v.y,v.m+x,1);return {y:d.getFullYear(),m:d.getMonth()}});
 const firstMonth=today.slice(0,7);
 const currentMonth=`${view.y}-${pad(view.m+1)}`;
 const canGoBack=currentMonth>firstMonth;
 const isBlocked=(date:string)=>date<today||busy.has(date)||status!=="ready";
 useEffect(()=>{if(selected&&isBlocked(selected))setSelected("")},[selected,busy,status,today]);
 return <div className="requestDatePicker" style={{maxWidth:410,width:"100%",margin:"0 auto"}}>
  <input type="hidden" name="preferred_date" value={selected}/>
  <div className="requestDateTop" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
   <b>Wunschtermin <em>optional</em></b>
   <span style={{display:"flex",alignItems:"center",gap:8}}>
    <button type="button" disabled={!canGoBack} aria-label="Vorheriger Monat" onClick={()=>move(-1)}>←</button>
    <strong style={{fontSize:13,whiteSpace:"nowrap"}}>{months[view.m]} {view.y}</strong>
    <button type="button" aria-label="Nächster Monat" onClick={()=>move(1)}>→</button>
   </span>
  </div>
  <div className="requestMiniCalendar" style={{display:"grid",gridTemplateColumns:"repeat(7,minmax(0,1fr))",gap:4}}>
   {["Mo","Di","Mi","Do","Fr","Sa","So"].map(x=><small key={x} style={{textAlign:"center",fontSize:11}}>{x}</small>)}
   {Array.from({length:info.offset},(_,i)=><i key={"e"+i}/>)}
   {Array.from({length:info.days},(_,i)=>i+1).map(d=>{
    const k=key(d),blocked=isBlocked(k);
    return <button type="button" key={d} disabled={blocked} aria-label={k} aria-pressed={selected===k}
     className={selected===k?"selected":""}
     style={{width:"100%",minHeight:0,height:38,padding:0,fontSize:12,borderRadius:7}}
     onClick={()=>setSelected(selected===k?"":k)}>{d}</button>
   })}
  </div>
  {status==="loading"&&<p role="status" style={{fontSize:12}}>Kalender wird aktualisiert …</p>}
  {status==="error"&&<p role="alert" style={{fontSize:12,color:"#9b392c"}}>Termine derzeit nicht verfügbar. Bitte versuchen Sie es später erneut oder senden Sie die Anfrage ohne Wunschtermin.</p>}
  <div className="requestDateLegend"><span><i/> frei</span><span><i/> belegt</span>{selected&&<button type="button" onClick={()=>setSelected("")}>Auswahl löschen</button>}</div>
 </div>;
}