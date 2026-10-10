"use client";
import {useEffect,useState} from "react";
import {site} from "@/data/site";

type Video={videoId:string;title:string;url:string;thumbnail:string;published:string};

export default function YouTubeFeed(){
 const [items,setItems]=useState<Video[]>([]);
 useEffect(()=>{fetch("/api/youtube").then(r=>r.json()).then(d=>setItems(Array.isArray(d.items)?d.items:[])).catch(()=>{})},[]);
 if(!items.length) return <div className="youtubeMediaGrid"><a className="mediaCard mediaMain" href={site.youtube} target="_blank" rel="noreferrer"><span className="mediaBadge">YouTube</span><span className="playButton">▶</span><div><b>VERSHNYK Handwerk & Montage</b><small>Auf YouTube ansehen</small></div></a><div className="shortsRail">{[1,2,3].map(n=><a key={n} className="mediaCard mediaShort" href={site.youtube} target="_blank" rel="noreferrer"><span className="mediaBadge">YouTube</span><span className="playButton">▶</span><div><b>VERSHNYK</b><small>Auf YouTube ansehen</small></div></a>)}</div></div>;
 const main=items[0], rest=items.slice(1,4);
 return <div className="youtubeMediaGrid"><a className="mediaCard mediaMain" href={main.url} target="_blank" rel="noreferrer" style={{backgroundImage:`url("${main.thumbnail}")`}}><span className="mediaBadge">YouTube</span><span className="playButton">▶</span><div><b>{main.title}</b><small>Auf YouTube ansehen</small></div></a><div className="shortsRail">{rest.map(v=><a key={v.videoId} className="mediaCard mediaShort" href={v.url} target="_blank" rel="noreferrer" style={{backgroundImage:`url("${v.thumbnail}")`}}><span className="mediaBadge">Video</span><span className="playButton">▶</span><div><b>{v.title}</b><small>Auf YouTube ansehen</small></div></a>)}</div></div>;
}
