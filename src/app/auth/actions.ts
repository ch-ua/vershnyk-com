"use server";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";

export async function login(formData:FormData){
 const supabase=await createClient();
 const email=String(formData.get("email")||"");
 const password=String(formData.get("password")||"");
 const {error}=await supabase.auth.signInWithPassword({email,password});
 if(error) redirect("/login?error="+encodeURIComponent("E-Mail oder Passwort ist nicht korrekt."));
 redirect("/konto");
}
export async function signup(formData:FormData){
 const supabase=await createClient();
 const email=String(formData.get("email")||"");
 const password=String(formData.get("password")||"");
 const name=String(formData.get("name")||"");
 const {error}=await supabase.auth.signUp({email,password,options:{data:{name},emailRedirectTo:(process.env.NEXT_PUBLIC_SITE_URL||"https://vershnyk.com")+"/auth/callback"}});
 if(error) redirect("/registrieren?error="+encodeURIComponent(error.message));
 redirect("/login?message="+encodeURIComponent("Bitte bestätigen Sie Ihre E-Mail-Adresse."));
}
export async function logout(){
 const supabase=await createClient(); await supabase.auth.signOut(); redirect("/");
}
