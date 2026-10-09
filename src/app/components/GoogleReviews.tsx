"use client";
import {useEffect,useRef,useState} from "react";
type Review={name:string;rating:number;text:string;time:number;url?:string};
type Feed={configured:boolean;rating?:number;count?:number;reviews:Review[]};
const googleLink="https://g.page/r/CbQN37tSxu1QEAE/review";
export default function GoogleReviews(){
 const [feed,setFeed]=useState<Feed|null>(null);
 const rail=useRef<HTMLDivElement>(null);
 useEffect(()=>{fetch("/api/google-reviews").then(r=>r.json()).then(setFeed).catch(()=>{})},[]);
 const snapshot:Review[]=[
 {name:"Tobias Kaltenbrunn",rating:5,text:"Zuverlässig, schnell, sauber und preiswert. Sehr gerne wieder!",time:1787616000},
 {name:"Monika Wipijewski",rating:5,text:"Maksym ist absolut zuverlässig, freundlich und kompetent.",time:1786665600},
 {name:"Irina Gebert",rating:5,text:"Wir sind mit der Arbeit sehr zufrieden. Maxim war pünktlich, sehr freundlich und hat bei der Hitze bis zum Schluss hart gearbeitet.",time:1783900800},
 {name:"N. M.",rating:5,text:"Ich war sehr zufrieden mit der Montage. Diese wurde professionell, präzise und zügig ausgeführt.",time:1780358400},
 {name:"MrMikadodo",rating:5,text:"Küche wurde zu unserer Zufriedenheit aufgebaut.",time:1773014400}
 ];
 const reviews=(feed?.reviews?.length?feed.reviews:snapshot).slice(0,5);
 const move=(n:number)=>{const el=rail.current;if(el)el.scrollBy({left:n*330,behavior:"smooth"})};
 return <section className="googleReviews" id="bewertungen">
 <div className="googleReviewsHead"><div><p className="hand">Das sagen meine Kunden</p><h2>GOOGLE BEWERTUNGEN</h2><p>VERSHNYK Handwerk &amp; Montage</p><div className="googleRating"><strong>{feed?.rating?.toFixed(1)||"5.0"}</strong><span>★★★★★</span><small>{feed?.count?feed.count+" Bewertungen":"20 Bewertungen (Stand Aug. 2026)"}</small><b>Google</b></div></div><a className="googleWrite" href={googleLink} target="_blank" rel="noopener noreferrer">Rezension schreiben ↗</a></div>
 <div className="googleCarousel"><button onClick={()=>move(-1)} aria-label="Zurück">‹</button><div className="googleRail" ref={rail}>{reviews.length?reviews.map((r,i)=><article className="googleReview" key={i}><div className="googleAvatar">{r.name[0]}</div><div className="googleStars">{"★".repeat(r.rating)}</div><h3>{r.name}</h3><time>{new Date(r.time*1000).toLocaleDateString("de-DE")}</time><p>{r.text}</p>{r.url&&<a href={r.url} target="_blank" rel="noopener noreferrer">Auf Google ansehen ↗</a>}</article>):<article className="googleReview googleEmpty"><div className="googleStars">★★★★★</div><h3>Bewertungen unserer Kunden</h3><p>Die aktuellen Kundenstimmen finden Sie direkt auf Google.</p><a href={googleLink} target="_blank" rel="noopener noreferrer">Google Bewertungen öffnen ↗</a></article>}</div><button onClick={()=>move(1)} aria-label="Weiter">›</button></div>
 <div className="googleReviewsFoot"><span>{feed?.configured?"Google-Bewertungen · automatisch aktualisiert":"Ausgewählte Kundenstimmen · Stand August 2026"}</span><a href={googleLink} target="_blank" rel="noopener noreferrer">Auf Google ansehen ↗</a></div>
 </section>;
}