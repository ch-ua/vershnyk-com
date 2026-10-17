import {NextResponse} from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function dayKey(date: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function addRange(busy: Set<string>, start: Date, end?: Date) {
  if (!Number.isFinite(start.getTime())) return;
  const final = end && Number.isFinite(end.getTime()) && end > start
    ? new Date(end.getTime() - 1)
    : start;
  const from = dayKey(start);
  const to = dayKey(final);
  let cursor = new Date(from + "T12:00:00Z");
  for (let i = 0; i < 370; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (key > to) break;
    busy.add(key);
    cursor = new Date(cursor.getTime() + 86400000);
  }
}

function failure(code: string, status: number) {
  return NextResponse.json(
    {error: "Calendar unavailable", code},
    {status, headers: {"Cache-Control": "no-store"}}
  );
}

function parseDate(value: string): Date | null {
  const v = value.trim();
  const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?(Z)?$/);
  if (!m) return null;
  if (!m[4]) return new Date(`${m[1]}-${m[2]}-${m[3]}T12:00:00Z`);
  const suffix = m[7] ? "Z" : "";
  return new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}${suffix}`);
}

function valueOf(event: string[], key: string) {
  const row = event.find(x => x.startsWith(key + ":") || x.startsWith(key + ";"));
  return row ? row.slice(row.indexOf(":") + 1) : null;
}

function valuesOf(event: string[], key: string) {
  return event
    .filter(x => x.startsWith(key + ":") || x.startsWith(key + ";"))
    .flatMap(row => row.slice(row.indexOf(":") + 1).split(","))
    .map(v => v.trim())
    .filter(Boolean);
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseByDay(value?: string) {
  if (!value) return [] as number[];
  const map: Record<string, number> = {SU:0,MO:1,TU:2,WE:3,TH:4,FR:5,SA:6};
  return value.split(",").map(v => v.slice(-2)).map(v => map[v]).filter(v => v !== undefined);
}

function expandRule(start: Date, rrule: string, maxDate: Date) {
  const parts = Object.fromEntries(rrule.split(";").map(part => {
    const [k, ...rest] = part.split("=");
    return [k, rest.join("=")];
  }));
  const freq = parts.FREQ;
  const interval = Math.max(1, Number(parts.INTERVAL || "1") || 1);
  const count = parts.COUNT ? Math.max(1, Number(parts.COUNT) || 1) : null;
  const until = parts.UNTIL ? parseDate(parts.UNTIL) : null;
  const byDays = parseByDay(parts.BYDAY);
  const out: Date[] = [];
  const limit = until && until < maxDate ? until : maxDate;

  if (freq === "WEEKLY" && byDays.length) {
    const weekStart = new Date(start);
    weekStart.setUTCDate(weekStart.getUTCDate() - ((weekStart.getUTCDay() + 6) % 7));
    for (let week = 0; week < 160; week += interval) {
      const base = new Date(weekStart);
      base.setUTCDate(base.getUTCDate() + week * 7);
      for (const dow of byDays) {
        const occurrence = new Date(base);
        occurrence.setUTCDate(base.getUTCDate() + ((dow + 6) % 7));
        occurrence.setUTCHours(start.getUTCHours(), start.getUTCMinutes(), start.getUTCSeconds(), 0);
        if (occurrence < start) continue;
        if (occurrence > limit) return out;
        out.push(occurrence);
        if (count !== null && out.length >= count) return out;
      }
    }
    return out;
  }

  let occurrence = new Date(start);
  for (let i = 0; i < 1000; i++) {
    if (occurrence > limit || (count !== null && out.length >= count)) break;
    out.push(new Date(occurrence));
    const next = new Date(occurrence);
    if (freq === "DAILY") next.setUTCDate(next.getUTCDate() + interval);
    else if (freq === "WEEKLY") next.setUTCDate(next.getUTCDate() + 7 * interval);
    else if (freq === "MONTHLY") next.setUTCMonth(next.getUTCMonth() + interval);
    else if (freq === "YEARLY") next.setUTCFullYear(next.getUTCFullYear() + interval);
    else break;
    occurrence = next;
  }
  return out;
}


/** Direct Google Calendar API. Service account must be shared onto the calendar. */
async function googleAccessToken(email:string,privateKey:string){
 const {createSign}=await import("node:crypto");
 const encode=(value:unknown)=>Buffer.from(JSON.stringify(value)).toString("base64url");
 const now=Math.floor(Date.now()/1000);
 const header=encode({alg:"RS256",typ:"JWT"});
 const payload=encode({iss:email,scope:"https://www.googleapis.com/auth/calendar.readonly",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600});
 const unsigned=`${header}.${payload}`;
 const signer=createSign("RSA-SHA256");signer.update(unsigned);signer.end();
 const assertion=`${unsigned}.${signer.sign(privateKey.replace(/\\n/g,"\n"),"base64url")}`;
 const response=await fetch("https://oauth2.googleapis.com/token",{method:"POST",cache:"no-store",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion}),signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw new Error(`GOOGLE_AUTH_${response.status}`);
 const data=await response.json();
 if(typeof data.access_token!=="string")throw new Error("GOOGLE_TOKEN_MISSING");
 return data.access_token as string;
}
async function directGoogleCalendar(){
 const calendarId=process.env.GOOGLE_CALENDAR_ID?.trim()||"vershnyk.com@gmail.com";
 const email=process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL?.trim();
 const privateKey=process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_PRIVATE_KEY;
 const apiKey=process.env.GOOGLE_CALENDAR_API_KEY?.trim();
 if(!(email&&privateKey)&&!apiKey)return null;
 const token=email&&privateKey?await googleAccessToken(email,privateKey):null;
 const now=new Date();
 const from=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-2,1));
 const until=new Date(Date.UTC(now.getUTCFullYear()+2,now.getUTCMonth()+1,1));
 const busy=new Set<string>();
 let pageToken:string|undefined;
 let eventCount=0;
 for(let page=0;page<40;page++){
  const endpoint=new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
  endpoint.searchParams.set("singleEvents","true");
  endpoint.searchParams.set("orderBy","startTime");
  endpoint.searchParams.set("maxResults","2500");
  endpoint.searchParams.set("timeMin",from.toISOString());
  endpoint.searchParams.set("timeMax",until.toISOString());
  if(pageToken)endpoint.searchParams.set("pageToken",pageToken);
  if(!token&&apiKey)endpoint.searchParams.set("key",apiKey);
  const response=await fetch(endpoint,{cache:"no-store",headers:token?{Authorization:`Bearer ${token}`}:{},signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error(`GOOGLE_EVENTS_HTTP_${response.status}`);
  const data=await response.json();
  if(!Array.isArray(data.items))throw new Error("GOOGLE_EVENTS_INVALID");
  for(const event of data.items){
   if(event.status==="cancelled")continue;
   const start=event.start?.dateTime||event.start?.date;
   const end=event.end?.dateTime||event.end?.date;
   if(typeof start!=="string")continue;
   const startDate=event.start?.date?new Date(start+"T12:00:00Z"):new Date(start);
   const endDate=typeof end==="string"?(event.end?.date?new Date(end+"T12:00:00Z"):new Date(end)):undefined;
   addRange(busy,startDate,endDate);
   eventCount++;
  }
  pageToken=typeof data.nextPageToken==="string"?data.nextPageToken:undefined;
  if(!pageToken)return {busy:[...busy].sort(),source:"google-calendar-api",eventCount};
 }
 throw new Error("GOOGLE_EVENTS_PAGINATION_LIMIT");
}

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyamwlocgK43OYO6DdowD6gvPB9JFer_Gv9Yse750CpnL-W_zoTOqsLpK5umOX3xB6Gjw/exec";

async function appsScriptCalendar(){
 const response=await fetch(APPS_SCRIPT_URL,{cache:"no-store",redirect:"follow",signal:AbortSignal.timeout(20000),headers:{"Accept":"application/json"}});
 if(!response.ok)throw new Error("APPS_SCRIPT_HTTP_"+response.status);
 const data=await response.json();
 if(!data||!Array.isArray(data.busy)||data.busy.some((d:unknown)=>typeof d!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(d)))throw new Error("APPS_SCRIPT_INVALID_DATA");
 if(data.error)throw new Error("APPS_SCRIPT_ERROR");
 return {busy:[...new Set<string>(data.busy)].sort(),source:"google-apps-script",eventCount:typeof data.eventCount==="number"?data.eventCount:null};
}

export async function GET() {\n  try {\n    const data=await appsScriptCalendar();\n    return NextResponse.json(data,{headers:{"Cache-Control":"no-store, max-age=0"}});\n  } catch(error) {\n    console.error("Apps Script calendar unavailable",error);\n    return failure("APPS_SCRIPT_UNAVAILABLE",502);\n  }\n
  if(process.env.GOOGLE_CALENDAR_API_KEY || (process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_PRIVATE_KEY)) {
    try {
      const data=await directGoogleCalendar();
      if(data)return NextResponse.json(data,{headers:{"Cache-Control":"no-store, max-age=0"}});
    } catch(error) {
      console.error("Direct Google Calendar API failed",error);
      return failure("GOOGLE_API_FAILED",502);
    }
  }
  const url = process.env.GOOGLE_CALENDAR_ICAL_URL?.trim();
  if (!url) return failure("ICAL_URL_MISSING", 503);
  if (!/^https:\/\//i.test(url)) return failure("ICAL_URL_INVALID", 503);

  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      headers: {"Accept": "text/calendar, text/plain;q=0.9, */*;q=0.5"},
      signal: AbortSignal.timeout(12000)
    });
  } catch (error) {
    console.error("Calendar feed request failed", error);
    return failure("ICAL_FETCH_FAILED", 502);
  }

  if (!response.ok) return failure("ICAL_HTTP_" + response.status, 502);
  const ics = await response.text();
  if (!ics.includes("BEGIN:VCALENDAR")) return failure("ICAL_NOT_CALENDAR", 502);

  try {
    const unfolded = ics.replace(/\r?\n[ \t]/g, "");
    const lines = unfolded.split(/\r?\n/);
    const events: string[][] = [];
    let current: string[] | null = null;

    for (const line of lines) {
      if (line === "BEGIN:VEVENT") current = [];
      else if (line === "END:VEVENT" && current) {
        events.push(current);
        current = null;
      } else if (current) current.push(line);
    }

    const busy = new Set<string>();
    const overrides = new Set<string>();

    for (const event of events) {
      const recurrenceId = valueOf(event, "RECURRENCE-ID");
      if (recurrenceId) {
        const original = parseDate(recurrenceId);
        if (original) overrides.add(dateOnly(original));
      }
    }

    for (const event of events) {
      if (
        valueOf(event, "STATUS")?.toUpperCase() === "CANCELLED"
      ) continue;

      const startValue = valueOf(event, "DTSTART");
      if (!startValue) continue;
      const start = parseDate(startValue);
      if (!start) continue;

      const endValue = valueOf(event, "DTEND");
      const end = endValue ? parseDate(endValue) : null;
      const duration = end && end > start ? end.getTime() - start.getTime() : 0;
      const rrule = valueOf(event, "RRULE");
      const recurrenceId = valueOf(event, "RECURRENCE-ID");

      if (recurrenceId) {
        addRange(busy, start, end || undefined);
        continue;
      }

      if (rrule) {
        const excluded = new Set(valuesOf(event, "EXDATE").map(v => parseDate(v)).filter((d): d is Date => !!d).map(dateOnly));
        const horizon = new Date();
        horizon.setUTCFullYear(horizon.getUTCFullYear() + 2);
        for (const occurrence of expandRule(start, rrule, horizon)) {
          const key = dateOnly(occurrence);
          if (excluded.has(key) || overrides.has(key)) continue;
          addRange(busy, occurrence, duration ? new Date(occurrence.getTime() + duration) : undefined);
        }
      } else {
        addRange(busy, start, end || undefined);
      }
    }

    return NextResponse.json(
      {busy: [...busy].sort(), source: "google-ical", eventCount: events.length},
      {headers: {"Cache-Control": "no-store"}}
    );
  } catch (error) {
    console.error("Calendar parsing failed", error);
    return failure("ICAL_PARSE_FAILED", 502);
  }
}
