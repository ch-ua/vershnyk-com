"use server";
import {redirect} from "next/navigation";import {createClient} from "@/lib/supabase/server";
export async function createRequest(fd:FormData){
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/login");
 const services=fd.getAll("service").map(String).filter(Boolean);if(!services.length)redirect("/konto/anfrage?error="+encodeURIComponent("Bitte wählen Sie mindestens eine Leistung."));const street=String(fd.get("street")||"").trim(),postal=String(fd.get("postal_code")||"").trim(),city=String(fd.get("city")||"").trim();const row={user_id:user.id,service:services.join(", "),description:String(fd.get("description")||""),address:[street,[postal,city].filter(Boolean).join(" ")].filter(Boolean).join(", "),preferred_date:String(fd.get("preferred_date")||"")||null};
 const {data:req,error}=await s.from("requests").insert(row).select("id").single();if(error||!req)redirect("/konto/anfrage?error="+encodeURIComponent(error?.message||"Anfrage konnte nicht gespeichert werden."));
 const photos=fd.getAll("photos").filter((x):x is File=>x instanceof File&&x.size>0).slice(0,8);
 for(const [i,file] of photos.entries()){if(file.size>10485760)continue;const ext=(file.name.split(".").pop()||"jpg").toLowerCase();const path=`${user.id}/${req.id}/${Date.now()}-${i}.${ext}`;const {error:up}=await s.storage.from("request-photos").upload(path,file,{contentType:file.type,upsert:false});if(!up)await s.from("request_photos").insert({request_id:req.id,user_id:user.id,path});}
 redirect("/konto?sent=1");
}