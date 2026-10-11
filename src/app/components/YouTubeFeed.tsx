"use client";
import {useEffect,useState} from "react";
import {site} from "@/data/site";

type Video={videoId:string;title:string;url:string;thumbnail:string;published:string};
const FALLBACK_SUBSCRIBERS="1.86 Tsd.";

export default function YouTubeFeed(){
 const [shorts,setShorts]=useState<Video[]>([]);
 const [subscribers,setSubscribers]=useState<string|null>(null);
 useEffect(()=>{fetch("/api/youtube").then(r=>r.json()).then(d=>{
  const shortItems=Array.isArray(d.shorts)?d.shorts:[];
  setShorts(shortItems.slice(0,6));
  setSubscribers(typeof d.subscribers==="string"&&d.subscribers.trim()?d.subscribers:FALLBACK_SUBSCRIBERS);
 }).catch(()=>setSubscribers(FALLBACK_SUBSCRIBERS))},[]);
 const count=subscribers||FALLBACK_SUBSCRIBERS;
 const shown=shorts.length?shorts:Array.from({length:6},(_,i)=>({videoId:String(i),title:"VERSHNYK auf YouTube Shorts",url:site.youtube,thumbnail:"",published:""}));
 return <><div className="socialCount">{count} Abonnenten</div><div className="youtubeShortsGrid">
  {shown.map(v=><a key={v.videoId} className="mediaCard mediaShort youtubeShortCard" href={v.url} target="_blank" rel="noreferrer" style={v.thumbnail?{backgroundImage:`url("${v.thumbnail}")`}:undefined}><span className="mediaBadge">Shorts</span><span className="playButton">▶</span><div><b>{v.title}</b><small>Auf YouTube ansehen</small></div></a>)}
 </div></>;
}