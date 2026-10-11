"use client";
import {useEffect,useMemo,useState} from "react";
const months=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const pad=(n:number)=>String(n).padStart(2,"0");
const berlinToday=()=>new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
function easter(year:number){const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k+7)%7,m=Math.floor((a+11*h+22*l)/451),n=h+l-7*m+114;return new Date(Date.UTC(year,Math.floor(n/31)-1,n%31+1))}
function bavarianHoliday(date:string){const [y,m,d]=date.split("-").map(Number);const fixed=new Set(["01-01","01-06","05-01","10-03","11-01","12-25","12-26"]);if(fixed.has(`${pad(m)}-${pad(d)}`))return true;const eas=easter(y).getTime();const current=Date.UTC(y,m-1,d);const days=Math.round((current-eas)/86400000);return [-2,1,39,50,60].includes(days)}
function weekend(date:string){const [y,m,d]=date.split("-").map(Number);return new Date(Date.UTC(y,m-1,d)).getUTCDay()%6===0}
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
 const isBlocked=(date:string)=>date<today||weekend(date)||bavarianHoliday(date)||busy.has(date)||status!=="ready";
 useEffect(()=>{if(selected&&isBlocked(selected))setSelected("")},[selected,busy,status,today]);
 return <div className="requestDatePicker" style={{maxWidth:410,width:"100%",margin:"0 auto"}}>
  <input type="hidden" name="preferred_date" value={selected}/>
  <div className="requestDateTop" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
   <b>Wunschtermin <em>optional</em></b>
   <span style={{display:"flex",alignItems:"center",gap:8}}>
    {canGoBack&&<button type="button" aria-label="Vorheriger Monat" onClick={()=>move(-1)} style={{fontSize:24,minWidth:36,minHeight:36}}>←</button>}
    <strong style={{fontSize:13,whiteSpace:"nowrap"}}>{months[view.m]} {view.y}</strong>
    <button type="button" aria-label="Nächster Monat" onClick={()=>move(1)} style={{fontSize:24,minWidth:36,minHeight:36}}>→</button>
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