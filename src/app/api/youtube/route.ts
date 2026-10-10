import {NextResponse} from "next/server";

export const dynamic="force-dynamic";
const CHANNEL_ID="UCv54MwZS5LymBGMKD_n0w6g";
const CHANNEL_URL="https://www.youtube.com/@vershnyk_com";
const headers={"User-Agent":"Mozilla/5.0 (compatible; VERSHNYKWebsite/1.0)","Accept":"application/atom+xml,application/xml,text/xml,*/*"};

function decodeXml(value:string){
 return value.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#(?:x([0-9a-f]+)|([0-9]+));/gi,(_,hex,dec)=>String.fromCodePoint(parseInt(hex||dec,hex?16:10))).replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">");
}
function videosFromFeed(xml:string){
 return [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/g)].slice(0,8).map(match=>{
  const entry=match[1];
  const videoId=entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]||entry.match(/watch\?v=([\w-]{11})/)?.[1]||"";
  const title=decodeXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim()||"VERSHNYK");
  const published=entry.match(/<published>([^<]+)<\/published>/)?.[1]||"";
  return {videoId,title,published,url:"https://www.youtube.com/watch?v="+videoId,thumbnail:"https://i.ytimg.com/vi/"+videoId+"/hqdefault.jpg"};
 }).filter(v=>v.videoId);
}
function decodeJsonText(v:string){try{return JSON.parse('"'+v.replace(/"/g,'\\"')+'"') as string}catch{return v}}
export async function GET(){
 let items:ReturnType<typeof videosFromFeed>=[];
 let diagnostic="feed-unavailable";
 for(const host of ["https://www.youtube.com","https://youtube.com"]){
  try{
   const response=await fetch(host+"/feeds/videos.xml?channel_id="+CHANNEL_ID,{headers,cache:"no-store",signal:AbortSignal.timeout(10000)});
   diagnostic="feed-http-"+response.status;
   if(!response.ok) continue;
   items=videosFromFeed(await response.text());
   diagnostic=items.length?"feed-ok":"feed-empty";
   if(items.length) break;
  }catch(e){diagnostic=e instanceof Error?e.name:"fetch-error"}
 }
 let subscribers:string|null=null;
 let shorts:ReturnType<typeof videosFromFeed>=[];
 try{
  const response=await fetch(CHANNEL_URL,{headers:{"User-Agent":"Mozilla/5.0"},next:{revalidate:3600},signal:AbortSignal.timeout(8000)});
  if(response.ok){
   const html=await response.text();
   const match=
    html.match(/"subscriberCountText":\{"simpleText":"([^"]+)"/)||
    html.match(/"subscriberCountText":\{"runs":\[\{"text":"([^"]+)"/)||
    html.match(/"subscriberCountText":"([^"]+)"/)||
    html.match(/"subscriberCount":"([^"]+)"/);
   if(match) subscribers=decodeJsonText(match[1]).replace(/\s*(subscribers?|Abonnenten)\s*$/i,"").trim();
   if(!subscribers){const meta=html.match(/([0-9][0-9.,KMkm]*\s*(?:subscribers?|Abonnenten))/i);if(meta)subscribers=meta[1].replace(/\s*(subscribers?|Abonnenten)\s*$/i,"").trim()}
   if(!items.length){
    const seen=new Set<string>();
    for(const m of html.matchAll(/"videoId":"([\w-]{11})"/g)){
     if(seen.has(m[1]))continue;
     seen.add(m[1]);
     const id=m[1];
     items.push({videoId:id,title:"VERSHNYK Video",published:"",url:"https://www.youtube.com/watch?v="+id,thumbnail:"https://i.ytimg.com/vi/"+id+"/hqdefault.jpg"});
     if(items.length>=4)break;
    }
    if(items.length)diagnostic="channel-fallback";
   }
  }
 }catch{}
 try{
  const response=await fetch(CHANNEL_URL+"/shorts",{headers:{"User-Agent":"Mozilla/5.0"},cache:"no-store",signal:AbortSignal.timeout(8000)});
  if(response.ok){
   const html=await response.text();
   const seen=new Set<string>();
   for(const m of html.matchAll(/"videoId":"([\w-]{11})"/g)){
    const id=m[1];
    if(seen.has(id))continue;
    seen.add(id);
    shorts.push({videoId:id,title:"VERSHNYK Short",published:"",url:"https://www.youtube.com/shorts/"+id,thumbnail:"https://i.ytimg.com/vi/"+id+"/hqdefault.jpg"});
    if(shorts.length>=4)break;
   }
  }
 }catch{}
 // Keep the two visual groups strictly separate: the large card may only use
 // regular videos, never a video that appears in the Shorts feed.
 const shortIds=new Set(shorts.map(v=>v.videoId));
 const regularItems=items.filter(v=>!shortIds.has(v.videoId));
 return NextResponse.json({channelId:CHANNEL_ID,items:regularItems,shorts,subscribers,diagnostic},{headers:{"Cache-Control":"public, s-maxage=900, stale-while-revalidate=1800"}});
}
