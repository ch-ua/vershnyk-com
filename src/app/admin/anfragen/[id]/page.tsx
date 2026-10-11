import Link from "next/link";
import {notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {markViewed,updateRequest} from "../actions";
export default async function RequestDetails({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{saved?:string}>}){
 const {id}=await params;const {saved}=await searchParams;
 const s=await createClient();
 const {data:r,error}=await s.from("requests").select("*").eq("id",id).single();
 if(error||!r)notFound();
 if(!r.viewed_at)await markViewed(id);
 const {data:photos, error:photoError}=await s.from("request_photos").select("path").eq("request_id",id);
 if(photoError)console.error("Request photo lookup failed",photoError.message);
 const photoUrls=await Promise.all((photos||[]).map(async (p:{path:string})=>{
  const {data,error}=await s.storage.from("request-photos").createSignedUrl(p.path,3600);
  if(error)console.error("Photo URL failed",error.message);
  return data?.signedUrl||null;
 }));
 const date=(v:string)=>new Date(v).toLocaleString("de-DE",{timeZone:"Europe/Berlin",dateStyle:"medium",timeStyle:"short"});
 return <section className="adminPanel requestDetail"><Link href="/admin/anfragen">← Alle Anfragen</Link><h1>{r.service}</h1><div className="requestCurrentStatus"><span className={"requestStatus "+r.status}>{({new:"Neu",reviewing:"In Prüfung",offered:"Angebot erstellt",confirmed:"Bestätigt",done:"Erledigt",cancelled:"Storniert"} as Record<string,string>)[r.status]||r.status}</span></div><p>Eingegangen: <b>{date(r.created_at)}</b></p>
 <div className="requestDetailInfo"><p><b>Beschreibung</b><span>{r.description}</span></p><p><b>Adresse</b><span>{r.address}</span></p><p><b>Wunschtermin</b><span>{r.preferred_date||"Nicht angegeben"}</span></p><p><b>WhatsApp</b><span>{r.whatsapp_phone?<a href={"https://wa.me/"+r.whatsapp_phone.replace(/[^0-9]/g,"")} target="_blank" rel="noopener noreferrer">{r.whatsapp_phone} ↗</a>:"Nicht angegeben"}</span></p></div>
 {(photos?.length||0)>0&&<><h2>Fotos ({photos?.length})</h2><div className="requestPhotoGrid">{photoUrls.filter((x):x is string=>!!x).map((url,i)=><a href={url} key={i} target="_blank" rel="noopener noreferrer"><img src={url} alt={"Projektfoto "+(i+1)}/></a>)}</div></>}
 <h2>Auftrag verwalten</h2>{saved==="1"&&<div className="requestSavedNotice" role="status">✓ Änderungen erfolgreich gespeichert. Der aktuelle Status ist: <b>{({new:"Neu",reviewing:"In Prüfung",offered:"Angebot erstellt",confirmed:"Bestätigt",done:"Erledigt",cancelled:"Abgelehnt / Storniert"} as Record<string,string>)[r.status]||r.status}</b>.</div>}<form action={updateRequest} className="requestManageForm"><input type="hidden" name="id" value={id}/><fieldset className="requestStatusPicker"><legend>Status ändern</legend><div className="requestStatusButtons">{([{id:"new",label:"Neu"},{id:"reviewing",label:"In Prüfung"},{id:"offered",label:"Angebot"},{id:"confirmed",label:"Bestätigt"},{id:"done",label:"Erledigt"},{id:"cancelled",label:"Storniert"}] as const).map(item=><label key={item.id} className={"requestStatusChoice status-"+item.id}><input type="radio" name="status" value={item.id} defaultChecked={r.status===item.id}/><span>{item.label}</span></label>)}</div></fieldset><label>Antwort an den Kunden<textarea name="customer_reply" rows={4} defaultValue={r.customer_reply||""}/></label><label>Angebot – Leistungsbeschreibung<textarea name="offer_text" rows={5} defaultValue={r.offer_text||""}/></label><div className="requestFormRow"><label>Angebotspreis (€)<input name="offer_amount" type="number" step="0.01" min="0" defaultValue={r.offer_amount||""}/></label><label>Angebot gültig bis<input name="offer_valid_until" type="date" defaultValue={r.offer_valid_until||""}/></label></div><label>Interne Notiz<textarea name="admin_note" rows={3} defaultValue={r.admin_note||""}/></label><button type="submit">Änderungen speichern</button><p>Antwort und Angebot werden hier gespeichert. Der automatische E-Mail-Versand an den Kunden wird separat eingerichtet.</p></form></section>;
}
