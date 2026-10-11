"use server";
import {revalidatePath} from "next/cache";
import {createClient} from "@/lib/supabase/server";
export async function cancelRequest(form:FormData){
 const id=String(form.get("request_id")||"");
 const s=await createClient();
 const {data:{user}}=await s.auth.getUser();
 if(!user||!id)throw new Error("Nicht angemeldet oder ungültige Anfrage");
 const {error}=await s.from("requests").update({status:"cancelled"}).eq("id",id).eq("user_id",user.id).in("status",["new","reviewing"]);
 if(error)throw new Error("Anfrage konnte nicht storniert werden: "+error.message);
 revalidatePath("/konto");revalidatePath("/admin");revalidatePath("/admin/anfragen");
}
