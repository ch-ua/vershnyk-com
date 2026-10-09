import {NextResponse} from "next/server";

export const dynamic = "force-dynamic";

function unfoldIcs(input:string){
  return input.replace(/\r?\n[ \t]/g,"");
}
function parseIcsDate(value:string){
  const v=value.trim();
  if(/^\d{8}$/.test(v)) return new Date(Date.UTC(+v.slice(0,4),+v.slice(4,6)-1,+v.slice(6,8)));
  const m=v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/);
  if(!m) return null;
  return new Date(Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+(m[6]||0)));
}
function key(d:Date){ return d.toISOString().slice(0,10); }

export async function GET(){
  const url=process.env.GOOGLE_CALENDAR_ICAL_URL;
  if(!url) return NextResponse.json({error:"Calendar not configured"},{status:503});

  try{
    const res=await fetch(url,{cache:"no-store"});
    if(!res.ok) throw new Error("Calendar fetch failed");
    const text=unfoldIcs(await res.text());
    const busy=new Set<string>();

    for(const block of text.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g)||[]){
      if(/STATUS:CANCELLED/i.test(block)||/TRANSP:TRANSPARENT/i.test(block)) continue;
      const startLine=block.match(/^DTSTART(?:;[^:]*)?:(.+)$/m);
      const endLine=block.match(/^DTEND(?:;[^:]*)?:(.+)$/m);
      if(!startLine) continue;
      const start=parseIcsDate(startLine[1]);
      const end=endLine?parseIcsDate(endLine[1]):null;
      if(!start) continue;
      const last=end?new Date(end.getTime()-1):start;
      const cursor=new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth(),start.getUTCDate()));
      const stop=new Date(Date.UTC(last.getUTCFullYear(),last.getUTCMonth(),last.getUTCDate()));
      while(cursor<=stop){ busy.add(key(cursor)); cursor.setUTCDate(cursor.getUTCDate()+1); }
    }

    return NextResponse.json({busy:[...busy].sort()},{
      headers:{"Cache-Control":"public, s-maxage=300, stale-while-revalidate=3600"}
    });
  }catch{
    return NextResponse.json({error:"Calendar temporarily unavailable"},{status:502});
  }
}
