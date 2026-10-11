"use server";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";

export async function login(formData:FormData){
 const supabase=await createClient();
 const email=String(formData.get("email")||"");
 const password=String(formData.get("password")||"");
 const {error}=await supabase.auth.signInWithPassword({email,password});
 if(error) redirect("/login?error="+encodeURIComponent("E-Mail oder Passwort ist nicht korrekt."));
 const {data:{user}}=await supabase.auth.getUser();
 if(user){const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();if(profile?.role==="admin")redirect("/admin");}
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
export async function requestPasswordReset(formData:FormData){
 const supabase=await createClient();
 const email=String(formData.get("email")||"").trim();
 if(!email) redirect("/passwort-vergessen?error="+encodeURIComponent("Bitte geben Sie Ihre E-Mail-Adresse ein."));
 const site=process.env.NEXT_PUBLIC_SITE_URL||"https://vershnyk.com";
 const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:site+"/passwort-neu"});
 if(error) redirect("/passwort-vergessen?error="+encodeURIComponent("Die E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es erneut."));
 redirect("/passwort-vergessen?sent=1");
}
export async function updatePassword(formData:FormData){
 const supabase=await createClient();
 const password=String(formData.get("password")||"");
 if(password.length<8) redirect("/passwort-neu?error="+encodeURIComponent("Das Passwort muss mindestens 8 Zeichen lang sein."));
 const {error}=await supabase.auth.updateUser({password});
 if(error) redirect("/passwort-neu?error="+encodeURIComponent("Das Passwort konnte nicht geändert werden. Bitte öffnen Sie den Link aus der E-Mail erneut."));
 redirect("/konto");
}
export async function logout(){
 const supabase=await createClient(); await supabase.auth.signOut(); redirect("/");
}
