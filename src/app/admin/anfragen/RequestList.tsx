"use client";
import Link from "next/link";
import {useState} from "react";
type RequestRow={id:string;service:string|null;description:string|null;address:string|null;status:string;created_at:string;viewed_at:string|null;whatsapp_phone:string|null};
const statuses=[["all","Alle"],["new","Neu"],["reviewing","In Prüfung"],["offered","Angebot"],["confirmed","Bestätigt"],["done","Erledigt"],["cancelled","Storniert"]] as const;
const names:Record<string,string>={new:"Neu",reviewing:"In Prüfung",offered:"Angebot",confirmed:"Bestätigt",done:"Erledigt",cancelled:"Storniert"};
export default function RequestList({rows}:{rows:RequestRow[]}){
 const [filter,setFilter]=useState("all");
 const shown=rows.filter(r=>filter==="all"||r.status===filter);
 return <section className="adminPanel adminListPanel"><div className="adminPanelHead"><div><h2>Alle Anfragen</h2><small>{shown.length} von {rows.length} Projekten</small></div></div>
 <div className="adminFilters" aria-label="Anfragen filtern">{statuses.map(([id,label])=><button key={id} type="button" onClick={()=>setFilter(id)} className={filter===id?"selected":""} aria-pressed={filter===id}>{label}{id==="new"&&rows.some(r=>r.status==="new"&&!r.viewed_at)?<span className="filterDot"/>:null}</button>)}</div>
 {shown.length?<div className="adminRequestList">{shown.map(r=><Link href={"/admin/anfragen/"+r.id} key={r.id} className={"requestRow statusRow-"+r.status}><div className="adminRequestIcon">{r.service?.slice(0,1)||"?"}</div><div className="requestRowBody"><b>{r.service}</b><small>{r.address}{r.whatsapp_phone?" · WhatsApp: "+r.whatsapp_phone:""}</small><p>{r.description}</p><time>{new Date(r.created_at).toLocaleString("de-DE",{timeZone:"Europe/Berlin",dateStyle:"short",timeStyle:"short"})}</time></div><span className={"requestStatus "+r.status}>{r.status==="new"&&r.viewed_at?"Gesehen":names[r.status]||r.status}</span></Link>)}</div>:<div className="adminEmpty"><b>Keine Anfragen in dieser Kategorie.</b></div>}</section>
}