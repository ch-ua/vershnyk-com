"use client";
import {useEffect,useRef,useState} from "react";
type Review={name:string;rating:number;text:string;time:number;url?:string};
type Feed={configured:boolean;rating?:number;count?:number;reviews:Review[]};
const googleLink="https://g.page/r/CbQN37tSxu1QEAE/review";
export default function GoogleReviews(){
 const [feed,setFeed]=useState<Feed|null>(null);
 const rail=useRef<HTMLDivElement>(null);
 useEffect(()=>{fetch("/api/google-reviews").then(r=>r.json()).then(setFeed).catch(()=>{})},[]);
 const reviews=feed?.reviews||[];
 const move=(n:number)=>{const el=rail.current;if(el)el.scrollBy({left:n*330,behavior:"smooth"})};
 return <section className="googleReviews" id="bewertungen">
 <div className="googleReviewsHead"><div><p className="hand">Das sagen meine Kunden</p><h2>GOOGLE BEWERTUNGEN</h2><p>VERSHNYK Handwerk &amp; Montage</p><div className="googleRating"><strong>{feed?.rating?.toFixed(1)||"5.0"}</strong><span>★★★★★</span><small>{feed?.count?feed.count+" Bewertungen":"Google Bewertungen"}</small><b>Google</b></div></div><a className="googleWrite" href={googleLink} target="_blank" rel="noopener noreferrer">Rezension schreiben ↗</a></div>
 <div className="googleCarousel"><button onClick={()=>move(-1)} aria-label="Zurück">‹</button><div className="googleRail" ref={rail}>{reviews.length?reviews.map((r,i)=><article className="googleReview" key={i}><div className="googleAvatar">{r.name[0]}</div><div className="googleStars">{"★".repeat(r.rating)}</div><h3>{r.name}</h3><time>{new Date(r.time*1000).toLocaleDateString("de-DE")}</time><p>{r.text}</p>{r.url&&<a href={r.url} target="_blank" rel="noopener noreferrer">Auf Google ansehen ↗</a>}</article>):<article className="googleReview googleEmpty"><div className="googleStars">★★★★★</div><h3>Bewertungen unserer Kunden</h3><p>Die aktuellen Kundenstimmen finden Sie direkt auf Google.</p><a href={googleLink} target="_blank" rel="noopener noreferrer">Google Bewertungen öffnen ↗</a></article>}</div><button onClick={()=>move(1)} aria-label="Weiter">›</button></div>
 <div className="googleReviewsFoot"><span>{feed?.configured?"Google-Bewertungen · automatisch aktualisiert":"Google-Kundenbewertungen"}</span><a href={googleLink} target="_blank" rel="noopener noreferrer">Auf Google ansehen ↗</a></div>
 </section>;
}