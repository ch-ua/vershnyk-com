"use server";
import {revalidatePath} from "next/cache";import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
async function adminClient(){
 const s=await createClient();
 const {data:{user}}=await s.auth.getUser();
 if(!user)throw new Error("Nicht angemeldet");
 const {data:p}=await s.from("profiles").select("role").eq("id",user.id).single();
 if(p?.role!=="admin")throw new Error("Kein Adminzugang");
 return s;
}
export async function markViewed(id:string){
 const s=await adminClient();
 const {error}=await s.from("requests").update({viewed_at:new Date().toISOString()}).eq("id",id).is("viewed_at",null);
 if(error)console.error("markViewed",error.message);
 revalidatePath("/admin");revalidatePath("/admin/anfragen");
}
export async function updateRequest(form:FormData){
 const s=await adminClient();
 const id=String(form.get("id")||"");
 const status=String(form.get("status")||"reviewing");
 const allowed=["new","reviewing","offered","confirmed","done","cancelled"];
 if(!allowed.includes(status))throw new Error("Ungültiger Status");
 const amount=String(form.get("offer_amount")||"").trim().replace(",",".");
 const valid=String(form.get("offer_valid_until")||"");
 const {error}=await s.from("requests").update({
  status,admin_note:String(form.get("admin_note")||"").slice(0,10000),
  customer_reply:String(form.get("customer_reply")||"").slice(0,10000),
  offer_text:String(form.get("offer_text")||"").slice(0,10000),
  offer_amount:amount&&Number.isFinite(Number(amount))?Number(amount):null,
  offer_valid_until:valid||null,
  viewed_at:new Date().toISOString()
 }).eq("id",id);
 if(error)throw new Error(error.message);
 revalidatePath("/admin");revalidatePath("/admin/anfragen");revalidatePath("/admin/anfragen/"+id);
 redirect("/admin/anfragen/"+id+"?saved=1");
}
