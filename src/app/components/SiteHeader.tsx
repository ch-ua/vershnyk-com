import {site} from "@/data/site";
import {logo} from "@/data/logo";

export default function SiteHeader(){
 return <header className="header siteHeader">
  <a className="brand" href="/"><img src={logo} alt="VERSHNYK"/><span><strong>VERSHNYK</strong><small>HANDWERK & MONTAGE</small></span></a>
  <div className="actions">
   <a className="loginButton" href="/admin" aria-label="Admin">Admin</a>
   <a className="ig" href={site.instagram} aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>
   <a className="yt" href={site.youtube} aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M3.5 7.2A3.5 3.5 0 0 1 6 4.7c4-.5 8-.5 12 0a3.5 3.5 0 0 1 2.5 2.5c.5 3.2.5 6.4 0 9.6a3.5 3.5 0 0 1-2.5 2.5c-4 .5-8 .5-12 0a3.5 3.5 0 0 1-2.5-2.5 31 31 0 0 1 0-9.6Z"/><path className="play" d="m10 9 5 3-5 3Z"/></svg></a>
   <a className="wicon" href={site.whatsapp} aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M20 11.7a8 8 0 0 1-11.8 7l-4.2 1.1 1.1-4A8 8 0 1 1 20 11.7Z"/><path d="M8.2 7.8c.4-.4.8-.2 1 .2l.8 1.8c.1.3 0 .6-.2.8l-.6.7c.8 1.6 2 2.8 3.7 3.5l.7-.8c.2-.2.5-.3.8-.2l1.8.8c.4.2.5.6.3 1-.5.9-1.4 1.5-2.4 1.4-3.7-.4-7.2-3.8-7.5-7.5-.1-.7.2-1.3.6-1.7Z"/></svg></a>
  </div>
 </header>
}