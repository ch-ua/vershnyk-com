import {NextResponse} from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function dayKey(date: Date) {
  // sv-SE reliably formats YYYY-MM-DD on Node and in browsers.
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(date);
}

function addRange(busy: Set<string>, start: Date, end?: Date) {
  if (!Number.isFinite(start.getTime())) return;
  const final = end && Number.isFinite(end.getTime()) && end > start
    ? new Date(end.getTime() - 1) : start;
  const from = dayKey(start);
  const to = dayKey(final);
  // Work with calendar date strings rather than server-local time to avoid timezone shifts.
  let cursor = new Date(from + "T12:00:00Z");
  for (let i = 0; i < 370; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (key > to) break;
    busy.add(key);
    cursor = new Date(cursor.getTime() + 86400000);
  }
}

function failure(code: string, status: number) {
  // Do not expose the secret calendar URL or private event data.
  return NextResponse.json({error: "Calendar unavailable", code}, {
    status, headers: {"Cache-Control": "no-store"}
  });
}

export async function GET() {
  const url = process.env.GOOGLE_CALENDAR_ICAL_URL?.trim();
  if (!url) return failure("ICAL_URL_MISSING", 503);
  if (!/^https:\/\//i.test(url)) return failure("ICAL_URL_INVALID", 503);

  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store", redirect: "follow",
      headers: {"Accept": "text/calendar, text/plain;q=0.9, */*;q=0.5"},
      signal: AbortSignal.timeout(12000)
    });
  } catch (err) {
    console.error("Calendar feed request failed", err);
    return failure("ICAL_FETCH_FAILED", 502);
  }

  if (!response.ok) {
    console.error("Calendar feed returned HTTP", response.status);
    return failure("ICAL_HTTP_" + response.status, 502);
  }

  const ics = await response.text();
  if (!ics.includes("BEGIN:VCALENDAR")) {
    console.error("Calendar feed did not return iCalendar data");
    return failure("ICAL_NOT_CALENDAR", 502);
  }

  try {
    const ical = await import("node-ical");
    const parsed = ical.sync.parseICS(ics);
    const busy = new Set<string>();
    const now = new Date();
    const startWindow = new Date(now.getFullYear(), now.getMonth(), 1);
    const horizon = new Date(now.getFullYear() + 2, now.getMonth() + 1, 1);

    type Event = {
      type?: string; status?: string; transparency?: string;
      start?: Date; end?: Date;
      rrule?: {between: (start: Date, end: Date, inclusive: boolean) => Date[]};
      exdate?: Record<string, Date>;
    };
    let eventCount = 0;
    for (const raw of Object.values(parsed)) {
      const item = raw as Event;
      if (!item || item.type !== "VEVENT" ||
          item.status?.toUpperCase() === "CANCELLED" ||
          item.transparency?.toUpperCase() === "TRANSPARENT") continue;
      eventCount++;
      if (item.rrule) {
        const duration = item.start && item.end ? item.end.getTime() - item.start.getTime() : 0;
        const excluded = new Set(Object.values(item.exdate || {}).map(d => d.getTime()));
        for (const occurrence of item.rrule.between(startWindow, horizon, true)) {
          if (excluded.has(occurrence.getTime())) continue;
          addRange(busy, occurrence, duration > 0 ? new Date(occurrence.getTime() + duration) : undefined);
        }
      } else if (item.start) {
        addRange(busy, item.start, item.end);
      }
    }

    return NextResponse.json({busy: [...busy].sort(), source: "google-ical", eventCount}, {
      headers: {"Cache-Control": "no-store"}
    });
  } catch (err) {
    console.error("Calendar parsing failed", err);
    return failure("ICAL_PARSE_FAILED", 502);
  }
}
