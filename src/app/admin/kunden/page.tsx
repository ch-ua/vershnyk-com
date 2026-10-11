import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
export default async function KundenPage(){
 const s=await createClient();
 const {data:rows,error}=await s.from("requests").select("*").order("created_at",{ascending:false});
 if(error)console.error("Kunden query failed:",error.message);
 const groups=new Map<string,{name:string;email:string;phone:string;address:string;orders:any[]}>();
 for(const r of rows||[]){
  const name=String(r.customer_name||r.name||r.full_name||"Kunde");
  const email=String(r.customer_email||r.email||"");
  const phone=String(r.whatsapp_phone||r.phone||"");
  const address=String(r.address||"");
  const key=String(r.user_id||r.customer_id||email||phone||name+"|"+address);
  if(!groups.has(key))groups.set(key,{name,email,phone,address,orders:[]});
  groups.get(key)!.orders.push(r);
 }
 return <section className="adminPanel adminClients"><div className="adminPanelHead"><div><h1>Kunden</h1><small>{groups.size} Kundenprofile aus Anfragen</small></div></div>
 <div className="clientGrid">{Array.from(groups.entries()).map(([key,c])=><article key={key} className="clientCard"><h2>{c.name}</h2>{c.email&&<p><b>E-Mail:</b> <a href={"mailto:"+c.email}>{c.email}</a></p>}{c.phone&&<p><b>WhatsApp:</b> <a href={"https://wa.me/"+c.phone.replace(/[^0-9]/g,"")} target="_blank" rel="noopener noreferrer">{c.phone}</a></p>}{c.address&&<p><b>Adresse:</b> {c.address}</p>}<h3>Anfragen ({c.orders.length})</h3>{c.orders.map(r=><Link key={r.id} href={"/admin/anfragen/"+r.id}>{r.service} <span className={"requestStatus "+r.status}>{r.status}</span></Link>)}</article>)}</div>
 {!groups.size&&<p>Noch keine Kunden vorhanden.</p>}</section>;
}