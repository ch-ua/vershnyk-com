import {NextResponse} from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Part = "am" | "pm";
type Slots = Map<string, Set<Part>>;

const berlinDate = new Intl.DateTimeFormat("sv-SE", {timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit"});
const berlinHour = new Intl.DateTimeFormat("en-GB", {timeZone: "Europe/Berlin", hour: "2-digit", hourCycle: "h23"});

function mark(slots: Slots, day: string, part: Part) {
  const set = slots.get(day) ?? new Set<Part>();
  set.add(part);
  slots.set(day, set);
}

/** All-day event: Google's end date is EXCLUSIVE (a one-day event on the 19th ends on the 20th). */
function addAllDay(slots: Slots, startDate: string, endDate?: string) {
  const end = endDate && endDate > startDate ? endDate : null;
  let cursor = new Date(startDate + "T12:00:00Z");
  for (let i = 0; i < 400; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (end ? key >= end : key > startDate) break;
    mark(slots, key, "am");
    mark(slots, key, "pm");
    cursor = new Date(cursor.getTime() + 86400000);
  }
}

/** Timed event: morning = before 12:00 Berlin time, afternoon = from 12:00. */
function addTimed(slots: Slots, start: Date, end: Date) {
  if (!Number.isFinite(start.getTime())) return;
  const stop = Number.isFinite(end.getTime()) && end > start ? end.getTime() : start.getTime() + 1;
  const step = 15 * 60 * 1000;
  for (let t = start.getTime(); t < stop; t += step) {
    const d = new Date(t);
    mark(slots, berlinDate.format(d), Number(berlinHour.format(d)) < 12 ? "am" : "pm");
  }
  const last = new Date(stop - 1);
  mark(slots, berlinDate.format(last), Number(berlinHour.format(last)) < 12 ? "am" : "pm");
}

function serialize(slots: Slots) {
  const busy: string[] = [];
  const partial: Record<string, Part> = {};
  for (const [day, parts] of [...slots.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (parts.has("am") && parts.has("pm")) busy.push(day);
    else partial[day] = parts.has("am") ? "am" : "pm";
  }
  return {busy, partial};
}

function failure(code: string, status: number) {
  return NextResponse.json({error: "Calendar unavailable", code}, {status, headers: {"Cache-Control": "no-store"}});
}

/** Direct Google Calendar API. Service account (or API key) must have read access to the calendar. */
async function googleAccessToken(email: string, privateKey: string) {
  const {createSign} = await import("node:crypto");
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${encode({alg: "RS256", typ: "JWT"})}.${encode({iss: email, scope: "https://www.googleapis.com/auth/calendar.readonly", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600})}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${signer.sign(privateKey.replace(/\\n/g, "\n"), "base64url")}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", cache: "no-store",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: new URLSearchParams({grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion}),
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) throw new Error(`GOOGLE_AUTH_${response.status}`);
  const data = await response.json();
  if (typeof data.access_token !== "string") throw new Error("GOOGLE_TOKEN_MISSING");
  return data.access_token as string;
}

async function directGoogleCalendar() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || "vershnyk.com@gmail.com";
  const email = process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_PRIVATE_KEY;
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY?.trim();
  if (!(email && privateKey) && !apiKey) return null;
  const token = email && privateKey ? await googleAccessToken(email, privateKey) : null;
  const now = new Date();
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1));
  const until = new Date(Date.UTC(now.getUTCFullYear() + 2, now.getUTCMonth() + 1, 1));
  const slots: Slots = new Map();
  let pageToken: string | undefined;
  let eventCount = 0;
  for (let page = 0; page < 40; page++) {
    const endpoint = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
    endpoint.searchParams.set("singleEvents", "true");
    endpoint.searchParams.set("orderBy", "startTime");
    endpoint.searchParams.set("maxResults", "2500");
    endpoint.searchParams.set("timeMin", from.toISOString());
    endpoint.searchParams.set("timeMax", until.toISOString());
    if (pageToken) endpoint.searchParams.set("pageToken", pageToken);
    if (!token && apiKey) endpoint.searchParams.set("key", apiKey);
    const response = await fetch(endpoint, {cache: "no-store", headers: token ? {Authorization: `Bearer ${token}`} : {}, signal: AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error(`GOOGLE_EVENTS_HTTP_${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.items)) throw new Error("GOOGLE_EVENTS_INVALID");
    for (const event of data.items) {
      if (event.status === "cancelled" || event.transparency === "transparent") continue;
      if (event.start?.date) addAllDay(slots, event.start.date, event.end?.date);
      else if (typeof event.start?.dateTime === "string") addTimed(slots, new Date(event.start.dateTime), new Date(event.end?.dateTime ?? event.start.dateTime));
      else continue;
      eventCount++;
    }
    pageToken = typeof data.nextPageToken === "string" ? data.nextPageToken : undefined;
    if (!pageToken) return {...serialize(slots), source: "google-calendar-api", eventCount};
  }
  throw new Error("GOOGLE_EVENTS_PAGINATION_LIMIT");
}

/** Apps Script web app (see docs/apps-script-calendar.gs). Returns {busy:[...], partial:{date:"am"|"pm"}}. */
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyamwlocgK43OYO6DdowD6gvPB9JFer_Gv9Yse750CpnL-W_zoTOqsLpK5umOX3xB6Gjw/exec";
const isDay = (d: unknown) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);

async function appsScriptCalendar() {
  const response = await fetch(APPS_SCRIPT_URL, {cache: "no-store", redirect: "follow", signal: AbortSignal.timeout(20000), headers: {Accept: "application/json"}});
  if (!response.ok) throw new Error("APPS_SCRIPT_HTTP_" + response.status);
  const data = await response.json();
  if (!data || data.error || !Array.isArray(data.busy) || !data.busy.every(isDay)) throw new Error("APPS_SCRIPT_INVALID_DATA");
  const partial: Record<string, Part> = {};
  if (data.partial && typeof data.partial === "object") {
    for (const [day, part] of Object.entries(data.partial)) if (isDay(day) && (part === "am" || part === "pm")) partial[day] = part;
  }
  return {busy: [...new Set<string>(data.busy)].sort(), partial, source: "google-apps-script", eventCount: typeof data.eventCount === "number" ? data.eventCount : null};
}

export async function GET() {
  const headers = {"Cache-Control": "no-store, max-age=0"};
  try {
    const direct = await directGoogleCalendar();
    if (direct) return NextResponse.json(direct, {headers});
  } catch (error) {
    console.error("Direct Google Calendar API failed", error);
  }
  try {
    return NextResponse.json(await appsScriptCalendar(), {headers});
  } catch (error) {
    console.error("Apps Script calendar unavailable", error);
    return failure("CALENDAR_UNAVAILABLE", 502);
  }
}
