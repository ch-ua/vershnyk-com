import {NextResponse} from "next/server";
import ical from "node-ical";

export const dynamic = "force-dynamic";

function dayKey(date:Date){
  return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
}
function addRange(busy:Set<string>,start:Date,end?:Date){
  const last=new Date((end?.getTime()??start.getTime())-(end?1:0));
  const cursor=new Date(start);
  cursor.setHours(12,0,0,0);
  const stop=dayKey(last);
  for(let guard=0;guard<370;guard++){
    busy.add(dayKey(cursor));
    if(dayKey(cursor)===stop) break;
    cursor.setDate(cursor.getDate()+1);
  }
}

export async function GET(){
  const url=process.env.GOOGLE_CALENDAR_ICAL_URL;
  if(!url) return NextResponse.json({error:"Calendar not configured"},{status:503});
  try{
    const res=await fetch(url,{cache:"no-store"});
    if(!res.ok) throw new Error("Calendar fetch failed");
    const data=ical.sync.parseICS(await res.text());
    const busy=new Set<string>();
    const now=new Date();
    const horizon=new Date(now);
    horizon.setFullYear(horizon.getFullYear()+2);

    type CalendarEvent = {type:string;status?:string;transparency?:string;start?:Date;end?:Date;rrule?:{between:(start:Date,end:Date,inclusive:boolean)=>Date[]}};
    for(const raw of Object.values(data)){
      const item=raw as unknown as CalendarEvent;
      if(!item||item.type!=="VEVENT"||item.status==="CANCELLED"||item.transparency==="TRANSPARENT") continue;
      const event=item;
      if(event.rrule){
        const occurrences=event.rrule.between(new Date(now.getFullYear(),now.getMonth(),1),horizon,true);
        const duration=event.end&&event.start?event.end.getTime()-event.start.getTime():0;
        for(const start of occurrences) addRange(busy,start,duration?new Date(start.getTime()+duration):undefined);
      }else if(event.start){
        addRange(busy,event.start,event.end);
      }
    }
    return NextResponse.json({busy:[...busy].sort()},{headers:{"Cache-Control":"public, s-maxage=300, stale-while-revalidate=3600"}});
  }catch(error){
    console.error("Calendar parsing failed",error);
    return NextResponse.json({error:"Calendar temporarily unavailable"},{status:502});
  }
}
