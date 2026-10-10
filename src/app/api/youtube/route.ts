import {NextResponse} from "next/server";

export const revalidate=1800;
const CHANNEL_ID="UCv54MwZS5LymBGMKD_n0w6g";

function decodeXml(value:string){
 return value.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">");
}

export async function GET(){
 try{
  const res=await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,{next:{revalidate:1800}});
  if(!res.ok) throw new Error("YouTube feed unavailable");
  const xml=await res.text();
  const entries=[...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0,8).map(match=>{
   const entry=match[1];
   const videoId=entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]||"";
   const title=decodeXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim()||"VERSHNYK");
   const published=entry.match(/<published>([^<]+)<\/published>/)?.[1]||"";
   return {videoId,title,published,url:`https://www.youtube.com/watch?v=${videoId}`,thumbnail:`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`};
  }).filter(x=>x.videoId);
  return NextResponse.json({channelId:CHANNEL_ID,items:entries});
 }catch(error){
  console.error("YouTube feed failed",error);
  return NextResponse.json({channelId:CHANNEL_ID,items:[]},{status:200});
 }
}
