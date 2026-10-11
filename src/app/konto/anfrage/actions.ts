"use server";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
export async function createRequest(fd:FormData){
 const s=await createClient(); const {data:{user}}=await s.auth.getUser(); if(!user)redirect("/login");
 const row={user_id:user.id,service:String(fd.get("service")||""),description:String(fd.get("description")||""),address:String(fd.get("address")||""),preferred_date:String(fd.get("preferred_date")||"")||null};
 const {error}=await s.from("requests").insert(row);
 if(error)redirect("/konto/anfrage?error="+encodeURIComponent(error.message));
 redirect("/konto?sent=1");
}