"use client";
import {useEffect,useState} from "react";
import {site} from "@/data/site";

type Item={id:string;caption?:string;media_type:string;media_url?:string;thumbnail_url?:string;permalink:string};

export default function InstagramFeed(){
 const [items,setItems]=useState<Item[]>([]);
 const [followers,setFollowers]=useState<number|null>(null);
 useEffect(()=>{fetch("/api/instagram").then(r=>r.json()).then(d=>{setItems(Array.isArray(d.items)?d.items:[]);setFollowers(typeof d.followers==="number"?d.followers:null)}).catch(()=>{})},[]);
 const count=<div style={{textAlign:"right",marginBottom:12,fontWeight:700}}>{followers!==null?new Intl.NumberFormat("de-DE").format(followers)+" Follower":"Follower auf Instagram ansehen ↗"}</div>;
 if(!items.length) return <>{count}<div className="reelsRail">{[1,2,3].map(n=><a key={n} className="mediaCard mediaReel" href={site.instagram} target="_blank" rel="noreferrer"><span className="mediaBadge">Instagram</span><span className="playButton">▶</span><div><b>VERSHNYK auf Instagram</b><small>Auf Instagram ansehen</small></div></a>)}</div></>;
 return <>{count}<div className="reelsRail">{items.slice(0,6).map(item=><a key={item.id} className="mediaCard mediaReel" href={item.permalink} target="_blank" rel="noreferrer" style={{backgroundImage:`url("${item.thumbnail_url||item.media_url||""}")`}}><span className="mediaBadge">{item.media_type==="VIDEO"?"Reel":"Instagram"}</span><span className="playButton">{item.media_type==="VIDEO"?"▶":"↗"}</span><div><b>{item.caption?.trim().slice(0,70)||"VERSHNYK"}</b><small>Auf Instagram ansehen</small></div></a>)}</div></>;
}