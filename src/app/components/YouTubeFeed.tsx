"use client";
import {useEffect,useState} from "react";
import {site} from "@/data/site";

type Video={videoId:string;title:string;url:string;thumbnail:string;published:string};
const FALLBACK_SUBSCRIBERS="1.86 Tsd.";

export default function YouTubeFeed(){
 const [items,setItems]=useState<Video[]>([]);
 const [subscribers,setSubscribers]=useState<string|null>(null);
 useEffect(()=>{fetch("/api/youtube").then(r=>r.json()).then(d=>{setItems(Array.isArray(d.items)?d.items:[]);setSubscribers(typeof d.subscribers==="string"&&d.subscribers.trim()?d.subscribers:FALLBACK_SUBSCRIBERS)}).catch(()=>setSubscribers(FALLBACK_SUBSCRIBERS))},[]);
 const count=subscribers||FALLBACK_SUBSCRIBERS;
 if(!items.length) return <><div className="socialCount">{count} Abonnenten</div><div className="youtubeMediaGrid"><a className="mediaCard mediaMain" href={site.youtube} target="_blank" rel="noreferrer"><span className="mediaBadge">YouTube</span><span className="playButton">▶</span><div><b>VERSHNYK Handwerk & Montage</b><small>Auf YouTube ansehen</small></div></a><div className="youtubeVideosRail">{[1,2,3].map(n=><a key={n} className="mediaCard mediaVideo" href={site.youtube} target="_blank" rel="noreferrer"><span className="mediaBadge">Video</span><span className="playButton">▶</span><div><b>VERSHNYK</b><small>Auf YouTube ansehen</small></div></a>)}</div></div></>;
 const main=items[0], videos=items.slice(1,4), shorts=items.slice(4,8);
 return <><div className="socialCount">{count} Abonnenten</div><div className="youtubeMediaGrid"><a className="mediaCard mediaMain" href={main.url} target="_blank" rel="noreferrer" style={{backgroundImage:`url("${main.thumbnail}")`}}><span className="mediaBadge">YouTube</span><span className="playButton">▶</span><div><b>{main.title}</b><small>Auf YouTube ansehen</small></div></a><div className="youtubeVideosRail">{videos.map(v=><a key={v.videoId} className="mediaCard mediaVideo" href={v.url} target="_blank" rel="noreferrer" style={{backgroundImage:`url("${v.thumbnail}")`}}><span className="mediaBadge">Video</span><span className="playButton">▶</span><div><b>{v.title}</b><small>Auf YouTube ansehen</small></div></a>)}</div></div>{shorts.length>0&&<div className="youtubeShortsRow">{shorts.map(v=><a key={v.videoId} className="mediaCard mediaShort" href={v.url.replace("watch?v=","shorts/")} target="_blank" rel="noreferrer" style={{backgroundImage:`url("${v.thumbnail}")`}}><span className="mediaBadge">Shorts</span><span className="playButton">▶</span><div><b>{v.title}</b><small>Auf YouTube ansehen</small></div></a>)}</div>}</>;
}
