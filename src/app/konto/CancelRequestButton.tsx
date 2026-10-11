"use client";
import {useState} from "react";
import {cancelRequest} from "./cancelRequest";
export default function CancelRequestButton({id}:{id:string}){
 const [busy,setBusy]=useState(false);
 return <form action={async(form)=>{setBusy(true);try{await cancelRequest(form)}finally{setBusy(false)}}} onSubmit={e=>{if(!window.confirm("Möchten Sie diese Anfrage wirklich stornieren? Die Anfrage bleibt in Ihrem Verlauf sichtbar."))e.preventDefault()}}>
 <input type="hidden" name="request_id" value={id}/>
 <button type="submit" className="customerCancelRequest" disabled={busy}>{busy?"Wird storniert …":"Anfrage stornieren"}</button>
 </form>;
}
