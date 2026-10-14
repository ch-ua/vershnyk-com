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

export async function GET() {
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
        valueOf(event, "STATUS")?.toUpperCase() === "CANCELLED" ||
        valueOf(event, "TRANSP")?.toUpperCase() === "TRANSPARENT"
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
