"use client";
import {useEffect,useState} from "react";
import {site} from "@/data/site";

type Video={videoId:string;title:string;url:string;thumbnail:string;published:string};
const FALLBACK_SUBSCRIBERS="1.86 Tsd.";

export default function YouTubeFeed(){
 const [items,setItems]=useState<Video[]>([]);
 const [shorts,setShorts]=useState<Video[]>([]);
 const [main,setMain]=useState<Video|null>(null);
 const [subscribers,setSubscribers]=useState<string|null>(null);
 useEffect(()=>{fetch("/api/youtube").then(r=>r.json()).then(d=>{
  const videos=Array.isArray(d.items)?d.items:[];
  setItems(videos);
  setShorts(Array.isArray(d.shorts)?d.shorts:[]);
  if(videos.length)setMain(videos[Math.floor(Math.random()*videos.length)]);
  setSubscribers(typeof d.subscribers==="string"&&d.subscribers.trim()?d.subscribers:FALLBACK_SUBSCRIBERS);
 }).catch(()=>setSubscribers(FALLBACK_SUBSCRIBERS))},[]);
 const count=subscribers||FALLBACK_SUBSCRIBERS;
 const hero=main||items[0];
 return <><div className="socialCount">{count} Abonnenten</div><div className="youtubeOneRow">
  <a className="mediaCard mediaMain youtubeRandomMain" href={hero?.url||site.youtube} target="_blank" rel="noreferrer" style={hero?{backgroundImage:`url("${hero.thumbnail}")`}:undefined}><span className="mediaBadge">YouTube</span><span className="playButton">▶</span><div><b>{hero?.title||"VERSHNYK Handwerk & Montage"}</b><small>Auf YouTube ansehen</small></div></a>
  <div className="youtubeShortsInline">{shorts.map(v=><a key={v.videoId} className="mediaCard mediaShort" href={v.url} target="_blank" rel="noreferrer" style={{backgroundImage:`url("${v.thumbnail}")`}}><span className="mediaBadge">Shorts</span><span className="playButton">▶</span><div><b>{v.title}</b><small>Auf YouTube ansehen</small></div></a>)}</div>
 </div></>;
}